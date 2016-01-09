/// <reference path="typings/tsd.d.ts" />

import * as util from "util";
import * as _ from "lodash";
import * as Action from "./Action";
import * as Geo from "./Geo";
import {Player} from "./Player";
import {Map} from "./Map"
import {Server} from "./Server"

export class GameEventHandler {
    private static players: Player[]
    private static map: Map;
    private static finder

    constructor() {
        // Load the map
        GameEventHandler.map = new Map('../public/maps/map');

        // TODO: this should be somewhere else
        GameEventHandler.players = [];
    }

    public setEventHandlers() {
        // Socket.IO
        Server.io.on('connection', this.onSocketConnection);
    }

    // New socket connection
    private onSocketConnection(socket/*: SocketIO.Socket*/) {
        util.log('New player has connected: ' + socket.id);

        // Listen for client disconnected
        socket.on('disconnect', GameEventHandler.onClientDisconnect);

        // Listen for new player message
        socket.on('new player', GameEventHandler.onNewPlayer);

        // Listen for move player message
        socket.on('move player', GameEventHandler.onMoveRequest);
    }

    // Socket client has disconnected
    private static onClientDisconnect() {
        var socket: SocketIO.Socket = <any>this;

        util.log('Player has disconnected: ' + socket.id);

        var removePlayer = GameEventHandler.playerById(socket.id);

        // Player not found
        if (!removePlayer) {
            util.log('[Error: "remove player"] Player not found: ' + socket.id);
            return;
        };

        // Remove player from players array
        GameEventHandler.players.splice(GameEventHandler.players.indexOf(removePlayer), 1);

        // Destroy Player object
        removePlayer.destroy();

        // Broadcast removed player to connected socket clients
        socket.broadcast.emit('remove player', { id: socket.id });
    }

    // New player has joined
    private static onNewPlayer(data) {
        var socket: SocketIO.Socket = <any>this;

        // Create a new player
        var newPlayer: Player = new Player({ x: data.x, y: data.y });
        newPlayer.id = socket.id;

        // Broadcast new player to connected socket clients
        socket.broadcast.emit('new player', { id: newPlayer.id, x: newPlayer.gridPosition.x, y: newPlayer.gridPosition.y });

        // Send existing players to the new player
        var existingPlayer: Player;
        for (var i = 0; i < GameEventHandler.players.length; i++) {
            existingPlayer = GameEventHandler.players[i];
            socket.emit('new player', { id: existingPlayer.id, x: existingPlayer.gridPosition.x, y: existingPlayer.gridPosition.y });
        };

        // Add new player to the players array
        GameEventHandler.players.push(newPlayer);
    }

    // Player has moved
    private static onMoveRequest(pathObject) {
        var socket: SocketIO.Socket = <any>this;

        // Find player in array
        var movePlayer: Player = GameEventHandler.playerById(socket.id);

        // Player should exist
        if (!movePlayer) {
            util.log('[Error: "move player"] Player not found: ' + socket.id);
            return;
        }

        // Player should have moved
        var destinationPoint = pathObject.path[pathObject.path.length - 1];
        if (destinationPoint &&
            movePlayer.gridPosition.x == destinationPoint.x &&
            movePlayer.gridPosition.y == destinationPoint.y
        ) {
            return;
        }

        // Every case in path should be walkable TODO: check that all moves are from 1 case
        for (var i = 0; i < pathObject.path.length; i++) {
            if (!GameEventHandler.map.isCaseWalkable({ x: pathObject.path[i].x, y: pathObject.path[i].y })) {
                util.log('[Error: "move player"] The requested path isn\'t walkable');
                return;
            }
        }

        // Queue the list of actions
        if (movePlayer.idle) {
            for (var i = 0; i < pathObject.path.length; i++) {
                movePlayer.planAction(new Action.Move({ x: pathObject.path[i].x, y: pathObject.path[i].y }));
            }
        }
    }


    // Find player by ID
    private static playerById(id: string): Player {
        for (var i = 0; i < GameEventHandler.players.length; i++) {
            if (GameEventHandler.players[i].id == id)
                return GameEventHandler.players[i];
        };

        return null;
    }
}

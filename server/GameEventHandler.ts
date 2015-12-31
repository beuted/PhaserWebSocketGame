/// <reference path="typings/tsd.d.ts" />

import * as util from "util";
import * as _ from "lodash";
import {Player} from "./Player";
import * as Geo from "./Geo";
import {Server} from "./Server"

var PF = require("pathfinding");

export class GameEventHandler {
    private static players: Player[]
    private static map;
    private static finder

    constructor() {
        // init pathfind
        GameEventHandler.finder = new PF.AStarFinder();

        // Load the map
        GameEventHandler.map = require('../public/maps/map');

        // init walkable Map
        var walkableMatrix = [];
        for (var y = 0; y < GameEventHandler.map.sizeY; y++) {
            walkableMatrix.push([]);
            for (var x = 0; x < GameEventHandler.map.sizeX; x++) {
                walkableMatrix[y].push(_.includes(GameEventHandler.map.blocking, GameEventHandler.map.tiles[y][x]) ? 1 : 0);
            }
        }

        GameEventHandler.map.walkableGrid = new PF.Grid(walkableMatrix);

        // TODO: this shoudl be somewhere else
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
        socket.on('move player', GameEventHandler.onMovePlayer);
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

        // Broadcast removed player to connected socket clients
        socket.broadcast.emit('remove player', { id: socket.id });
    }

    // New player has joined
    private static onNewPlayer(data) {
        var socket: SocketIO.Socket = <any>this;

        // Create a new player
        var newPlayer: Player = new Player(new Geo.Point(data.x, data.y));
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
    private static onMovePlayer(data) {
        var socket: SocketIO.Socket = <any>this;

        // Find player in array
        var movePlayer: Player = GameEventHandler.playerById(socket.id);

        // Player not found
        if (!movePlayer) {
            util.log('[Error: "move player"] Player not found: ' + socket.id);
            return;
        }

        if (movePlayer.gridPosition.x == data.x && movePlayer.gridPosition.y == data.y) {
            return;
        }

        //var destTile = map.tiles[data.y][data.x];
        var path = GameEventHandler.finder.findPath(movePlayer.gridPosition.x, movePlayer.gridPosition.y, data.x, data.y, GameEventHandler.map.walkableGrid.clone());
        if (!path.length) {
            util.log('[Debug: "move player"] Player ' + socket.id + ' can\'t moved : (' + movePlayer.gridPosition.x + ', ' + movePlayer.gridPosition.y + ')=>(' + data.x + ', ' + data.y + ')');
            return;
        }

        // remove the first element which is not a move
        path.shift();

        util.log('[Debug: "move player"] Player ' + socket.id + ' moved : (' + movePlayer.gridPosition.x + ', ' + movePlayer.gridPosition.y + ')=>(' + data.x + ', ' + data.y + ')');

        // Update player position
        movePlayer.gridPosition.x = data.x;
        movePlayer.gridPosition.y = data.y;

        // Broadcast updated position to connected socket clients
        socket.broadcast.emit('move player', { id: movePlayer.id, path: path });
        socket.emit('move player', { id: movePlayer.id, path: path });
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

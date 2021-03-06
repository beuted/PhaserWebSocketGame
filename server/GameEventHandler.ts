/// <reference path="typings/tsd.d.ts" />

import * as util from "util";
import * as _ from "lodash";
import * as Action from "./Action";
import * as Geo from "./utils/Geo";
import {Player} from "./Player";
import {Map} from "./Map";
import {MapsHandler} from "./MapsHandler";
import {PlayersHandler} from "./PlayersHandler";
import {Server} from "./Server";

export class GameEventHandler {
    public static mapsHandler: MapsHandler;
    public static playersHandler: PlayersHandler;

    constructor() {
        // Init mapsHandler
        GameEventHandler.mapsHandler = new MapsHandler();

        GameEventHandler.playersHandler = new PlayersHandler();
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
        var mapCoord: Geo.IPoint = GameEventHandler.playersHandler.getPlayer(socket.id).mapPosition;

        // Remove player from playersHandler
        GameEventHandler.playersHandler.removePlayer(socket.id);

        // Broadcast removed player to connected socket clients on the same map
        var playersOnSameMap = GameEventHandler.playersHandler.getPlayersOnMap(mapCoord);
        _.forEach(playersOnSameMap, (player: Player) => {
            Server.io.sockets.connected[player.id].emit('remove player', { id: socket.id });
        });
    }

    // New player has joined
    private static onNewPlayer(data: any) {
        var socket: SocketIO.Socket = <any>this;

        // Create a new player
        var newPlayer: Player = new Player({ x: data.x, y: data.y });
        newPlayer.id = socket.id;

        // Broadcast new player to connected socket clients
        var playersOnSameMap = GameEventHandler.playersHandler.getPlayersOnMapWithoutId({ x: 0, y: 0 }, newPlayer.id);
        _.forEach(playersOnSameMap, (player: Player) => {
            Server.io.sockets.connected[player.id].emit('new player', newPlayer.toMessage());
        });

        // Send existing players & map to the new player
        var playersOnSameMapJson: any[] = [];
        _.forEach(playersOnSameMap, (player: Player) => {
            playersOnSameMapJson.push(player.toMessage());
        });

        var map = GameEventHandler.mapsHandler.getMap({ x: 0, y: 0 });
        socket.emit('init player', { existingPlayers: playersOnSameMapJson, map: map })

        // Add new player to the players array
        GameEventHandler.playersHandler.addPlayer(newPlayer);
    }

    // Player has moved
    private static onMoveRequest(pathObject) {
        var socket: SocketIO.Socket = <any>this;

        // Find player in array
        var movePlayer: Player = GameEventHandler.playersHandler.getPlayer(socket.id);

        // Player should exist
        if (!movePlayer) {
            util.log('[Error: "move player"] Player not found: ' + socket.id);
            return;
        }

        // For the moment accept only moves from player without any actions left
        if (!movePlayer.idle)
            return;

        // Every case in path should be walkable and less that 1 tile away
        Geo.Tools.distance
        if (Geo.Tools.distance(movePlayer.gridPosition, pathObject.path[0]) > 1 ||
            !movePlayer.map.isPathWalkable(pathObject.path)) {
           util.log('[Error: "move player"] Player ' + socket.id + ' asked for non-walkable path');
           return;
       }

        // Queue the list of actions
        for (var i = 0; i < pathObject.path.length; i++) {
            movePlayer.planAction(new Action.Move({ x: pathObject.path[i].x, y: pathObject.path[i].y }));
        }
    }
}

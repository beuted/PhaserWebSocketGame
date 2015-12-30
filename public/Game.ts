/// <reference path="typings/tsd.d.ts" />

import {Player} from "./src/Player";
import {GameContext} from "./src/GameContext";
import {Map} from "./src/Map";
import {TileType} from "./src/Map"

export class Game {
    constructor() {
        var debug = false;
        var socket: SocketIOClient.Socket;
        var player: Player;
        var remotePlayers: Player[];
        var map: Map;

        GameContext.init();

        var BasicGame: any = function (game) { };
        BasicGame.Boot = function(game) { };

        BasicGame.Boot.prototype =
        {
            preload: function () {
                GameContext.preload();
            },
            create: function() {

                // socket.io
                socket = io('http://' + window.location.hostname + ':8000');
                socket.on("connect", onSocketConnected);       // Socket connection successful
                socket.on("disconnect", onSocketDisconnect);   // Socket disconnection
                socket.on("new player", onNewPlayer);          // New player message received
                socket.on("move player", onMovePlayer);        // Player move message received
                socket.on("remove player", onRemovePlayer);    // Player removed message received

                // init map
                map = new Map();

                //init remotePlayers
                remotePlayers = [];

                // Set up our controls.
                this.cursors = GameContext.instance.input.keyboard.createCursorKeys();
                this.game.input.keyboard.addKeyCapture([
                    Phaser.Keyboard.LEFT,
                    Phaser.Keyboard.RIGHT,
                    Phaser.Keyboard.UP,
                    Phaser.Keyboard.DOWN,
                    Phaser.Keyboard.SPACEBAR
                ]);

                // press space to enter debugmode
                var space = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
                space.onDown.add(function() {
                    debug = !debug;
                }, this);

                // Capture click
                GameContext.instance.input.onUp.add(() => movePlayer(map.selectedTileGridCoord), this);
            },
            update: function () {
                map.update();

                if (player) { player.update(); }

                updateRemotePlayers();

            },
            render: function() {
                if (debug) {
                    Map.isoGroup.forEach(function(tile) {
                        GameContext.instance.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
                    }, this);
                    GameContext.instance.debug.text(!!GameContext.instance.time.fps ? "" + GameContext.instance.time.fps : '--', 2, 14, "#a7aebe");
                }
            }
        };

        GameContext.boot(BasicGame.Boot);

        function movePlayer(point: Phaser.Point) {
            if (!point || player.movesToPerform.length || isTileOccupied(point.x, point.y) || !map.isCaseAccessible(point.x, point.y))
                return;

            console.log("sent move request: " + point.x + ", " + point.y);
            socket.emit("move player", { x: point.x, y: point.y });
        }

        function isTileOccupied(x, y) {
            for (var i = 0; i < remotePlayers.length; i++ ) {
                if (remotePlayers[i].gridPosition.x == x && remotePlayers[i].gridPosition.y == y) {
                    return true;
                }
            }

            return false
        }


        // Socket connected
        function onSocketConnected() {
            console.log("Connected to socket server as " + socket.io.engine.id);

            player = new Player(1, 1, socket.io.engine.id, true);
            GameContext.player = player;

            // Send local player data to the game server
            socket.emit("new player", {x: player.gridPosition.x, y: player.gridPosition.y});

        };

        // Socket disconnected
        function onSocketDisconnect() {
            console.log("Disconnected from socket server");
        };

        // New player
        function onNewPlayer(data: any) {
            console.log("New player connected: " + data.id);

            // Initialise the new player
            var newPlayer = new Player(data.x, data.y, data.id);

            // Add new player to the remote players array
            remotePlayers.push(newPlayer);
        };

        // Move player
        function onMovePlayer(data: any) {
            if (player.id === data.id) {
                player.move(data.path);
                return;
            }

            var playerToMove = playerById(data.id);
            if (!playerToMove) {
                console.log("Player not found: " + data.id);
                return;
            };

            // Update player position
            playerToMove.move(data.path)
        };

        // Remove player
        function onRemovePlayer(data) {
            var removePlayer = playerById(data.id);

            // Player not found
            if (!removePlayer) {
                console.log("Player not found: " + data.id);
                return;
            };

            removePlayer.destroy();

            // Remove player from array
            remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
        };

        function updateRemotePlayers() {
            remotePlayers.forEach(function (p: Player) {
                p.update();
            });
        }

        // UTILS: Find player by ID
        function playerById(id): Player {
            for (var i = 0; i < remotePlayers.length; i++) {
                if (remotePlayers[i].id == id)
                    return remotePlayers[i];
            };

            return null;
        };

    }
}

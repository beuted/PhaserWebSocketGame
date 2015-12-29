/// <reference path="typings/tsd.d.ts" />

import {Player} from "./src/Player";
import {GameContext} from "./src/GameContext";
import {Map} from "./src/Map";
import {TileType} from "./src/Map"

export class Game {
    constructor() {
        var debug = false;
        var socket: SocketIOClient.Socket;
        var player;
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

                // init map
                map = new Map();

                //init remotePlayers
                remotePlayers = [];

                // init player
                player = GameContext.instance.add.isoSprite(2 * 32, 2 * 32, 48, 'fairy_anim', 0, Map.isoGroup);
                player.anchor.set(0.5, 0.5);
                player.gridPosition = new Phaser.Point(2, 2);
                player.isMoving = false;
                player.scale.set(0.5);
                player.smoothed = false;
                player.animations.add('fly').play(10, true);


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

                // socket.io
                socket = io('http://' + window.location.hostname + ':8000');

                // Socket connection successful
                socket.on("connect", onSocketConnected);

                // Socket disconnection
                socket.on("disconnect", onSocketDisconnect);

                // New player message received
                socket.on("new player", onNewPlayer);

                // Player move message received
                socket.on("move player", onMovePlayer);

                // Player removed message received
                socket.on("remove player", onRemovePlayer);
            },
            update: function () {
                map.update();

                // keyboard actions
                if (this.cursors.up.isDown) {
                    movePlayer(0, -1);
                } else if (this.cursors.down.isDown) {
                    movePlayer(0, 1);
                } else if (this.cursors.left.isDown) {
                    movePlayer(-1, 0);
                } else if (this.cursors.right.isDown) {
                    movePlayer(1, 0);
                }

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

        function movePlayer(x, y) {
            if (player.isMoving) { return; }

            var destPoint = new Phaser.Point(player.gridPosition.x + x, player.gridPosition.y + y);

            if (!map.isCaseAccessible(destPoint.x, destPoint.y))
                return;

            if (isTileOccupied(destPoint.x, destPoint.y))
                return;

            player.isMoving = true;
            player.gridPosition.x += x;
            player.gridPosition.y += y;
            socket.emit("move player", { x: player.gridPosition.x, y: player.gridPosition.y });

            // doing it this way means the player's position will always be a multiple of 32
            GameContext.instance.add.tween(player.body).to({x: player.gridPosition.x * 32, y: player.gridPosition.y * 32}, 250, Phaser.Easing.Linear.None, true)
                .onComplete.add(function() { player.isMoving = false;}, this);
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
            console.log("Connected to socket server");

            // Send local player data to the game server
            socket.emit("new player", {x: player.gridPosition.x, y: player.gridPosition.y});
        };

        // Socket disconnected
        function onSocketDisconnect() {
            console.log("Disconnected from socket server");
        };

        // New player
        function onNewPlayer(data) {
            console.log("New player connected: " + data.id);

            // Initialise the new player
            var newPlayer = new Player(2, 2, data.id);

            // Add new player to the remote players array
            remotePlayers.push(newPlayer);
        };

        // Move player
        function onMovePlayer(data) {
            var playerToMove = playerById(data.id);

            // Player not found
            if (!playerToMove) {
                console.log("Player not found: " + data.id);
                return;
            };

            // Update player position
            playerToMove.move(data.x, data.y)
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

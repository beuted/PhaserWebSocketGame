/// <reference path="typings/tsd.d.ts" />

import {Player} from "./src/Player";
import {GameContext} from "./src/GameContext";
import {Map} from "./src/Map";
import {TileType} from "./src/Map"
import {LoadState} from "./src/states/LoadState";

export class Game {
    constructor() {
        GameContext.init();

        var BasicGame: any = function (game) { };
        BasicGame.Boot = function(game) { };

        BasicGame.Boot.prototype =
        {
            preload: function () {
                GameContext.preload();
            },
            create: function() {

                // init GameContext (map, keyboard controls, socketManager, remote players, ...TODO)
                GameContext.create();

                // Capture click
                GameContext.instance.input.onUp.add(() => movePlayer(GameContext.map.selectedTileGridCoord), this);
            },
            update: function () {
                GameContext.update();
            },
            render: function() {
                if (GameContext.debugActivated) {
                    Map.isoGroup.forEach(function(tile) {
                        GameContext.instance.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
                    }, this);
                    GameContext.instance.debug.text(!!GameContext.instance.time.fps ? GameContext.instance.time.fps + ' fps' : '--', 2, 14, "#a7aebe");
                }
            }
        };

        GameContext.instance.state.add('Game', BasicGame.Boot);
        GameContext.instance.state.add('Load', LoadState);
        GameContext.instance.state.start('Load');

        //TODO: this should be in a class handling current player actions
        function movePlayer(toPoint: Phaser.Point) {
            if (!toPoint || GameContext.remotePlayersManager.arePresentAt(toPoint))
                return;

            GameContext.map.findPath(GameContext.player.gridPosition, toPoint)
            .then((path: any[]) => {
                GameContext.socketManager.requestPlayerMove(path);
            })
            .catch((error: string) => {
                console.debug("[movePlayer] Could not find path to point: (" + toPoint.x + ", " + toPoint.y + ") : " + error);
            })
        }
    }
}

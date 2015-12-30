/// <reference path="typings/tsd.d.ts" />

import {Player} from "./src/Player";
import {GameContext} from "./src/GameContext";
import {Map} from "./src/Map";
import {TileType} from "./src/Map"

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

        GameContext.boot(BasicGame.Boot);

        //TODO: this should be in a class handling current player actions
        function movePlayer(point: Phaser.Point) {
            if (!point || GameContext.player.movesToPerform.length || GameContext.remotePlayersManager.arePresentAt(point.x, point.y) || !GameContext.map.isCaseAccessible(point.x, point.y))
                return;

            GameContext.socketManager.requestPlayerMove(point);
        }
    }
}

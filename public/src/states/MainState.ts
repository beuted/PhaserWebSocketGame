/// <reference path="../../typings/tsd.d.ts" />

import {GameContext} from "../GameContext";
import {Map} from "../Map";
import {Player} from "../Player";

export class MainState {
    public preload() {}

    public create() {
        // init GameContext (map, keyboard controls, socketManager, remote players, ...TODO)
        GameContext.create();

        // Capture click
        GameContext.instance.input.onUp.add(() => this.movePlayer(GameContext.map.selectedTileGridCoord), this);
    }

    public update() {
        GameContext.update();
    }

    public render() {
        if (GameContext.debugActivated) {
            Map.isoGroup.forEach(function(tile) {
                GameContext.instance.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
            }, this);
            GameContext.instance.debug.text(!!GameContext.instance.time.fps ? GameContext.instance.time.fps + ' fps' : '--', 2, 14, "#a7aebe");
        }
    }

    //TODO: this should be in a class handling current player actions
    private movePlayer(toPoint: Phaser.Point) {
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

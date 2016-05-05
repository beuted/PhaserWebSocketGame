/// <reference path="../typings/tsd.d.ts" />
import {Player} from "./Player";
import {Map} from "./Map";
import {RemotePlayersManager} from "./RemotePlayersManager";
import {SocketManager} from "./SocketManager";

export class GameContext {
    static instance: Phaser.Plugin.Isometric.Game;
    static player: Player;
    static remotePlayersManager: RemotePlayersManager;
    static map: Map;
    static socketManager: SocketManager;

    static debugActivated: boolean;

    static init() {
        // using canvas here just because it runs faster for the body debug stuff
        GameContext.instance = <Phaser.Plugin.Isometric.Game> new Phaser.Game(1000, 800, Phaser.CANVAS, 'gameCanvas', null, true, false);
        this.debugActivated = false;
    }

    static create() {
        this.socketManager = new SocketManager();
        this.map = new Map();
        this.remotePlayersManager = new RemotePlayersManager();

        GameContext.instance.input.keyboard.addKeyCapture([
            Phaser.Keyboard.SPACEBAR
        ]);

        // TODO: (wip) Add loader callbacks
        GameContext.instance.load.onLoadComplete.add(() => {
            console.debug("[Loader] Load complete");
        }, this);

        // press space to enter debugmode
        var space = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(function() {
            this.debugActivated = !this.debugActivated;
        }, this);
    }

    static update() {
        // update the map
        this.map.update();
    }
}

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

    static create() {
        if(!this.socketManager) this.socketManager = new SocketManager();
        if(!this.map)  this.map = new Map();
        if(!this.remotePlayersManager) this.remotePlayersManager = new RemotePlayersManager();

        // TODO: (wip) Add loader callbacks
/*        GameContext.instance.load.onLoadComplete.add(() => {
            console.debug("[Loader] Load complete");
        }, this);*/
    }

    static update() {
        // update the map
        this.map.update();
    }
}

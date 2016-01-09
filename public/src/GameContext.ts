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

    static preload() {
        GameContext.instance.time.advancedTiming = true;
        GameContext.instance.debug.renderShadow = false;
        GameContext.instance.stage.disableVisibilityChange = true; // Don't stop the game when running in background

        GameContext.preloadAssets();
        GameContext.preloadIsometricPlugin();
    }

    static update() {
        // update the map
        this.map.update();
    }

    static boot(boot: any) {
        GameContext.instance.state.add('Boot', boot);
        GameContext.instance.state.start('Boot');
    }

    private static preloadAssets() {
        GameContext.instance.load.json('map-initial', 'maps/map.0.0.json');
        GameContext.instance.load.atlasJSONHash('tileset', 'assets/tileset.png', 'assets/tileset.json');
        GameContext.instance.load.image('cube', 'assets/cube.png');
        GameContext.instance.load.spritesheet('fairy_anim', 'assets/fairy.png', 96, 96, 16);
        //GameContext.instance.load.atlasJSONHash('tileset', 'assets/tileset-mod.png', 'assets/tileset-mod.json'); // Attempt to do better
    }

    private static preloadIsometricPlugin() {
        GameContext.instance.plugins.add(Phaser.Plugin.Isometric, GameContext.instance);
        GameContext.instance.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        GameContext.instance.iso.anchor.setTo(0.5, 0.1);
    }
}

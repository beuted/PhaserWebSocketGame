/// <reference path="../typings/tsd.d.ts" />

export class GameContext {
    static instance: Phaser.Plugin.Isometric.Game;

    static init() {
        // using canvas here just because it runs faster for the body debug stuff
        GameContext.instance = <Phaser.Plugin.Isometric.Game> new Phaser.Game(800, 400, Phaser.CANVAS, 'gameCanvas', null, true, false);
    }

    static preload() {
        GameContext.instance.time.advancedTiming = true;
        GameContext.instance.debug.renderShadow = false;
        GameContext.instance.stage.disableVisibilityChange = true; // Don't stop the game when running in background

        GameContext.preloadAssets();
        GameContext.preloadIsometricPlugin();
    }

    static boot(boot: any) {
        GameContext.instance.state.add('Boot', boot);
        GameContext.instance.state.start('Boot');
    }

    private static preloadAssets() {
        GameContext.instance.load.json('map', 'maps/map.json');
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

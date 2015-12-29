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
        GameContext.instance.stage.disableVisibilityChange = true;

        GameContext.preloadAssets();
        GameContext.preloadIsometricPlugin();
    }

    static boot(boot: any) {
        GameContext.instance.state.add('Boot', boot);
        GameContext.instance.state.start('Boot');
    }

    private static preloadAssets() {
        GameContext.instance.load.atlasJSONHash('tileset', 'assets/tileset.png', 'assets/tileset.json');
        GameContext.instance.load.image('player', 'assets/cube.png');
    }

    private static preloadIsometricPlugin() {
        GameContext.instance.plugins.add(Phaser.Plugin.Isometric, GameContext.instance);
        GameContext.instance.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        GameContext.instance.iso.anchor.setTo(0.5, 0.1);
    }

}

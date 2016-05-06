/// <reference path="../../typings/tsd.d.ts" />

import {GameContext} from "../GameContext";

export class LoadState
{
    public preload() {
        console.debug('Entering LoadState');

        //Display Loading screen
        GameContext.instance.add.text(80, 150, 'loading...', { font: '30px Courier', fill: '#ffffff' });

        GameContext.instance.time.advancedTiming = true;
        GameContext.instance.debug.renderShadow = false;
        GameContext.instance.stage.disableVisibilityChange = true; // Don't stop the game when running in background

        this.preloadAssets();
    }

    public create() {
        GameContext.instance.state.start('Main');
    }

    public update() {}

    public render() {}

    private preloadAssets() {
        GameContext.instance.load.json('map.0.0', 'maps/map.0.0.json');
        GameContext.instance.load.atlasJSONHash('tileset', 'assets/tileset.png', 'assets/tileset.json');
        GameContext.instance.load.image('cube', 'assets/cube.png');
        GameContext.instance.load.spritesheet('fairy_anim', 'assets/fairy.png', 96, 96, 16);
        //GameContext.instance.load.atlasJSONHash('tileset', 'assets/tileset-mod.png', 'assets/tileset-mod.json'); // Attempt to do better
    }
}

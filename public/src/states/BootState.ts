/// <reference path="../../typings/tsd.d.ts" />

import {GameContext} from "../GameContext";

export class BootState
{
    public preload() {}

    public create() {
        GameContext.instance.plugins.add(Phaser.Plugin.Isometric, GameContext.instance);
        GameContext.instance.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        GameContext.instance.iso.anchor.setTo(0.5, 0.1);

        GameContext.instance.state.start('Load');
    }

    public update() {}

    public render() {}
};

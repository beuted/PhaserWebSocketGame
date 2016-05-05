/// <reference path="typings/tsd.d.ts" />

import {GameContext} from "./src/GameContext";
import {BootState} from "./src/states/BootState";
import {LoadState} from "./src/states/LoadState";
import {MainState} from "./src/states/MainState";

export class Game {
    constructor() {
        // using canvas here just because it runs faster for the body debug stuff
        GameContext.instance = <Phaser.Plugin.Isometric.Game>new Phaser.Game(1000, 800, Phaser.CANVAS, 'gameCanvas', null, true, false);
        GameContext.debugActivated = false;

        GameContext.instance.state.add('Boot', new BootState());
        GameContext.instance.state.add('Load', new LoadState());
        GameContext.instance.state.add('Game', new MainState());

        GameContext.instance.state.start('Boot');
    }
}

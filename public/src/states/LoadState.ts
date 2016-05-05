/// <reference path="../../typings/tsd.d.ts" />

import {GameContext} from "../GameContext";

export class LoadState
{
    public preload() {
        GameContext.instance.add.text(80, 150, 'loading...', { font: '30px Courier', fill: '#ffffff' });
        GameContext.preload();
    }

    public create() {
        GameContext.instance.state.start('Game');
    }

    public update() {
        GameContext.update();
    }

    public render() {

    }
};

/// <reference path="../../typings/tsd.d.ts" />

import {GameContext} from "../GameContext";

export class FightState
{
    private fightText: Phaser.Text;

    public preload() {
        console.debug('Entering FightState');

        this.fightText = GameContext.instance.add.text(350, 100, 'You are in fight', { font: '30px Courier', fill: '#ffffff' });
    }

    public create() {
        this.initKeyboardInteraction();
    }

    public update() {}

    public render() {
        GameContext.update();
    }

    public shutdown() {
        this.fightText.destroy();
    }

    private initKeyboardInteraction() {
        GameContext.instance.input.keyboard.addKeyCapture([
            Phaser.Keyboard.D,
            Phaser.Keyboard.SPACEBAR
        ]);

        // press D to enter debugmode
        var dKey = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.D);
        dKey.onDown.add(function() {
            GameContext.debugActivated = !GameContext.debugActivated;
        }, this);

        // press space to enter main state
        var space = GameContext.instance.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(function() {
            //don't clear the game world but cache
            GameContext.instance.state.start('Main', false, true);
        }, this);
    }
}

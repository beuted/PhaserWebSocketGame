/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {Map} from "./Map";

export class Player {
    public sprite: any;
    public gridPosition: Phaser.Point;
    public id: string;
    public movesToPerform: number[][];

    private isMoving: boolean;

    constructor(startX: number, startY: number, id: string, current: boolean = false) {
        // setting up the sprite
        //this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 48, 'cube', 0, Map.isoGroup); // old cube sprite
        this.sprite = GameContext.instance.add.isoSprite(1 * 32, 1 * 32, 48, 'fairy_anim', 0, Map.isoGroup);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(0.5);
        this.sprite.smoothed = false;
        this.sprite.animations.add('fly2').play(10, true);

        // differenciate other players
        if (!current)
            this.sprite.alpha = 0.7;

        // setting up custom parameters
        this.gridPosition = new Phaser.Point(startX, startY);
        this.isMoving = false;
        this.id = id;

        this.movesToPerform = [];
    }

    move(path: number[][]) {
        this.movesToPerform = this.movesToPerform.concat(path)
    }

    update() {
        if (this.movesToPerform.length && !this.isMoving) {
            this.isMoving = true;
            GameContext.instance.add.tween(this.sprite.body).to({ x: this.movesToPerform[0][0] * 32, y: this.movesToPerform[0][1] * 32}, 250, Phaser.Easing.Linear.None, true)
                .onComplete.add(function() {
                    this.isMoving = false;
                    this.movesToPerform.shift();
                }, this);
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}

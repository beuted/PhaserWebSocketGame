/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {Map} from "./Map";

export class Player {
    sprite: any;
    gridPosition: Phaser.Point;
    isMoving: boolean;
    id: string;

    constructor(startX: number, startY: number, id: string) {
        // setting up the sprite
        //this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 48, 'cube', 0, Map.isoGroup); // old cube sprite

        this.sprite = GameContext.instance.add.isoSprite(2 * 32, 2 * 32, 48, 'fairy_anim', 0, Map.isoGroup);
        this.sprite.alpha = 0.7;
        this.sprite.anchor.set(0.5);
        this.sprite.gridPosition = new Phaser.Point(2, 2);
        this.sprite.isMoving = false;
        this.sprite.scale.set(0.5);
        this.sprite.smoothed = false;
        this.sprite.animations.add('fly2').play(10, true);


        // setting up custom parameters
        this.gridPosition = new Phaser.Point(startX, startY);
        this.isMoving = false;
        this.id = id;
    }

    move(x: number, y: number) {
        this.gridPosition.x = x;
        this.gridPosition.y = y;
    }

    update() {
        if (!this.isMoving) {
            this.isMoving = true;
            GameContext.instance.add.tween(this.sprite.body).to({ x: this.gridPosition.x * 32, y: this.gridPosition .y * 32}, 250, Phaser.Easing.Linear.None, true)
                .onComplete.add(function() { this.isMoving = false;}, this);
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}

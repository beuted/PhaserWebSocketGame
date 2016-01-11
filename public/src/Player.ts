/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {Map} from "./Map";

export class Player {
    public sprite: any;
    public gridPosition: Phaser.Point;
    public visionRadius: number;
    public id: string;

    constructor(startX: number, startY: number, id: string, current: boolean = false) {
        // setting up the sprite
        //this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 48, 'cube', 0, Map.isoGroup); // old cube sprite
        this.sprite = GameContext.instance.add.isoSprite(startX * 32, startY * 32, 48, 'fairy_anim', 0, Map.isoGroup);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(0.5);
        this.sprite.smoothed = false;
        this.sprite.animations.add('fly2').play(10, true);

        // differenciate other players
        if (!current)
            this.sprite.alpha = 0.7;

        // setting up custom parameters
        this.gridPosition = new Phaser.Point(startX, startY);
        this.visionRadius = 7;
        this.id = id;
    }

    public move(destPoint: any) {
        this.gridPosition.x = destPoint.x;
        this.gridPosition.y = destPoint.y;
        GameContext.instance.add.tween(this.sprite.body).to({ x: destPoint.x * 32, y: destPoint.y * 32 }, 250, Phaser.Easing.Linear.None, true)
    }

    public moveInstant(destPoint: Phaser.Point) {
        this.gridPosition = destPoint;
        this.sprite.x = destPoint.x * 32;
        this.sprite.y = destPoint.y * 32;
        //GameContext.instance.add.tween(this.sprite.body).to({ x: destPoint.x * 32, y: destPoint.y * 32 }, 250, Phaser.Easing.Linear.None, true)
    }

    public destroy() {
        this.sprite.destroy();
    }
}

/// <reference path="typings/tsd.d.ts" />

// File containing Geometry class to help in the backend code since we are not going
// to import Phaser.io there

export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

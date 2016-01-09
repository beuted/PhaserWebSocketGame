/// <reference path="typings/tsd.d.ts" />

// File containing Geometry class to help in the backend code since we are not going
// to import Phaser.io there

export interface IPoint {
    x: number;
    y: number;
}

export class Tools {
	static distance(a: IPoint, b: IPoint): number {
		return Math.abs((a.x - b.x) + (a.y - b.y));
	}
}

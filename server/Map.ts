/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./Geo";

export class Map {
    private tiles: number[][];
    private sizeX: number;
    private sizeY: number;
    private walkables: number[];
    private opaque: number[];

    constructor(file: string) {
        var mapJson: any = require(file);
        this.tiles = mapJson.tiles;
        this.sizeX = mapJson.sizeX
        this.sizeY = mapJson.sizeY
        this.walkables = mapJson.walkables
        this.opaque = mapJson.opaque
    }

    public get size(): Geo.IPoint {
        return { x: this.sizeX, y: this.sizeY }
    }

    public isCaseWalkable(point: Geo.IPoint): boolean {
        return _.includes(this.walkables, this.getCase({ x: point.x, y: point.y }));
    }

    public getCase(point: Geo.IPoint): any {
        return this.tiles[point.y][point.x]
    }

    public isPathWalkable(path: Geo.IPoint[]) {
        // Every case in path should be walkable and distant from one case
        var prevPoint: Geo.IPoint = null;

        for (var i = 0; i < path.length; i++) {
            if (!this.isCaseWalkable(path[i]))
                return false;
            if (prevPoint && Geo.Tools.distance(path[i], prevPoint) > 1)
                return false;
            prevPoint = path[i];
        }
        return true;
    }
}

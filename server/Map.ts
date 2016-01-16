/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./Geo";

export class Map {
    private tiles: number[][];
    private size: Geo.IPoint;
    private walkables: number[];
    private opaques: number[];
    private coord: Geo.IPoint;

    constructor(tiles: number[][], size: Geo.IPoint, walkables: number[], opaques: number[], coord: Geo.IPoint) {
        this.tiles = tiles;
        this.size = size;
        this.walkables = walkables
        this.opaques = opaques
        this.coord = coord;
    }

    public isCaseWalkable(point: Geo.IPoint): boolean {
        return _.includes(this.walkables, this.getCase({ x: point.x, y: point.y }));
    }

    public getSize(): Geo.IPoint {
        return this.size;
    }

    public getCase(point: Geo.IPoint): any {
        return this.tiles[point.y][point.x]
    }

    public getCoord(): Geo.IPoint {
        return this.coord;
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

    public toMessage(): any {
        return {
            tiles: this.tiles,
            size: this.size,
            walkables: this.walkables,
            opaques: this.opaques,
            coord: this.coord
        }
    }
}

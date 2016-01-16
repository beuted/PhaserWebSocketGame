/// <reference path="typings/tsd.d.ts" />

import * as Geo from "./Geo";
import {Map} from "./Map";

export class MapGenerator {
    private seed: number;
    private walkables: number[];
    private opaques: number[];
    private size: Geo.IPoint;

    constructor(seed: number) {
        this.seed = seed;
        this.walkables = [1, 2, 3, 4, 5, 6, 7];
        this.opaques = [8, 9, 10, 11];
        this.size = { x: 16, y: 16 };
    }

    public generate(coord: Geo.IPoint): Map {
        var mapJson: any = require('../public/maps/map.' + coord.x + "." + coord.y);
        return new Map(mapJson.tiles, this.size, this.walkables, this.opaques, coord);
    }
}

/// <reference path="typings/tsd.d.ts" />

import * as Geo from "./Geo";
import {Map} from "./Map";
import * as seedrandom from "seedrandom";

export class MapGenerator {
    private rng: any;
    private seed: string;
    private walkables: number[];
    private opaques: number[];
    private size: Geo.IPoint;

    constructor(seed: string) {
        this.rng = seedrandom(seed);
        this.seed = seed;
        this.walkables = [1, 2, 3, 4, 5, 6, 7];
        this.opaques = [8, 9, 10, 11];
        this.size = { x: 16, y: 16 };
    }

    public generate(coord: Geo.IPoint): Map {
        var mapJson: any = require('../public/maps/map.' + coord.x + "." + coord.y);
        console.log(this.rng());

        return new Map(mapJson.tiles, this.size, this.walkables, this.opaques, coord);
    }
}

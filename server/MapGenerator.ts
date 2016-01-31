/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./utils/Geo";
import {CoordDic, ICoordObject} from "./utils/CoordDic";
import {Map} from "./Map";
import * as seedrandom from "seedrandom";
import * as Voronoi from "voronoi";

class MapSeed implements ICoordObject {
    public biome: number;
    public isBorder: boolean;

    private coord: Geo.IPoint;

    constructor(coord: Geo.IPoint, biome: number, isBorder: boolean) {
        this.coord = coord;
        this.biome = biome;
        this.isBorder = isBorder;
    }

    public getCoord(): Geo.IPoint {
        return this.coord;
    }
}

class MapSeedDic extends CoordDic<MapSeed> {
    constructor() {
        super();
    }
}

export class MapGenerator {
    private rng: any;
    private seed: string;
    private walkables: number[];
    private opaques: number[];
    private size: Geo.IPoint;
    private mapSeeds: MapSeedDic;

    private mapForest: any;
    private mapDesert: any;
    private mapBorder: any;

    constructor(seed: string) {
        this.mapSeeds = new MapSeedDic();
        this.rng = seedrandom(seed);
        this.seed = seed;

        this.walkables = [1, 2, 3, 4, 5, 6, 7];
        this.opaques = [8, 9, 10, 11, 13];
        this.size = { x: 16, y: 16 };

        this.initSampleMaps();
        this.buildMapSeeds();
    }

    public generate(coord: Geo.IPoint): Map {
        var mapSeed = this.mapSeeds.get(coord);

        var mapJson;
        if (mapSeed.isBorder)
            mapJson = this.mapBorder;
        else if (mapSeed.biome == 0)
            mapJson = this.mapForest;
        else
            mapJson = this.mapDesert;

        return new Map(mapJson.tiles, this.size, this.walkables, this.opaques, coord);
    }

    private initSampleMaps() {
        this.mapBorder = require('../public/maps/map-biome-border');
        this.mapForest = require('../public/maps/map-biome-forest');
        this.mapDesert = require('../public/maps/map-biome-desert');
    }

    private buildMapSeeds() {
        var voronoi = new Voronoi();
        var bbox = { xl: 0, xr: 100, yt: 0, yb: 100 }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
        var sites = [{ x: 23, y: 20 }, { x: 22, y: 43 }, { x: 21, y: 77 }, { x: 52, y: 27 }, { x: 51, y: 53 }, { x: 54, y: 70 }, { x: 71, y: 24 }, { x: 73, y: 51 }, { x: 71, y: 73 }];

        var diagram = voronoi.compute(sites, bbox);

        for (var i = 0; i < diagram.cells.length; i++) {
            var polygone = Geo.Tools.getCasesInPolygone(diagram.cells[i].halfedges);
            var edges = Geo.Tools.getCasesInPolygoneEdges(diagram.cells[i].halfedges);

            _.forEach(polygone, (point: Geo.IPoint) => {
                this.mapSeeds.add(new MapSeed(point, i % 2, false))
            }, this);

            _.forEach(edges, (point: Geo.IPoint) => {
                this.mapSeeds.add(new MapSeed(point, i % 2, true))
            }, this);
        }
    }
}

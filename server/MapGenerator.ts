/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./utils/Geo";
import {CoordDic, ICoordObject} from "./utils/CoordDic";
import {Map} from "./Map";
import * as seedrandom from "seedrandom";
import * as Voronoi from "voronoi";

interface MapEntries {
    south;
    est;
    west;
    north;
}

class MapSeed implements ICoordObject {
    private coord: Geo.IPoint;
    public entries: MapEntries;

    constructor(coord: Geo.IPoint, entries: MapEntries) {
        this.coord = coord;
        this.entries = entries;
    }

    public getCoord(): Geo.IPoint {
        return this.coord;
    }
}

//TODO: extract generic part
class MapSeedDic extends CoordDic<MapSeed> {
    constructor() {
        super();
    }

    public getMapEntriesConstraint(coord: Geo.IPoint): MapEntries {
        var mapEntry: MapEntries = { south: null, north: null, est: null, west: null };

        var northMapSeed = this.get({ x: coord.x,     y: coord.y - 1 });
        var southMapSeed = this.get({ x: coord.x,     y: coord.y + 1 });
        var westMapSeed  = this.get({ x: coord.x - 1, y: coord.y     });
        var estMapSeed   = this.get({ x: coord.x + 1, y: coord.y     });

        if (northMapSeed)
            mapEntry.north = northMapSeed.entries.south;
        if (southMapSeed)
            mapEntry.south = southMapSeed.entries.north;
        if (estMapSeed)
            mapEntry.est = estMapSeed.entries.west;
        if (westMapSeed)
            mapEntry.west = westMapSeed.entries.est;
        return mapEntry;
    }
}

export class MapGenerator {
    private rng: any;
    private seed: string;
    private walkables: number[];
    private opaques: number[];
    private size: Geo.IPoint;
    private mapSeeds: MapSeedDic;

    private sampleMaps: any[];

    constructor(seed: string) {
        this.mapSeeds = new MapSeedDic();
        this.rng = seedrandom(seed);
        this.seed = seed;
        this.walkables = [1, 2, 3, 4, 5, 6, 7];
        this.opaques = [8, 9, 10, 11, 13];
        this.size = { x: 16, y: 16 };

        this.initSampleMaps();

        var voronoi = new Voronoi();
        var bbox = { xl: 0, xr: 100, yt: 0, yb: 100 }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
        var sites = [{ x: 23, y: 20 }, { x: 22, y: 43 }, { x: 21, y: 77 }, { x: 52, y: 27 }, { x: 51, y: 53 }, { x: 54, y: 70 }, { x: 71, y: 24 }, { x: 73, y: 51 }, { x: 71, y: 73 }];

        var diagram = voronoi.compute(sites, bbox);

        var polygone = Geo.Tools.getCasesInPolygone(diagram.cells[5].halfedges);

        var polygones = [];
        for (var i = 0; i < diagram.cells.length; i++) {
            var polygone = Geo.Tools.getCasesInPolygone(diagram.cells[i].halfedges);
            polygones.push(polygone);
        }

        console.log(JSON.stringify(polygones));
    }

    public generate(coord: Geo.IPoint): Map {
        var mapEntryContraints: MapEntries = this.mapSeeds.getMapEntriesConstraint(coord);

        var acceptableSamples = _.filter(this.sampleMaps, (sampleMap: any) => {
            return (mapEntryContraints.north == null || sampleMap.entries.north == mapEntryContraints.north)
                && (mapEntryContraints.south == null || sampleMap.entries.south == mapEntryContraints.south)
                && (mapEntryContraints.est   == null || sampleMap.entries.est   == mapEntryContraints.est)
                && (mapEntryContraints.west  == null || sampleMap.entries.west  == mapEntryContraints.west);
        });

        var mapIndex = Math.floor(this.rng() * acceptableSamples.length);
        var mapJson = acceptableSamples[mapIndex];

        this.mapSeeds.add(new MapSeed(coord, mapJson.entries));
        return new Map(mapJson.tiles, this.size, this.walkables, this.opaques, coord);
    }

    private initSampleMaps() {
        this.sampleMaps = [];
        this.sampleMaps.push(require('../public/maps/map-N'));
        this.sampleMaps.push(require('../public/maps/map-NE'));
        this.sampleMaps.push(require('../public/maps/map-NS'));
        this.sampleMaps.push(require('../public/maps/map-NSWE'));
        this.sampleMaps.push(require('../public/maps/map-NW'));
        this.sampleMaps.push(require('../public/maps/map-SE'));
        this.sampleMaps.push(require('../public/maps/map-SW'));
        this.sampleMaps.push(require('../public/maps/map-WE'));
    }
}

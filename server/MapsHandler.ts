/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./Geo";
import {Map} from "./Map";

class MapDic {
    public mapDic: { [key: string] : Map; };

    constructor() {
        this.mapDic = {};
    }

    public add(key: Geo.IPoint, map: Map) {
        if (this.mapDic[key.x + "," + key.y])
            throw new Error("This map has already been inserted"); //TODO: replace ?
        else
            this.mapDic[key.x + "," + key.y] = map;
    }

    public get(key: Geo.IPoint): Map {
        return this.mapDic[key.x + "," + key.y];
    }
}

export class MapsHandler {
    private maps: MapDic;

    constructor() {
        this.maps = new MapDic();

        var map: Map = new Map('../public/maps/map.0.0');
        this.maps.add({ x: 0, y: 0 }, map)
    }

    public loadMap(coord: Geo.IPoint): Map {
        var map: Map = new Map('../public/maps/map.' + coord.x + "." + coord.y);
        this.maps.add(coord, map);
        return map;
    }

    // Get the map at @coord, if not found, load it
    public getMap(coord: Geo.IPoint): Map {
        var map = this.maps.get(coord);
        if (!map)
            map = this.loadMap(coord);
        return map;
    }

}

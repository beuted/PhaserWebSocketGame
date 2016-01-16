/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./Geo";
import {Map} from "./Map";
import {MapGenerator} from "./MapGenerator";

class MapDic {
    public mapDic: { [key: string] : Map; };

    constructor() {
        this.mapDic = {};
    }

    public add(map: Map) {
        var coord: Geo.IPoint = map.getCoord();
        if (this.mapDic[coord.x + "," + coord.y])
            throw new Error("This map has already been inserted"); //TODO: replace ?
        else
            this.mapDic[coord.x + "," + coord.y] = map;
    }

    public get(key: Geo.IPoint): Map {
        return this.mapDic[key.x + "," + key.y];
    }
}

export class MapsHandler {
    private maps: MapDic;
    private mapGenerator: MapGenerator;

    constructor() {
        this.maps = new MapDic();
        this.mapGenerator = new MapGenerator("this is a random seed");

        var map: Map = this.mapGenerator.generate({ x: 0, y: 0 });
        this.maps.add(map)
    }

    // Get the map at @coord, if not found, load it
    public getMap(coord: Geo.IPoint): Map {
        var map = this.maps.get(coord);
        if (!map)
            map = this.loadMap(coord);
        return map;
    }

    private loadMap(coord: Geo.IPoint): Map {
        var map: Map = this.mapGenerator.generate(coord);
        this.maps.add(map);
        return map;
    }

}

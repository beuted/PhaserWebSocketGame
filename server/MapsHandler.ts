/// <reference path="typings/tsd.d.ts" />

import * as _ from "lodash";
import * as Geo from "./utils/Geo";
import {CoordDic, ICoordObject} from "./utils/CoordDic";
import {Map} from "./Map";
import {MapGenerator} from "./MapGenerator";

export class MapsHandler {
    private maps: CoordDic<Map>;
    private mapGenerator: MapGenerator;

    constructor() {
        this.maps = new CoordDic<Map>();
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
        if (!map)
            return null;

        this.maps.add(map);
        return map;
    }

}

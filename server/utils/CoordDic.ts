/// <reference path="../typings/tsd.d.ts" />

import * as Geo from "./Geo";

export interface ICoordObject {
    getCoord(): Geo.IPoint;
}

export class CoordDic<T extends ICoordObject> {
    public dictionnary: { [key: string]: T; };

    constructor() {
        this.dictionnary = {};
    }

    public add(entry: T) {
        var coord: Geo.IPoint = entry.getCoord();
        if (this.dictionnary[coord.x + "," + coord.y])
            throw new Error("This entry has already been inserted");
        else
            this.dictionnary[coord.x + "," + coord.y] = entry;
    }

    public get(key: Geo.IPoint): T {
        return this.dictionnary[key.x + "," + key.y];
    }
}

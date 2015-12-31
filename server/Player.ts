/// <reference path="typings/tsd.d.ts" />

// Player class, this aim to be as close as possible as the client version of this class
// Maybe we could share a common interface between back and front ?

import * as Geo from "./Geo"

export class Player {

    public gridPosition: Geo.Point
    public id: string;

    constructor(position: Geo.Point) {
        this.gridPosition = new Geo.Point(position.x, position.y);
    }
}

/// <reference path="typings/tsd.d.ts" />

// Player class, this aim to be as close as possible as the client version of this class
// Maybe we could share a common interface between back and front ?

import * as _ from "lodash";
import * as Geo from "./utils/Geo";
import * as Action from "./Action";
import {Map} from "./Map";
import {GameEventHandler} from "./GameEventHandler";
import {Server} from "./Server";

export class Player {
    public mapPosition: Geo.IPoint;
    public gridPosition: Geo.IPoint;
    public id: string;

    private actionQueue: Action.IAction[];
    private actionScheduler: NodeJS.Timer;
    private actionTime: number; // time it takes to perform an action in second

    constructor(position: Geo.IPoint) {
        this.mapPosition = { x: 0, y: 0 };
        this.gridPosition = { x: position.x, y: position.y };
        this.actionQueue = [];
        //TODO: this should be in a global class handling every player actions
        this.actionTime = 0.25;
        this.actionScheduler = setInterval(
            (function(self) {
                return function() { self.executeAction() }
            })(this), this.actionTime * 1000);
    }

    public get idle(): boolean {
        return this.actionQueue.length === 0;
    }

    public get map(): Map {
        return GameEventHandler.mapsHandler.getMap(this.mapPosition)
    }

    public toMessage(): any {
        return _.pick(this, ["id", "gridPosition"]);
    }

    public planAction(action: Action.IAction) {
       this.actionQueue.push(action);
    }

    public executeAction() {
        if (!this.actionQueue.length)
            return;

        var action: Action.IAction = this.actionQueue.shift();
        action.execute(this);

        this.update();
    }

    public destroy() {
        clearInterval(this.actionScheduler);
    }

    public update() {
        // Change player map if player as reach map borders in it's last action
        var mapSize: Geo.IPoint = this.map.getSize();
        var newMapPosition: Geo.IPoint = { x: this.mapPosition.x, y: this.mapPosition.y }
        var newGridPosition: Geo.IPoint = { x: this.gridPosition.x, y: this.gridPosition.y }

        if (this.actionQueue.length !== 0)
            return;

        if (this.gridPosition.x <= 0) {
            newMapPosition.x--;
            newGridPosition.x = mapSize.x - 2;
        } else if (this.gridPosition.x >= mapSize.x - 1) {
            newMapPosition.x++;
            newGridPosition.x = 1;
        }

        if (this.gridPosition.y <= 0) {
            newMapPosition.y--;
            newGridPosition.y = mapSize.y - 2;
        } else if (this.gridPosition.y >= mapSize.y - 1) {
            newMapPosition.y++;
            newGridPosition.y = 1;
        }

        var map = GameEventHandler.mapsHandler.getMap(newMapPosition);

        if ((this.mapPosition.x != newMapPosition.x || this.mapPosition.y != newMapPosition.y) && !!map) {
            var changeMapAction = new Action.ChangeMap(newMapPosition, newGridPosition);
            this.planAction(changeMapAction);
        }
    }
}

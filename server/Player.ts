/// <reference path="typings/tsd.d.ts" />

// Player class, this aim to be as close as possible as the client version of this class
// Maybe we could share a common interface between back and front ?

import * as Geo from "./Geo";
import * as Action from "./Action";

export class Player {
    public gridPosition: Geo.IPoint
    public id: string;

    private actionQueue: Action.IAction[];
    private actionScheduler: NodeJS.Timer;
    private actionTime: number; // time it takes to perform an action in second

    constructor(position: Geo.IPoint) {
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

    public planAction(action: Action.IAction) {
       this.actionQueue.push(action);
    }

    public executeAction() {
        if (!this.actionQueue.length)
            return;

        var action: Action.IAction = this.actionQueue.shift();
        action.execute(this);
    }

    public destroy() {
        clearInterval(this.actionScheduler);
    }
}

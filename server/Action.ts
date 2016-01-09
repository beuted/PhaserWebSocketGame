import * as Geo from "./Geo";
import {Player} from "./Player";
import {Server} from "./Server"

export interface IAction {
    execute(player: Player);
}

export class Move implements IAction {
	public destination: Geo.IPoint;

    constructor(destination: Geo.IPoint) {
        this.destination = destination;
    }

    public execute(player: Player) {
		player.gridPosition = this.destination;
        Server.io.sockets.emit('move player', {
        	id: player.id,
        	position: { x: this.destination.x, y: this.destination.y }
       	});
    }
}

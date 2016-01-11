import * as Geo from "./Geo";
import {GameEventHandler} from "./GameEventHandler";
import {Player} from "./Player";
import {Server} from "./Server";

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
        for (var i = 0; i < GameEventHandler.players.length; i++) {
            if (GameEventHandler.players[i].mapPosition.x == player.mapPosition.x && GameEventHandler.players[i].mapPosition.y == player.mapPosition.y) {
                Server.io.sockets.connected[GameEventHandler.players[i].id].emit('move player', {
                    id: player.id,
                    position: { x: this.destination.x, y: this.destination.y }
                });
            }
        }
    }
}

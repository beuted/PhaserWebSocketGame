import * as _ from "lodash";
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
        var playersToNotify: Player[] = GameEventHandler.playersHandler.getPlayersOnMap(player.mapPosition);
        _.forEach(playersToNotify, function(notifiedPlayer) {
            Server.io.sockets.connected[notifiedPlayer.id].emit('move player', {
                    id: player.id,
                    position: { x: this.destination.x, y: this.destination.y }
                });
        }, this);
    }
}

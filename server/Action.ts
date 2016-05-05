import * as _ from "lodash";
import * as Geo from "./utils/Geo";
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


export class ChangeMap implements IAction {
    public destMap: Geo.IPoint;
    public destCase: Geo.IPoint;

    constructor(destMap: Geo.IPoint, destCase: Geo.IPoint) {
        this.destMap = destMap;
        this.destCase = destCase;
    }

    public execute(player: Player) {
        var newMap = GameEventHandler.mapsHandler.getMap(this.destMap);

        var playersOnPrevMap = GameEventHandler.playersHandler.getPlayersOnMapWithoutId(player.mapPosition, player.id);
        var playersOnDestMap = GameEventHandler.playersHandler.getPlayersOnMapWithoutId(this.destMap, player.id);

        player.gridPosition = this.destCase;
        player.mapPosition = this.destMap;
        player.gridPosition = this.destCase;

        // Send the change map message to the player changing map
        var playersOnDestMapMessage = _.map(playersOnDestMap, player => player.toMessage());

        Server.io.sockets.connected[player.id].emit('change map player', {
            id: player.id,
            gridPosition: { x: player.gridPosition.x, y: player.gridPosition.y },
            mapPosition: { x: player.mapPosition.x, y: player.mapPosition.y },
            players: playersOnDestMapMessage,
            map: newMap.toMessage()
        });

        // Notify players from previous map
        _.forEach(playersOnPrevMap, (notifiedPlayer: Player) => {
            Server.io.sockets.connected[notifiedPlayer.id].emit('remove player', player.toMessage());
        }, this);

        // Notify players from detination map
        _.forEach(playersOnDestMap, (notifiedPlayer: Player) => {
            Server.io.sockets.connected[notifiedPlayer.id].emit('new player', player.toMessage());
        }, this);
    }
}

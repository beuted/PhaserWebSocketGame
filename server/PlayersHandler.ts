/// <reference path="typings/tsd.d.ts" />

import * as util from "util";
import * as _ from "lodash";
import * as Geo from "./Geo";
import {Player} from "./Player";

export class PlayersHandler {
    private players: Player[];

    constructor() {
        this.players = [];
    }

    public addPlayer(player: Player) {
        this.players.push(player);
    }

    public removePlayer(playerId: string) {
        var removePlayer = this.getPlayer(playerId);
        if (!removePlayer) {
            util.error('[removePlayer] Player not found: ' + playerId);
            return;
        }

        this.players.splice(this.players.indexOf(removePlayer), 1);
        removePlayer.destroy();
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public getPlayersOnMap(coord: Geo.IPoint): Player[] {
        return _.filter(this.players, function(player) {
            return player.mapPosition.x == coord.x && player.mapPosition.y == coord.y;
        })
    }

    // Find player by ID
    public getPlayer(id: string): Player {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id == id)
                return this.players[i];
        };

        return null;
    }
}

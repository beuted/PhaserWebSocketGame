/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {Player} from "./Player";

export class RemotePlayersManager {
    private remotePlayers: Player[];

    constructor() {
        this.remotePlayers = [];
    }

    public add(p: Player) {
        this.remotePlayers.push(p);
    }

    public addFromJson(playerJson: any) {
        var remotePlayer = new Player(playerJson.gridPosition.x, playerJson.gridPosition.y, playerJson.id);
        this.add(remotePlayer);
    }

    public addAllFromJson(playersJson: any[]) {
        _.forEach(playersJson, function(playerJson: any) {
            this.addFromJson(playerJson);
        }, this);
    }

    public removeById(id: string) {
        var removePlayer = this.playerById(id);

        // Player not found
        if (!removePlayer) {
            console.warn("Player not found: " + id);
            return;
        };

        removePlayer.destroy();

        this.remotePlayers.splice(this.remotePlayers.indexOf(removePlayer), 1);
    }

    public removeAll() {
        _.forEach(this.remotePlayers, function(remotePlayer) {
            remotePlayer.destroy();
        });
        this.remotePlayers = []
    }

    public moveById(id: number, destPoint: any) {
        var playerToMove = this.playerById(id);

        if (!playerToMove) {
            console.warn("Player not found: " + id);
            return;
        };

        // Update player position
        playerToMove.move(destPoint)
    }

    public arePresentAt(point: Phaser.Point) {
        for (var i = 0; i < this.remotePlayers.length; i++) {
            if (Phaser.Point.equals(this.remotePlayers[i].gridPosition, point)) {
                return true;
            }
        }

        return false
    }

    // Find player by ID
    private playerById(id): Player {
        for (var i = 0; i < this.remotePlayers.length; i++) {
            if (this.remotePlayers[i].id == id)
                return this.remotePlayers[i];
        };

        return null;
    };
}

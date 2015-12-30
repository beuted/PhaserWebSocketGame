/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {Player} from "./Player";

export class RemotePlayersManager {
    private remotePlayers: Player[];

    constructor() {
        this.remotePlayers = [];
    }

    public update() {
        this.remotePlayers.forEach(function(p: Player) {
            p.update();
        });
    }

    public add(p: Player) {
        this.remotePlayers.push(p);
    }

    public removeById(id: number) {
        var removePlayer = this.playerById(id);

        // Player not found
        if (!removePlayer) {
            console.warn("Player not found: " + id);
            return;
        };

        removePlayer.destroy();

        this.remotePlayers.splice(this.remotePlayers.indexOf(removePlayer), 1);
    }

    public moveById(id: number, path: number[][]) {
        var playerToMove = this.playerById(id);

        if (!playerToMove) {
            console.warn("Player not found: " + id);
            return;
        };

        // Update player position
        playerToMove.move(path)
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

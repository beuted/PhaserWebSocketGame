/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {Player} from "./Player";

export class SocketManager {

    //TODO this shoudl be made private
    public socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io('http://' + window.location.hostname + ':8000');
        this.socket.on("connect", this.onSocketConnected.bind(this));       // Socket connection successful
        this.socket.on("disconnect", this.onSocketDisconnect.bind(this));   // Socket disconnection
        this.socket.on("new player", this.onNewPlayer.bind(this));          // New player message received
        this.socket.on("move player", this.onMovePlayer.bind(this));        // Player move message received
        this.socket.on("remove player", this.onRemovePlayer.bind(this));    // Player removed message received
    }


    // Socket connected
    private onSocketConnected() {
        console.log("Connected to socket server as " + this.socket.io.engine.id);

        GameContext.player = new Player(1, 1, this.socket.io.engine.id, true);
        GameContext.player = GameContext.player;

        // Send local player data to the game server
        this.socket.emit("new player", { x: GameContext.player.gridPosition.x, y: GameContext.player.gridPosition.y });
    };

    // Socket disconnected
    private onSocketDisconnect() {
        console.log("Disconnected from socket server");
    };

    // New player
    private onNewPlayer(data: any) {
        console.log("New player connected: " + data.id);

        // Initialise the new player
        var newPlayer = new Player(data.x, data.y, data.id);

        // Add new player to the remote players array
        GameContext.remotePlayers.push(newPlayer);
    };

    // Move player
    private onMovePlayer(data: any) {
        if (GameContext.player.id === data.id) {
            GameContext.player.move(data.path);
            return;
        }

        var playerToMove = this.playerById(data.id);
        if (!playerToMove) {
            console.log("Player not found: " + data.id);
            return;
        };

        // Update player position
        playerToMove.move(data.path)
    };

    // Remove player
    private onRemovePlayer(data) {
        var removePlayer = this.playerById(data.id);

        // Player not found
        if (!removePlayer) {
            console.log("Player not found: " + data.id);
            return;
        };

        removePlayer.destroy();

        // Remove player from array
        GameContext.remotePlayers.splice(GameContext.remotePlayers.indexOf(removePlayer), 1);
    };

    // UTILS: Find player by ID
    private playerById(id): Player {
        for (var i = 0; i < GameContext.remotePlayers.length; i++) {
            if (GameContext.remotePlayers[i].id == id)
                return GameContext.remotePlayers[i];
        };

        return null;
    };
}

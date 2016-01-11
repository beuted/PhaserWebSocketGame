/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {Player} from "./Player";
import {RemotePlayersManager} from "./RemotePlayersManager";

export class SocketManager {

    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io('http://' + window.location.hostname + ':8000');
        this.socket.on("connect", this.onSocketConnected.bind(this));       // Socket connection successful
        this.socket.on("disconnect", this.onSocketDisconnect.bind(this));   // Socket disconnection
        this.socket.on("new player", this.onNewPlayer.bind(this));          // New player message received
        this.socket.on("move player", this.onMovePlayer.bind(this));        // Player move message received
        this.socket.on("change map player", this.onChangeMapPlayer.bind(this));    // Player removed message received
        this.socket.on("remove player", this.onRemovePlayer.bind(this));    // Player removed message received
    }

    public requestPlayerMove(path: any[]) {
        this.socket.emit("move player", { path: path });
    }


    // Socket connected
    private onSocketConnected() {
        console.debug("Connected to socket server as " + this.socket.io.engine.id);

        GameContext.player = new Player(1, 1, this.socket.io.engine.id, true);
        GameContext.player = GameContext.player;

        // Send local player data to the game server
        this.socket.emit("new player", { x: GameContext.player.gridPosition.x, y: GameContext.player.gridPosition.y });
    }

    // Socket disconnected
    private onSocketDisconnect() {
        console.debug("Disconnected from socket server");
    }

    // New player
    private onNewPlayer(data: any) {
        console.debug("New player connected: " + data.id);

        // Initialise the new player
        var newPlayer = new Player(data.x, data.y, data.id);

        // Add new player to the remote players array
        GameContext.remotePlayersManager.add(newPlayer);
    }

    // Move player
    private onMovePlayer(data: any) {
        if (GameContext.player.id === data.id) {
            GameContext.player.move(data.position);
            return;
        }

        GameContext.remotePlayersManager.moveById(data.id, data.position)
    }

    // Player changed map
    private onChangeMapPlayer(data: { id: string, gridPosition: { x: number, y: number }, mapPosition: { x: number, y: number } }) {
        if (GameContext.player.id === data.id) {
            console.log("Player changed map : " + JSON.stringify(data));
            GameContext.map.changeMap(new Phaser.Point(data.mapPosition.x, data.mapPosition.y));
            GameContext.player.moveInstant(new Phaser.Point(data.gridPosition.x, data.gridPosition.y));
        }
    }

        // Remove player
    private onRemovePlayer(data: any) {
        // Remove player from remotePlayers
        GameContext.remotePlayersManager.removeById(data.id)
    }
}

/// <reference path="typings/tsd.d.ts" />

import * as express from "express";

export class Server {
    public static instance: Express.Application;
    public static io: SocketIO.Server;

    private static app: any; //TODO: type this

    public static init() {
        Server.app = express();
        Server.instance = require('http').createServer(Server.app);
        Server.io = require('socket.io')(Server.instance);

        var port = process.env.PORT || 3000;

        // Serve client files
        Server.app.use(express.static('public'));
        var server = Server.app.listen(port, () => {
            console.log('PhaserWebSocketGame is running at localhost:' + port);
        });

        // Set up Socket.IO to listen on port 8000
        Server.io.listen(server);
    }
}

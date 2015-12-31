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

        // Serve client files
        Server.app.use(express.static('public'));
        Server.app.listen(3000);

        // Set up Socket.IO to listen on port 8000
        Server.io.listen(8000);
    }
}

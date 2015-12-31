/// <reference path="server/typings/tsd.d.ts" />

import {Server} from "./server/Server"
import {GameEventHandler} from "./server/GameEventHandler"

var gameEventHandler: GameEventHandler

function init() {
    // init server
    Server.init();

    // Start listening for events
    gameEventHandler = new GameEventHandler();
    gameEventHandler.setEventHandlers();
};

init();

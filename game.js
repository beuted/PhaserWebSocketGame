/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require('util'),                 // Utility resources (logging, object inspection, etc)
    _ = require('lodash'),
    PF = require('pathfinding'),
    express = require('express')
    app = express(),                      // Express
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    Player = require('./Player').Player;    // Player class

// Serving static files
app.use(express.static('public'));
app.listen(3000);

/**************************************************
** GAME VARIABLES
**************************************************/
var socket,         // Socket controller
    players,        // Array of connected players
    map,            // Map
    finder;         // PathFinder

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
    // init pathfind
    finder = new PF.AStarFinder();

    // Create an empty array to store players
    players = [];

    // Load the map
    map = require('./public/maps/map');

    // init walkable Map
    var walkableMatrix = [];
    for (var y = 0; y < map.sizeY; y++) {
        walkableMatrix.push([]);
        for (var x = 0; x < map.sizeX; x++) {
            walkableMatrix[y].push(_.includes(map.blocking, map.tiles[y][x]) ? 1 : 0);
        }
    }

    map.walkableGrid = new PF.Grid(walkableMatrix);
    console.log(JSON.stringify(map.walkableGrid));

    // Set up Socket.IO to listen on port 8000
    io.listen(8000);

    // Start listening for events
    setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
    // Socket.IO
    io.on('connection', onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
    util.log('New player has connected: ' + client.id);

    // Listen for client disconnected
    client.on('disconnect', onClientDisconnect);

    // Listen for new player message
    client.on('new player', onNewPlayer);

    // Listen for move player message
    client.on('move player', onMovePlayer);
};

// Socket client has disconnected
function onClientDisconnect() {
    util.log('Player has disconnected: ' + this.id);

    var removePlayer = playerById(this.id);

    // Player not found
    if (!removePlayer) {
        util.log('[Error: "remove player"] Player not found: ' + this.id);
        return;
    };

    // Remove player from players array
    players.splice(players.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit('remove player', {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
    // Create a new player
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;

    // Broadcast new player to connected socket clients
    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    // Send existing players to the new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };

    // Add new player to the players array
    players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
    // Find player in array
    var movePlayer = playerById(this.id);

    // Player not found
    if (!movePlayer) {
        util.log('[Error: "move player"] Player not found: ' + this.id);
        return;
    }

    if (movePlayer.getX() == data.x && movePlayer.getY() == data.y) {
        return;
    }

    //var destTile = map.tiles[data.y][data.x];
    var path = finder.findPath(movePlayer.getX(), movePlayer.getY(), data.x, data.y, map.walkableGrid.clone());
    if (!path.length) {
        util.log('[Debug: "move player"] Player '+ this.id + ' can\'t moved : (' + movePlayer.getX() + ', ' + movePlayer.getY() + ')=>(' + data.x + ', ' + data.y + ')');
        return;
    }

    util.log('[Debug: "move player"] Player ' + this.id + ' moved : (' + movePlayer.getX() + ', ' + movePlayer.getY() + ')=>(' + data.x + ', ' + data.y + ')');

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    // Broadcast updated position to connected socket clients
    this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
    this.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();

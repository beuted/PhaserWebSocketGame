# PhaserWebSocketGame

###*Work in progress*

This Project aim to be bootstrap Phaser project for turn based isometric games where the player in moving on a grid.

## Features
* _Randomly generated maps_ based on a seed ([Seedrandom](https://github.com/davidbau/seedrandom)) rendered with _[isometric tiles](http://www.rotates.org/phaser/iso/)_
* _Multiplayer_ enabled using [Socket.io](http://socket.io/) (the players can see eachothers moving on the different maps)
* Movement enabled by clicking using an _[A\* pathfinding client side](http://www.easystarjs.com/)_
* Feild of view of the player computed with a _recursive shadowcasting_

## Setup project
* [Install node](https://nodejs.org/)
* At the root of the repo Type `npm install`
* Type `grunt` and wait few seconds (that will retieve the bower dependencies, retrieve the .d.ts files and build the typescript of the server and the client)
* Start the server with `node app.js`
* Connect to `localhost:3000` with as many browsers as you want!

## Technos used

**In Client**
* [Phaser](http://www.phaser.io/)
* [Phaser Isometric Plugin](http://www.rotates.org/phaser/iso/)
* [easystar.js](http://www.easystarjs.com/)

**In Client & Server**
* [Lodash](https://lodash.com/)
* [Requirejs](http://requirejs.org/)
* [Socket.io](http://socket.io/)
* [Typescript](http://www.typescriptlang.org/)
* [DefinitlyTyped](http://definitelytyped.org/)

**In Server**
* [Nodejs v4.2.2](https://nodejs.org)
* [Express](http://expressjs.com/)
* [Seedrandom](https://github.com/davidbau/seedrandom)

## Development grunt commands
* `grunt ts:public`: Compile the typescript client files
* `grunt ts:server`: Compile the typescript server files
* `grunt dev-server`: Run a watch on the server files, compiling the typescript files and restarting the node server
* `grunt dev-public`: Run a watch on the client files, compiling the typescript files
* `grunt dev`: Run both watches

## Licence
**MIT**

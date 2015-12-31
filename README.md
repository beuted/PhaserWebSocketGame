# PhaserWebSocketGame

###*Work in progress*

This Project aim to be bootstrap Phaser project for turn based isometric games where the player in moving on a grid.

## Features
* Grid Map saved as Json rendered with _isometric tiles_
* _Multiplayer_ enabled using socket.io (the players can see eachothers moving on the map)
* Movement enabled by clicking using an _A\* pathfinding **server side**_
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

**In Client & Server**
* [Lodash](https://lodash.com/)
* [Requirejs](http://requirejs.org/)
* [Socket.io](http://socket.io/)
* [Typescript](http://www.typescriptlang.org/)
* [DefinitlyTyped](http://definitelytyped.org/)

**In Server**
* [Nodejs v4.2.2](https://nodejs.org)
* [Express](http://expressjs.com/)
* [PathFinding.js](https://github.com/qiao/PathFinding.js/)

## Licence
**MIT**

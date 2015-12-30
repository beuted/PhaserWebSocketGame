# PhaserWebSocketGame

###*Work in progress*

This Project aim to be bootstrap Phaser project for turn based isometric games where the player in moving a grid.

## Features
* Grid Map saved as Json rendered with _isometric tiles_
* _Multiplayer_ enabled using socket.io (the players can see eachothers moving on the map)
* Movement enabled by clicking using an _A\* pathfinding **server side**_
* Feild of view of the player computed with a _recursive shadowcasting_

## Setup project
* [Install node](https://nodejs.org/)
* In `/` Type `npm install`
* In `public/` type `bower install` (You will need bower installed `npm install -g bower`)
* In `public/` type `tsd install` (You will need tsd installed `npm install -g tsd`)
* In `/` Build the typescript of the client with `grunt:ts` (You will need grunt installed `npm install -g grunt && npm install -g grunt-cli` _you might also have to add it in your path depending on your platform_)
* In `/` run the server with `node game.js`
* Connect to `localhost:3000` with as many browsers as you want!

## Technos used

**In Client**
* [Phaser](http://www.phaser.io/)
* [Phaser Isometric Plugin](http://www.rotates.org/phaser/iso/)
* [Typescript](http://www.typescriptlang.org/)
* [DefinitlyTyped](http://definitelytyped.org/)

**In Client + Server**
* [Lodash](https://lodash.com/)
* [Requirejs](http://requirejs.org/)
* [Socket.io](http://socket.io/)

**In Server**
* [Nodejs v4.2.2](https://nodejs.org)
* [Express](http://expressjs.com/)
* [PathFinding.js](https://github.com/qiao/PathFinding.js/)

## Licence
**MIT**

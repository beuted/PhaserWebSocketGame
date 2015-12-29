/// <reference path="typings/tsd.d.ts" />

import {Game} from "./Game";

requirejs.config({
    paths: {
        "phaser": "vendors/phaser/phaser.min",
        "phaserPluginIsometric": "vendors/phaser/phaser-plugin-isometric.min"
    },
    shim: {
        'phaser': {
            exports: 'Phaser'
        },
        'phaserPluginIsometric': {
            deps: ['phaser']
        }
    }
});

require(["phaser", "phaserPluginIsometric", "Game"], function(Phaser) {
    var game = new Game();
});

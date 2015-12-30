/// <reference path="typings/tsd.d.ts" />

import {Game} from "./Game";

requirejs.config({
    paths: {
        "phaser": "vendors/phaser/phaser.min",
        "phaserPluginIsometric": "vendors/phaser/phaser-plugin-isometric.min",
        "_": "bower_components/lodash/lodash"
    },
    shim: {
        "phaser": {
            exports: "Phaser"
        },
        "phaserPluginIsometric": {
            deps: ["phaser"]
        }
    }
});

require(['_', 'phaser', 'phaserPluginIsometric', 'Game'], function(_, Phaser) {
    var game = new Game();
});

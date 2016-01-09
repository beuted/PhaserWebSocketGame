/// <reference path='typings/tsd.d.ts' />

import {Game} from './Game';

requirejs.config({
    paths: {
        '_': 'bower_components/lodash/lodash',
        'Q': 'bower_components/q/q',
        'easystarjs': 'bower_components/easystarjs/easystar-0.2.3.min',
        'phaser': 'vendors/phaser/phaser.min',
        'phaserPluginIsometric': 'vendors/phaser/phaser-plugin-isometric.min'
    },
    shim: {
        'easystarjs': {
            deps: ['_']
        },
        'phaser': {
            exports: 'Phaser'
        },
        'phaserPluginIsometric': {
            deps: ['phaser']
        }
    }
});

require(['_', 'Q', 'phaser', 'easystarjs', 'phaserPluginIsometric', 'Game'], function(_, Q, Phaser, easystarjs) {
    // Bind the global libraries that are not already bound to window
    var safeWindow: any = window;
    safeWindow.Q = Q;

    var game = new Game();
});

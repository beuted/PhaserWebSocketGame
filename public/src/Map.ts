/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";

export enum TileType {
    Water = 0,
    Sand,
    Grass,
    Stone,
    Wood,
    Watersand,
    Grasssand,
    Sandstone,
    Bush1,
    Bush2,
    Mushroom,
    Wall,
    Window,
}

export class Map {
    // TODO: should be private once character will be handle by the Map
    public static isoGroup: Phaser.Group;

    private static tileSize = 32;

    private plateau: number[];
    private tileArray: string[];
    private water: Phaser.Plugin.Isometric.IsoSprite[];


    constructor() {
        // init plateau
        this.plateau = [
            9, 2, 1, 1, 4, 4, 1, 6, 2, 10, 2,
            2, 6, 1, 0, 4, 4, 0, 0, 2, 2, 2,
            6, 1, 0, 0, 4, 4, 0, 0, 8, 8, 2,
            0, 0, 0, 0, 4, 4, 0, 0, 0, 9, 2,
            0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0,
            0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
            11, 11, 12, 11, 3, 3, 11, 12, 11, 11, 11,
            3, 7, 3, 3, 3, 3, 3, 3, 7, 3, 3,
            7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7
        ];

        //init water;
        this.water = [];

        // init tileArray
        this.tileArray = [];
        this.tileArray[TileType.Water] = 'water';
        this.tileArray[TileType.Sand] = 'sand';
        this.tileArray[TileType.Grass] = 'grass';
        this.tileArray[TileType.Stone] = 'stone';
        this.tileArray[TileType.Wood] = 'wood';
        this.tileArray[TileType.Watersand] = 'watersand';
        this.tileArray[TileType.Grasssand] = 'grasssand';
        this.tileArray[TileType.Sandstone] = 'sandstone';
        this.tileArray[TileType.Bush1] = 'bush1';
        this.tileArray[TileType.Bush2] = 'bush2';
        this.tileArray[TileType.Mushroom] = 'mushroom';
        this.tileArray[TileType.Wall] = 'wall';
        this.tileArray[TileType.Window] = 'window';

        // init isoGroup
        Map.isoGroup = GameContext.instance.add.group();
        // we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen
        Map.isoGroup.enableBody = true;
        Map.isoGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

        this.initPlateau();
    }

    public getPlateau(x: number, y: number) {
        return this.plateau[(x - 1) + (y - 1) * 11];
    }

    public update() {
        // make the water move nicely
        this.water.forEach(function(w) {
            w.isoZ = (-2 * Math.sin((GameContext.instance.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((GameContext.instance.time.now + (w.isoY * 8)) * 0.005));
            w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
        });

        // topological sort for the isometric tiles
        GameContext.instance.iso.topologicalSort(Map.isoGroup);
    }

    private initPlateau() {
        var i = 0, tile;
        for (var y = Map.tileSize; y <= GameContext.instance.physics.isoArcade.bounds.frontY - Map.tileSize; y += Map.tileSize) {
            for (var x = Map.tileSize; x <= GameContext.instance.physics.isoArcade.bounds.frontX - Map.tileSize; x += Map.tileSize) {
                // this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
                tile = GameContext.instance.add.isoSprite(x, y, 0, 'tileset', this.tileArray[this.plateau[i]], Map.isoGroup);
                tile.anchor.set(0.5, 1);
                tile.smoothed = true;
                tile.body.moves = false;
                if (this.plateau[i] === 4) {
                    tile.isoZ += 6;
                }
                if (this.plateau[i] <= 10 && (this.plateau[i] < 5 || this.plateau[i] > 6)) {
                    //tile.scale.x = game.rnd.pick([-1, 1]);
                }
                if (this.plateau[i] === 0) {
                    this.water.push(tile);
                }
                i++;
            }
        }
    }
}

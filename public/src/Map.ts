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
    private plateauXSize: number;
    private plateauYSize: number;
    private plateauTiles: any[]; //Phaser.Plugin.Isometric.IsoSprite[];
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
            11, 11, 12, 11, 3, 3, 11, 12, 11, 0, 11,
            3, 7, 3, 3, 3, 3, 3, 3, 7, 0, 3,
            7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7,
            1, 1, 1, 7, 3, 7, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 1,
            11, 11, 12, 11, 12, 11, 11, 12, 11, 11, 11,
        ];

        this.plateauXSize = 11;
        this.plateauYSize = 14;

        //init water & plateauTiles
        this.water = [];
        this.plateauTiles = [];

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
        return this.plateau[(x - 1) + (y - 1) * this.plateauXSize];
    }

    public isCaseAccessible(x: number, y: number) {
        // collision handling
        var destTile = this.getPlateau(x, y);
        if (destTile == TileType.Water || destTile == TileType.Bush1 || destTile == TileType.Bush2
            || destTile == TileType.Mushroom || destTile == TileType.Wall || destTile == TileType.Window) {
            return false;
        }

        // don't go out of the map
        if (x < 1 || x > this.plateauXSize || y < 1 || y > this.plateauYSize)
            return false;

        return true;
    }

    public update() {
        // make the water move nicely
        this.water.forEach(function(w) {
            w.isoZ = (-2 * Math.sin((GameContext.instance.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((GameContext.instance.time.now + (w.isoY * 8)) * 0.005));
            w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
        });

        // tile selection animation
        // > Update the cursor position. (TODO: this shouldn't be done in Map)
        var cursorPos: Phaser.Plugin.Isometric.Point3 = GameContext.instance.iso.unproject(GameContext.instance.input.activePointer.position);

        this.plateauTiles.forEach(function(tile) { //Note: those "1.5" are fucking mysterious to me :/
            var inBounds = tile.isoBounds.containsXY(cursorPos.x + Map.tileSize * 1.5, cursorPos.y + Map.tileSize * 1.5);
            // If it does, do a little animation and tint change.
            if (inBounds) {
                tile.tint = 0x86bfda;
            } else if (!inBounds) {
                tile.tint = 0xffffff;
            }
        }, this);

        // topological sort for the isometric tiles
        GameContext.instance.iso.topologicalSort(Map.isoGroup);
    }

    private initPlateau() {
        var i = 0, tile;
        for (var y = 1; y <= this.plateauYSize; y++) {
            for (var x = 1; x <= this.plateauXSize; x++) {
                // this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
                tile = GameContext.instance.add.isoSprite(x * Map.tileSize, y * Map.tileSize, 0, 'tileset', this.tileArray[this.plateau[i]], Map.isoGroup);
                tile.anchor.set(0.5, 1);
                tile.smoothed = true;
                tile.body.moves = false;

                this.plateauTiles.push(tile);
                if (this.plateau[i] === 0) {
                    this.water.push(tile);
                }
                i++;
            }
        }
    }
}

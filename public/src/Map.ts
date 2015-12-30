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

interface Plateau {
    tiles: number[][];
    sizeX: number;
    sizeY: number;
    blocking: number[];
}

export class Map {
    // TODO: should be private once character will be handle by the Map
    public static isoGroup: Phaser.Group;
    public selectedTileGridCoord: Phaser.Point;

    private static tileSize = 32;

    private plateau: Plateau;
    private plateauTiles: any[]; //Phaser.Plugin.Isometric.IsoSprite[];
    private tileArray: string[];
    private water: Phaser.Plugin.Isometric.IsoSprite[];

    constructor() {
        // init plateau
        this.plateau = GameContext.instance.cache.getJSON('map');

        //init water & plateauTiles
        this.water = [];
        this.plateauTiles = [];
        this.selectedTileGridCoord = null;

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

    public getPlateau(x: number, y: number): number {
        var line = this.plateau.tiles[y];
        if (line === undefined || line[x] === undefined) {
            console.log("[WARNING: Map>getPlateau] Tried to access (" + x + ", " + y + ") but it is undefined");
            return 0;
        }
        return line[x];
    }

    public isCaseAccessible(x: number, y: number) {
        // collision handling
        var destTile: TileType = this.getPlateau(x, y);
        if (_.includes(this.plateau.blocking, destTile)) {
            return false;
        }

        // don't go out of the map
        if (x < 0 || x > this.plateau.sizeX - 1 || y < 0 || y > this.plateau.sizeY - 1)
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
        var selectedTile: any;

        this.plateauTiles.forEach(function(tile, i) {
            //Note: those "1.5" are fucking mysterious to me :/
            var inBounds = tile.isoBounds.containsXY(cursorPos.x + Map.tileSize * 1.5, cursorPos.y + Map.tileSize * 1.5);
            if (inBounds) {
                selectedTile = tile;
                selectedTile.tint = 0x86bfda;

                this.selectedTileGridCoord = new Phaser.Point(i % this.plateau.sizeX, Math.floor(i / this.plateau.sizeX));
            } else if (!inBounds) {
                tile.tint = 0xffffff;
            }
        }, this);

        if (!selectedTile) {
            this.selectedTileGridCoord = null;
        } else if (GameContext.instance.input.activePointer.isDown) {
            selectedTile.tint = 0xff00ff;
        }

        // topological sort for the isometric tiles
        GameContext.instance.iso.topologicalSort(Map.isoGroup);
    }

    private initPlateau() {
        var tile;
        for (var y = 0; y < this.plateau.sizeY; y++) {
            for (var x = 0; x < this.plateau.sizeX; x++) {
                // this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
                tile = GameContext.instance.add.isoSprite(x * Map.tileSize, y * Map.tileSize, 0, 'tileset', this.tileArray[this.getPlateau(x, y)], Map.isoGroup);
                tile.anchor.set(0.5, 1);
                tile.smoothed = true;
                tile.body.moves = false;

                this.plateauTiles.push(tile);
                if (this.getPlateau(x, y) === 0) {
                    this.water.push(tile);
                }
            }
        }
    }
}

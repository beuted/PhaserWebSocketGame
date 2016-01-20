/// <reference path="../typings/tsd.d.ts" />

import {GameContext} from "./GameContext";
import {LightSource} from "./ShadowCasting";

export enum TileType {
    Water = 0,
    Sand = 1,
    Grass = 2,
    Stone = 3,
    Wood = 4,
    Watersand = 5,
    Grasssand = 6,
    Sandstone = 7,
    Bush1 = 8,
    Bush2 = 9,
    Mushroom = 10,
    Wall = 11,
    Window = 12,
    Wallangle = 13
}

interface Plateau {
    tiles: number[][];
    coord: { x: number, y: number };
    size: { x: number, y: number };
    walkables: number[];
    opaques: number[];
}

export class Map {
    // TODO: should be private once character will be handle by the Map
    public static isoGroup: Phaser.Group;
    public selectedTileGridCoord: Phaser.Point;
    public coord: Phaser.Point;

    private static tileSize = 32;

    private plateau: Plateau;
    private plateauTiles: any[]; //Phaser.Plugin.Isometric.IsoSprite[];
    private tileArray: string[];
    private water: Phaser.Plugin.Isometric.IsoSprite[];

    private easystar: EasyStar.js;

    constructor() {
        this.selectedTileGridCoord = null;
        this.coord = new Phaser.Point(0, 0);

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
        this.tileArray[TileType.Wallangle] = 'wallangle';

        // init isoGroup
        Map.isoGroup = GameContext.instance.add.group();
        // we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen
        Map.isoGroup.enableBody = true;
        Map.isoGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

        // init path finding
        this.easystar = new EasyStar.js();

        this.initPlateau();
    }

    public get plateauSize() { return new Phaser.Point(this.plateau.size.x, this.plateau.size.y) }

    public getPlateau(point: Phaser.Point): number {
        var line = this.plateau.tiles[point.y];
        if (line === undefined || line[point.x] === undefined) {
            console.log("[WARNING: Map>getPlateau] Tried to access (" + point.x + ", " + point.y + ") but it is undefined");
            return 0;
        }
        return line[point.x];
    }

    public isCaseWalkable(point: Phaser.Point) {
        // collision handling
        var destTile: TileType = this.getPlateau(point);
        if (!_.includes(this.plateau.walkables, destTile)) {
            return false;
        }

        // don't go out of the map TODO REFACTO
        if (point.x < 0 || point.x > this.plateau.size.x - 1 || point.y < 0 || point.y > this.plateau.size.y - 1)
            return false;

        return true;
    }

    public findPath(fromPoint: Phaser.Point, toPoint: Phaser.Point): Q.Promise<any[]> {
        var deferred: Q.Deferred<any[]> = Q.defer<any[]>();
        this.easystar.findPath(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y, function(path: any[]) {
            if (path === null) {
                deferred.reject("Path returned by easystar is null");
                return;
            }

            if (path.length <= 1) {
                deferred.reject("Path returned by easystar has size of 0 or 1");
                return;
            }

            path.shift(); // remove the first element which is not a move
            deferred.resolve(path);
        });
        this.easystar.calculate();

        return deferred.promise;
    }

    public isCaseOpaque(point: Phaser.Point) {
        // collision handling
        var destTile: TileType = this.getPlateau(point);
        if (_.includes(this.plateau.opaques, destTile)) {
            return true;
        }

        // don't go out of the map TODO REFACTO
        if (point.x < 0 || point.x > this.plateau.size.x - 1 || point.y < 0 || point.y > this.plateau.size.y - 1)
            return true;

        return false;
    }

    public update() {
        if (!this.plateau) //TODO: find a better solution
            return;

        // make the water move nicely
        this.water.forEach(function(w) {
            w.isoZ = (-2 * Math.sin((GameContext.instance.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((GameContext.instance.time.now + (w.isoY * 8)) * 0.005));
            w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
        });

        // set to dark every tile by default
        this.plateauTiles.forEach(function(tile, i) {
            tile.tint = 0x888888;
        }, this);

        if (GameContext.player) {
            var ls = new LightSource(GameContext.player.gridPosition, GameContext.player.visionRadius, this);
            ls.calculate();
        }
        // tile selection animation
        // > Update the cursor position. (TODO: this shouldn't be done in Map)
        var cursorPos: Phaser.Plugin.Isometric.Point3 = GameContext.instance.iso.unproject(GameContext.instance.input.activePointer.position);
        var selectedTile: any;
        this.plateauTiles.forEach(function(tile, i) {
            // Tile selection -- Note: those "1.5" are fucking mysterious to me :/
            var inBounds = tile.isoBounds.containsXY(cursorPos.x + Map.tileSize * 1.5, cursorPos.y + Map.tileSize * 1.5);
            if (inBounds) {
                selectedTile = tile;
                tile.tint = 0x86bfda;

                this.selectedTileGridCoord = new Phaser.Point(i % this.plateau.size.x, Math.floor(i / this.plateau.size.x));
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

    public getPlateauTile(point: Phaser.Point) {
        return this.plateauTiles[point.x + point.y * this.plateau.size.x];
    }

    public initPlateau() {
        if (!this.plateau) //TODO: find a better solution
            return;

        // remove old tiles
        if (this.plateauTiles)
            this.plateauTiles.forEach(function(tile: Phaser.Plugin.Isometric.IsoSprite) {
                tile.destroy();
            });

        // init water & plateauTiles
        this.water = [];
        this.plateauTiles = [];

        // init pathfinding
        this.easystar.setGrid(this.plateau.tiles);
        this.easystar.setAcceptableTiles(this.plateau.walkables);

        var tile;
        var point: Phaser.Point = new Phaser.Point(0, 0);
        for (point.y = 0; point.y < this.plateau.size.y; point.y++) {
            for (point.x = 0; point.x < this.plateau.size.x; point.x++) {
                // this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
                tile = GameContext.instance.add.isoSprite(point.x * Map.tileSize, point.y * Map.tileSize, 0, 'tileset', this.tileArray[this.getPlateau(point)], Map.isoGroup);
                tile.anchor.set(0.5, 1);
                tile.smoothed = true;
                tile.body.moves = false;

                this.plateauTiles.push(tile);
                if (this.getPlateau(point) === 0) {
                    this.water.push(tile);
                }
            }
        }
    }

    public changeMap(mapData: any) {
        this.coord = mapData.coord;
        this.plateau = mapData;
        this.initPlateau();
    }

}

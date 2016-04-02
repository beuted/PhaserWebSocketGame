/// <reference path="../typings/tsd.d.ts" />

// File containing Geometry class to help in the backend code since we are not going
// to import Phaser.io there

import * as _ from "lodash";

export interface IPoint {
    x: number;
    y: number;
}

export class Tools {
	static distance(a: IPoint, b: IPoint): number {
		return Math.abs((a.x - b.x) + (a.y - b.y));
	}

    // simple Bresenham implementation
    static getLine(A: IPoint, B: IPoint): IPoint[] {
        var linePoints: IPoint[] = [];
        // Translate coordinates
        var x1 = A.x;
        var y1 = A.y;
        var x2 = B.x;
        var y2 = B.y;
        // Define differences and error check
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;
        // Set first coordinates
        linePoints.push({ x: x1, y: y1 });
        // Main loop
        while (!((x1 == x2) && (y1 == y2))) {
            var e2 = err << 1;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
            // Set coordinates
            linePoints.push({ x: x1, y: y1 });
        }
        // Return the result
        return linePoints;
    }

    // This function might return duplicates values
    static getCasesInPolygone(halfedges: { edge: { vb: IPoint, va: IPoint } }[]): IPoint[] {
        var polygoneEdges = [];
        var minX: number = Number.MAX_VALUE;
        var maxX: number = Number.MIN_VALUE;
        var minY: number = Number.MAX_VALUE;
        var maxY: number = Number.MIN_VALUE;

        _.each(halfedges, (halfedge: {edge: { vb: IPoint, va: IPoint }}) => {
            var a = { x: Math.floor(halfedge.edge.va.x), y: Math.floor(halfedge.edge.va.y) };
            var b = { x: Math.floor(halfedge.edge.vb.x), y: Math.floor(halfedge.edge.vb.y) };

            minX = Math.min(minX, a.x, b.x);
            minY = Math.min(minY, a.y, b.y);
            maxX = Math.max(maxX, a.x, b.x);
            maxY = Math.max(maxY, a.y, b.y);

            polygoneEdges = polygoneEdges.concat(Tools.getLine(a, b));
        });

        var polygone : IPoint[] = []
        var inside: boolean = false;

        for (var y: number = minY; y <= maxY; y++) {

            var firstEdge: IPoint = null, lastEdge: IPoint = null;

            for (var x: number = minX; x <= maxX; x++) {
                var isEdge : boolean = (_.find(polygoneEdges, (p: IPoint) => {
                    return p.x == x && p.y == y;
                }) !== undefined);

                if (isEdge) {
                    if (firstEdge === null) {
                        firstEdge = { x: x, y: y };
                        lastEdge = { x: x, y: y };
                    } else {
                        lastEdge = { x: x, y: y };
                    }
                }
            }

            for (var xLine: number = firstEdge.x; xLine <= lastEdge.x; xLine++) {
                polygone.push({ x: xLine, y: y });
            }
        }

        return polygone;
    }

    static getCasesInPolygoneEdges(halfedges: { edge: { vb: IPoint, va: IPoint } }[]): IPoint[] {
        var polygoneEdges = [];

        _.each(halfedges, (halfedge: { edge: { vb: IPoint, va: IPoint } }) => {
            var a = { x: Math.floor(halfedge.edge.va.x), y: Math.floor(halfedge.edge.va.y) };
            var b = { x: Math.floor(halfedge.edge.vb.x), y: Math.floor(halfedge.edge.vb.y) };
            polygoneEdges = polygoneEdges.concat(Tools.getLine(a, b));
        });

        return polygoneEdges;
    }
}

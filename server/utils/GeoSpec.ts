/// <reference path="../typings/tsd.d.ts" />

import * as Geo from "./Geo";

describe('Geo.Tools', () => {
    describe('getLine (implementation of Bresenham)', () => {
        it('should work with {0,0} {0,0}', () => {
            expect(Geo.Tools.getLine({ x: 0, y: 0 }, { x: 0, y: 0 })).toEqual([{ x: 0, y: 0 }]);
        });

        it('should work with {0,0} {0,2}', () => {
            expect(Geo.Tools.getLine({ x: 0, y: 0 }, { x: 0, y: 2 })).toEqual([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]);
        });

        it('should work with {0,0} {2,0}', () => {
            expect(Geo.Tools.getLine({ x: 0, y: 0 }, { x: 2, y: 0 })).toEqual([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]);
        });

        it('should work with {0,0} {2,2}', () => {
            expect(Geo.Tools.getLine({ x: 0, y: 0 }, { x: 2, y: 2 })).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }]);
        });

        it('should work with {0,0} {1,2}', () => {
            expect(Geo.Tools.getLine({ x: 0, y: 0 }, { x: 1, y: 2 })).toEqual([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 2 }]);
        });
    });

    describe('getCasesInPolygone', () => {
        it('should work with an mepty array of vertex', () => {
            expect(Geo.Tools.getCasesInPolygone([])).toEqual([]);
        });

        it('should work with a square', () => {
            let halfedeges = [
                { edge: { vb: { x: -1, y: 1 }, va: { x: 1, y: 1 } } },
                { edge: { vb: { x: 1, y: 1 }, va: { x: 1, y: -1 } } },
                { edge: { vb: { x: 1, y: -1 }, va: { x: -1, y: -1 } } },
                { edge: { vb: { x: -1, y: -1 }, va: { x: -1, y: 1 } } }
            ];
            let expectedPointList = [
                { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
                { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 },
                { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
            ];

            expect(Geo.Tools.getCasesInPolygone(halfedeges)).toEqual(expectedPointList);
        });

        it('should work with a losange', () => {
            let halfedeges = [
                { edge: { vb: { x: -1, y: 0 }, va: { x: 0, y: 1 } } },
                { edge: { vb: { x: 0, y: 1 }, va: { x: 1, y: 0 } } },
                { edge: { vb: { x: 1, y: 0 }, va: { x: 0, y: -1 } } },
                { edge: { vb: { x: 0, y: -1 }, va: { x: -1, y: 0 } } }
            ];
            let expectedPointList = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }];

            expect(Geo.Tools.getCasesInPolygone(halfedeges)).toEqual(expectedPointList);
        });

        it('should work with a rectangle', () => {
            let halfedeges = [
                { edge: { vb: { x: -2, y: 1 }, va: { x: 2, y: 1 } } },
                { edge: { vb: { x: -2, y: -1 }, va: { x: 2, y: -1 } } },
                { edge: { vb: { x: 2, y: 1 }, va: { x: 2, y: -1 } } },
                { edge: { vb: { x: -2, y: 1 }, va: { x: -2, y: -1 } } }
            ];
            let expectedPointList = [
                { x: -2, y: -1 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 2, y: -1 },
                { x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
                { x: -2, y: 1 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }
            ];

            expect(Geo.Tools.getCasesInPolygone(halfedeges)).toEqual(expectedPointList);
        });

        it('should work with almost a square (non-round values)', () => {
            let halfedeges = [
                { edge: { vb: { x: -0.6, y: 1.9 }, va: { x: 1.3, y: 1.5 } } },
                { edge: { vb: { x: -0.2, y: -1 }, va: { x: 1.2, y: -0.5 } } },
                { edge: { vb: { x: 1.3, y: 1.5 }, va: { x: 1.2, y: -0.5 } } },
                { edge: { vb: { x: -0.6, y: 1.9 }, va: { x: -0.2, y: -1 } } }
            ];

            let expectedPointList = [
                { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
                { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 },
                { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
            ];
            expect(Geo.Tools.getCasesInPolygone(halfedeges)).toEqual(expectedPointList);
        });
    });
});

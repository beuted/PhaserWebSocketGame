// uses recursive shadowcasting to calculate lighting at specified position
// source: http://heyjavascript.com/field-of-view-in-javascript-using-recursive-shadow-casting/

export function LightSource(position, radius, map) {
    this.position = position;
    this.radius = radius;

    // multipliers for transforming coordinates into other octants.
    this.mult = [
        [1, 0, 0, -1, -1, 0, 0, 1],
        [0, 1, -1, 0, 0, -1, 1, 0],
        [0, 1, 1, 0, 0, -1, -1, 0],
        [1, 0, 0, 1, -1, 0, 0, -1]
    ];

    // calculates an octant. Called by the this.calculate when calculating lighting
    this.calculateOctant = function(cx, cy, row, start, end, radius, xx, xy, yx, yy, id) {
        map.getPlateauTile(cx, cy).tint = 0xffffff;

        var new_start = 0;

        if (start < end) return;

        var radius_squared = radius * radius;

        for (var i = row; i < radius + 1; i++) {
            var dx = -i - 1;
            var dy = -i;

            var blocked = false;

            while (dx <= 0) {

                dx += 1;

                var X = cx + dx * xx + dy * xy;
                var Y = cy + dx * yx + dy * yy;

                if (X < map.plateau.sizeX && X >= 0 && Y < map.plateau.sizeY && Y >= 0) {

                    var l_slope = (dx - 0.5) / (dy + 0.5);
                    var r_slope = (dx + 0.5) / (dy - 0.5);

                    if (start < r_slope) {
                        continue;
                    } else if (end > l_slope) {
                        break;
                    } else {
                        if (dx * dx + dy * dy < radius_squared) {
                            map.getPlateauTile(X, Y).tint = 0xffffff;
                        }

                        if (blocked) {
                            if (map.isCaseOpaque(X, Y)) {
                                new_start = r_slope;
                                continue;
                            } else {
                                blocked = false;
                                start = new_start;
                            }
                        } else {
                            // TODO: if it block sight
                            if (map.isCaseOpaque(X,Y) && i < radius) {
                                blocked = true;
                                this.calculateOctant(cx, cy, i + 1, start, l_slope, radius, xx, xy, yx, yy, id + 1);

                                new_start = r_slope;
                            }
                        }
                    }
                }
            }

            if (blocked) break;
        }
    }

    // sets flag lit to true on all tiles within radius of position specified
    this.calculate = function() {
        for (var i = 0; i < 8; i++) {
            this.calculateOctant(this.position.x, this.position.y, 1, 1.0, 0.0, this.radius,
                this.mult[0][i], this.mult[1][i], this.mult[2][i], this.mult[3][i], 0);
        }

        map.getPlateauTile(this.position.x, this.position.y).tint = 0xffffff;
    }

    // update the position of the light source
    this.update = function(position) {
        this.position = position;
        this.calculate();
    }
}

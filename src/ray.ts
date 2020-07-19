import P5 from 'p5'
import { Wall } from './wall';

export class Ray {
    pos: P5.Vector;
    dir: P5.Vector;
    end: P5.Vector;
    maxLength: number;

    constructor(pos: P5.Vector, maxLength: number, angle: number) {
        this.pos = pos;
        this.dir = P5.Vector.fromAngle(angle);
        this.end = new P5.Vector();
        this.maxLength = maxLength;
        this.end.x = this.pos.x + this.dir.x * maxLength;
        this.end.y = this.pos.y + this.dir.y * maxLength;
    }

    cast(wall: Wall) {
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.end.x;
        const y4 = this.end.y;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return;
        }


        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        const pt = new P5.Vector();
        if (t >= 0 && t <= 1 && u <= 1 && u >= 0) {
            pt.x = x1 + t * (x2 - x1);
            pt.y = y1 + t * (y2 - y1);
        } else {
            pt.x = x4;
            pt.y = y4;
        }

        return pt;
    }
}

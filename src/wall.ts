import P5 from 'p5'


export class Wall {
    a: P5.Vector;
    b: P5.Vector;
    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.a = new P5.Vector();
        this.b = new P5.Vector();
        this.a.x = x1;
        this.a.y = y1;
        this.b.x = x2;
        this.b.y = y2;
    }

    show(p5: P5) {
        p5.line(this.a.x, this.a.y, this.b.x, this.b.y)
    }
}

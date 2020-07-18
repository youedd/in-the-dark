import P5 from "p5";


export interface CellConfig {
    w: number,
    rows: number;
    cols: number;
    index: (i: number, j: number) => number,
}


export class Cell {
    i: number;
    j: number;
    grid: Cell[]
    visited: boolean;
    walls: [boolean, boolean, boolean, boolean];
    config: CellConfig

    constructor(i: number, j: number, grid: Cell[], config: CellConfig) {
        this.i = i;
        this.j = j;
        this.visited = false;
        this.walls = [true, true, true, true];
        this.config = config;
        this.grid = grid;
    }

    next() {
        const { index } = this.config;
        const neighbors = [];

        const top = this.grid[index(this.i, this.j - 1)];
        const right = this.grid[index(this.i + 1, this.j)];
        const bottom = this.grid[index(this.i, this.j + 1)];
        const left = this.grid[index(this.i - 1, this.j)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            const r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        }

        return null;
    }

    show(p5: P5) {

        const { w } = this.config;

        const x = this.i * w;
        const y = this.j * w;

        p5.stroke(255);
        if (this.walls[0]) {
            p5.line(x, y, x + w, y);
        }
        if (this.walls[1]) {
            p5.line(x + w, y, x + w, y + w);
        }
        if (this.walls[2]) {
            p5.line(x + w, y + w, x, y + w);
        }
        if (this.walls[3]) {
            p5.line(x, y + w, x, y);
        }

        if (this.visited) {
            p5.noStroke();
            p5.fill(40);
            p5.rect(x, y, w, w);
        }
    }

}

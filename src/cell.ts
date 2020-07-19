import P5 from "p5";
import { Wall } from "./wall";

export interface CellConfig {
    w: number,
    rows: number;
    cols: number;
    index: (i: number, j: number) => number,
}


export class Cell {
    i: number;
    j: number;
    x: number;
    y: number;
    grid: Cell[]
    visited: boolean;
    walls: Array<Wall | null>;
    config: CellConfig

    constructor(i: number, j: number, grid: Cell[], config: CellConfig) {
        const y = i * config.w;
        const x = j * config.w;
        this.x = x;
        this.y = y;
        this.i = i;
        this.j = j;
        this.visited = false;
        this.walls = [
            new Wall(x, y, x, y + config.w),
            new Wall(x, y + config.w, x + config.w, y + config.w),
            new Wall(x + config.w, y + config.w, x + config.w, y),
            new Wall(x + config.w, y, x, y),
        ];
        this.config = config;
        this.grid = grid;
    }

    next() {
        const { index } = this.config;
        const neighbors = [];

        const top = this.grid[index(this.i - 1, this.j)];
        const right = this.grid[index(this.i, this.j + 1)];
        const bottom = this.grid[index(this.i + 1, this.j)];
        const left = this.grid[index(this.i, this.j - 1)];

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


        p5.stroke(255);
        p5.stroke(255);
        this.walls.forEach((wall, ind) => {
            if (wall) {
                wall.show(p5)
            }
        })

        if (this.visited) {
            p5.noStroke();
            p5.fill(40);
            p5.rect(this.x, this.y, w, w);
        }
    }

}

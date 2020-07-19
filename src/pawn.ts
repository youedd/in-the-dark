import { CellConfig, Cell } from "./cell";
import P5 from "p5";
import { Ray } from "./ray";
import { Wall } from "./wall";

const sqrt1 = Math.sqrt(1)
export class Pawn {

    pos: P5.Vector
    size: number;
    angle: number;
    config: CellConfig;
    rays: Ray[];
    visionLength: number

    constructor(config: CellConfig) {
        this.config = config;
        this.angle = 0;
        this.pos = new P5.Vector()
        this.pos.x = config.w / 2;
        this.pos.y = config.w / 2;
        this.size = config.w / 4;
        this.visionLength = this.config.w * 1.5;
        this.rays = [];
        for (let a = 0; a < 360; a += 1) {
            this.rays.push(new Ray(this.pos, this.visionLength, (a - 180) * Math.PI / 720));
        }
    }

    update(x: number, y: number) {
        this.pos.set(x, y);
    }

    updateVisionAngle(x: number, y: number) {
        const dx = x - this.pos.x;
        const dy = y - this.pos.y;

        this.angle = Math.atan2(dy, dx);
        this.rays.forEach(ray => ray.rotate(this.angle))
    }

    showRays(p5: P5, walls: Wall[]) {
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let closest = null;
            let record = Infinity;
            for (let wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    const d = P5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        record = d;
                        closest = pt;
                    }
                }
            }
            if (closest) {
                p5.push()
                // p5.colorMode(p5.HSB);
                // p5.stroke((i + p5.frameCount * 2) % 360, 255, 255, 50);

                p5.stroke(255, 10);
                p5.line(this.pos.x, this.pos.y, closest.x - sqrt1, closest.y - sqrt1);
                p5.pop()
            }
        }
    }

    showVision(p5: P5, grid: Cell[]) {
        const walls: Wall[] = [];
        const i0 = Math.floor(this.pos.x / this.config.w);
        const j0 = Math.floor(this.pos.y / this.config.w);
        const delta = this.visionLength / this.config.w;
        const min_i = i0 - delta < 0 ? 0 : i0 - delta;
        const min_j = j0 - delta < 0 ? 0 : j0 - delta;
        const max_i = i0 + delta > this.config.rows ? this.config.rows : i0 + delta;
        const max_j = j0 + delta > this.config.cols ? this.config.cols : j0 + delta;

        for (let i = min_i; i < max_i; i++) {
            for (let j = min_j; j < max_j; j++) {
                const cell = grid[this.config.index(i, j)];
                cell.walls.forEach(wall => {
                    if (wall) {
                        walls.push(wall)
                    }
                })
            }
        }
        this.showRays(p5, walls);
    }


    show(p5: P5, grid: Cell[]) {
        p5.fill(255);
        p5.ellipse(this.pos.x, this.pos.y, 4);
    }
}
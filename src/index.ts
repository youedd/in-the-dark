import P5 from "p5";
import { Cell, CellConfig } from "./cell"
import { Pawn } from "./pawn";
import { Debugger } from "./debugger";
import collide from 'line-circle-collision'
import { debounce } from "./utils";

const _index = (rows: number, cols: number) => (i: number, j: number) => {
    if (i < 0 || j < 0 || i > rows - 1 || j > cols - 1) {
        return -1;
    }
    return i * cols + j;
}

const removeWalls = (a: Cell, b: Cell) => {
    const x = a.j - b.j;
    if (x === 1) {
        a.walls[0] = null;
        b.walls[2] = null;
    } else if (x === -1) {
        a.walls[2] = null;
        b.walls[0] = null;
    }
    const y = a.i - b.i;
    if (y === -1) {
        a.walls[1] = null;
        b.walls[3] = null;
    } else if (y === 1) {
        a.walls[3] = null;
        b.walls[1] = null;
    }
}



const sketch = (p5: P5) => {
    const HEIGHT = 900;
    const WIDTH = 900;
    const DELTA = 4
    const DELTA_COS_45 = DELTA * Math.cos(Math.PI / 4)
    const DELTA_SIN_45 = DELTA * Math.cos(Math.PI / 4)
    let wallsVisible = false;

    const hideWallsIn2s = debounce(() => wallsVisible = false, 60);

    const config: CellConfig = {
        w: 100,
        rows: 0,
        cols: 0,
        index: _index(0, 0),
    }

    const grid: Cell[] = [];
    const stack: Cell[] = [];
    let current: Cell | undefined;
    let pawn: Pawn;

    p5.setup = () => {
        // Creating and positioning the canvas
        p5.createCanvas(WIDTH, HEIGHT);
        const cols = p5.floor(p5.width / config.w);
        const rows = p5.floor(p5.height / config.w);

        config.cols = cols;
        config.rows = rows;
        config.index = _index(rows, cols);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = new Cell(i, j, grid, config)
                grid.push(cell);
            }
        }
        current = grid[0];
        // p5.frameRate(1)
        while (current) {
            current.visited = true;
            const next: Cell | null = current.next();
            if (next) {
                next.visited = true;
                stack.push(current);
                removeWalls(current, next);
                current = next;
            } else {
                current = stack.pop();
            }
        }

        pawn = new Pawn(config.w / 2, config.w / 2, config);

        grid[0].visited = false;
        grid[grid.length - 1].visited = false;
    };
    function updatePawn() {

        const dx = p5.mouseX - pawn.pos.x;
        const dy = p5.mouseY - pawn.pos.y;

        const angle = Math.atan2(dy, dx);

        const i0 = Math.floor(pawn.pos.y / config.w);
        const j0 = Math.floor(pawn.pos.x / config.w);


        if (p5.keyIsPressed) {
            const vect = new P5.Vector();
            if (p5.keyIsDown(72)) {
                wallsVisible = true;
                hideWallsIn2s();
            }

            if (p5.keyIsDown(81) || p5.keyIsDown(37)) {
                vect.x += -DELTA
            }
            if (p5.keyIsDown(68) || p5.keyIsDown(39)) {
                vect.x += DELTA
            }
            if (p5.keyIsDown(83) || p5.keyIsDown(40)) {
                vect.y += DELTA
            }
            if (p5.keyIsDown(90) || p5.keyIsDown(38)) {
                vect.y += -DELTA
            }

            if (vect.y || vect.x) {
                vect.setMag(DELTA);
                // vect.rotate(angle);
                const newPos = vect.add(pawn.pos);

                const cell = grid[config.index(i0, j0)];
                let update = true;
                for (const wall of cell.walls) {
                    if (wall && collide([wall.a.x, wall.a.y], [wall.b.x, wall.b.y], [newPos.x, newPos.y], DELTA)) {
                        update = false;
                        break;
                    }

                }
                if (update)
                    pawn.pos.set(vect);
            }

        }

        pawn.updateVisionAngle(angle);
    }

    const draw = () => {
        p5.background(0, 70, 0);
        for (var i = 0; i < grid.length; i++) {
            grid[i].show(p5, wallsVisible);
        }
        updatePawn();

        pawn.show(p5, grid);
        pawn.showVision(p5, grid)
    }

    // The sketch draw method
    p5.redraw = () => {
        if (Debugger.isDebug && Debugger.isLocked) return
        draw();
        Debugger.lock()
    }

};

new P5(sketch);

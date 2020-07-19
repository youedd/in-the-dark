import P5 from "p5";
import { Cell, CellConfig } from "./cell"
import { Pawn } from "./pawn";


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
    let deltaX = 0;
    let deltaY = 0;

    function keyPressed() {
        deltaX = 0;
        deltaY = 0;
        if (!p5.keyIsPressed) return
        if (p5.keyCode === p5.LEFT_ARROW) {
            deltaX = -1;
        } else if (p5.keyCode === p5.RIGHT_ARROW) {
            deltaX = 1;
        } else if (p5.keyCode === p5.DOWN_ARROW) {
            deltaY = 1;
        } else if (p5.keyCode === p5.UP_ARROW) {
            deltaY = -1;
        }
    }

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

        pawn = new Pawn(config);
    };

    const draw = () => {
        keyPressed()
        p5.background(0, 70, 0);
        for (var i = 0; i < grid.length; i++) {
            grid[i].show(p5);
        }
        if (p5.keyIsPressed) {
            pawn.move(deltaX, deltaY)
        }
        pawn.updateVisionAngle(p5.mouseX, p5.mouseY);
        pawn.show(p5, grid);
        pawn.showVision(p5, grid)
    }

    // The sketch draw method
    p5.redraw = () => {
        if (Debugger.isLocked()) return
        draw();
        Debugger.lock()
    }

};

new P5(sketch);

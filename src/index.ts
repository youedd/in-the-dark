import P5 from "p5";
import { Cell, CellConfig } from "./cell"


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

    const config: CellConfig = {
        w: 100,
        rows: 0,
        cols: 0,
        index: _index(0, 0),
    }

    const grid: Cell[] = [];
    const stack: Cell[] = [];
    let current: Cell | undefined;

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
            for (let i = 0; i < cols; i++) {
                const cell = new Cell(i, j, grid, config)
                grid.push(cell);
            }
        }
        current = grid[0];

        while (current) {
            current.visited = true;
            // STEP 1
            const next: Cell | null = current.next();
            if (next) {
                next.visited = true;

                // STEP 2
                stack.push(current);

                // STEP 3
                removeWalls(current, next);

                // STEP 4
                current = next;
            } else {
                current = stack.pop();
            }
        }
    };

    // The sketch draw method
    p5.draw = () => {
        p5.background(0, 70, 0);
        for (var i = 0; i < grid.length; i++) {
            grid[i].show(p5);
        }
    }

};

new P5(sketch);

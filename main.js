let tetris;

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent(document.getElementById('canvas'));
    tetris = new Tetris();
    tetris.setNextMinoArray();
}

function range(min, max) {
    let retArr = [];
    for (let i = min; i < max; i++)
        retArr[i - min] = i;
    return retArr;
}

function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let rand = Math.floor(Math.random() * arr.length);
        let temp = arr[i];
        arr[i] = arr[rand];
        arr[rand] = temp;
    }
    return arr;
}

class Tetris {
    tetriminos = [
        new IMino(),
        new JMino(),
        new LMino(),
        new TMino(),
        new OMino(),
        new ZMino(),
        new SMino()
    ];

    field = new Field();
    nextMinoArray;

    constructor() {}

    draw() {
        this.field.draw();
    }

    setNextMinoArray() {
        this.nextMinoArray = new Array(7);
        let index = 0;
        for (let value of shuffle(range(0, 7))) {
            this.nextMinoArray[index] = this.tetriminos[value];
            index++;
        };
    }
}

class Field {
    VER = 20;
    COL = 10;
    field = new Array(this.VER);
    static BLOCK_W;
    static BLOCK_H;
    static MARGIN_LEFT = 200;

    constructor() {
        Field.BLOCK_W = 400 / this.COL;
        Field.BLOCK_H = 800 / this.VER;
        for (let i = 0; i < this.VER + 2; i++) {
            this.field[i] = new Array(this.COL);
            for (let j = 0; j < this.COL; j++) {
                this.field[i][j] = 0;
            }
        }
    }

    draw() {
        for (let i = 0; i < this.VER; i++) {
            for (let j = 0; j < this.COL; j++) {
                stroke(150);
                strokeWeight(1);
                noFill();
                rect(Field.MARGIN_LEFT + j * Field.BLOCK_W, i * Field.BLOCK_H, Field.BLOCK_W, Field.BLOCK_H);
            }
        }
        for (let i = 0; i < tetris.nextMinoArray.length; i++) {
            tetris.nextMinoArray[i].drawBlock(3, i * 3 - 1, Field.BLOCK_W, Field.BLOCK_H);
        }
    }
}

class Blocks {
    tetrimino;
    color;

    drawBlock(x, y, w, h) {
        fill(this.color);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.tetrimino[i][j]) {
                    rect(Field.MARGIN_LEFT + (x + j) * w, (y + i) * h, w, h);
                }
            }
        }
    }
}

class IMino extends Blocks {
    tetrimino = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
    ];
    color = color(100, 200, 255);

    constructor() {
        super();
    }
}

class JMino extends Blocks {
    tetrimino = [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 0]
    ];
    color = color(100, 100, 200);

    constructor() {
        super();
    }
}
class LMino extends Blocks {
    tetrimino = [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
    ];
    color = color(255, 150, 120);

    constructor() {
        super();
    }
}

class TMino extends Blocks {
    tetrimino = [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
    ];
    color = color(255, 150, 255);

    constructor() {
        super();
    }
}

class OMino extends Blocks {
    tetrimino = [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ];
    color = color(255, 255, 150);

    constructor() {
        super();
    }
}

class ZMino extends Blocks {
    tetrimino = [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ];
    color = color(200, 100, 100);

    constructor() {
        super();
    }
}

class SMino extends Blocks {
    tetrimino = [
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ];
    color = color(150, 200, 150);

    constructor() {
        super();
    }
}

function draw() {
    background(0);
    tetris.draw();
}
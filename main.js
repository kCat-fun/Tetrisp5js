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

    field;
    nextMinoArray = new Array(14);

    constructor() {
        this.setNextMinoArray();
        this.field = new Field();
        this.nextMinoArray = this.field.setMino(this.nextMinoArray);
    }

    draw() {
        this.field.draw();
    }

    setNextMinoArray() {
        this.nextMinoArray = new Array(14);
        for (let i = 0; i < 2; i++) {
            let index = 0;
            for (let value of shuffle(range(0, 7))) {
                this.nextMinoArray[index + i * 7] = this.tetriminos[value];
                index++;
            }
        }
    }
}

class Field {
    VER = 20;
    COL = 10;
    map = new Array(this.VER);
    static BLOCK_W;
    static BLOCK_H;
    static MARGIN_LEFT = 200;
    pos = createVector(this.COL / 2 - 2, -3);
    block = new Blocks();
    blockDropTime = 200;
    dropStartTime = 0;

    constructor() {
        Field.BLOCK_W = 400 / this.COL;
        Field.BLOCK_H = 800 / this.VER;
        for (let i = 0; i < this.VER + 2; i++) {
            this.map[i] = new Array(this.COL);
            for (let j = 0; j < this.COL; j++) {
                this.map[i][j] = 0;
            }
        }
        this.dropStartTime = millis();
    }

    draw() {
        this.drawField();
        this.drawMino();
        this.dropMino();
        this.dropMino();
    }

    setMino(minoArr) {
        this.block = minoArr[0];
        minoArr.shift()
        return minoArr;
    }

    drawField() {
        for (let i = 0; i < this.VER; i++) {
            for (let j = 0; j < this.COL; j++) {
                stroke(150);
                strokeWeight(1);
                noFill();
                rect(Field.MARGIN_LEFT + j * Field.BLOCK_W, i * Field.BLOCK_H, Field.BLOCK_W, Field.BLOCK_H);
            }
        }
    }

    drawMino() {
        this.block.drawBlock(this.pos.x, this.pos.y, Field.BLOCK_W, Field.BLOCK_H);
    }

    dropMino() {
        if (this.blockDropTime < millis() - this.dropStartTime) {
            if (this.isMove(this.pos.x, this.pos.y, 0, 1))
                this.pos.y++;
            else
                fixMino(this.pos.x, this.pos.y);
            this.dropStartTime = millis();
        }
    }

    isMove(x, y, dx, dy) {
        for (let i = 0; i < this.block.tetrimino.length; i++) {
            for (let j = 0; j < this.block.tetrimino[i].length; j++) {
                if (y + i + dy < 0) continue;
                if (this.block.tetrimino[i][j] && (
                        this.map[y + i + dy][x + j + dx] ||
                        this.pos.y + i + dy >= Field.VER)) {
                    return false;
                }
            }
        }
        return true;
    }

    fixMino(x, y) {
        this.pos.x = this.COL / 2 - 2;
        this.pos.y = -3;
    }
}

function draw() {
    background(0);
    tetris.draw();
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
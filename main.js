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
    nextMinoArray = [];

    constructor() {
        this.setNextMinoArray();
        this.setNextMinoArray();
        this.field = new Field();
        this.nextMinoArray = this.setMino(this.nextMinoArray);
    }

    createMino(id) {
        switch (id) {
            case 1:
                return new IMino();
            case 2:
                return new JMino();
            case 3:
                return new LMino();
            case 4:
                return new TMino();
            case 5:
                return new OMino();
            case 6:
                return new ZMino();
            case 7:
                return new SMino();
        }
    }

    draw() {
        this.field.draw();
        this.drawNextMino();
        this.drawHoldMino();
    }

    setNextMinoArray() {
        for (let value of shuffle(range(0, 7))) {
            (this.nextMinoArray).push(this.createMino(value + 1));
        }
    }

    setMino(minoArr) {
        this.field.block = minoArr[0];
        minoArr.shift()
        return minoArr;
    }

    drawNextMino() {
        fill(255);
        textAlign(CENTER);
        textSize(30);
        text("NEXT", Field.MARGIN_LEFT + 10 * Field.BLOCK_W + 100, 50);
        noFill();
        stroke(150, 255);
        for (let i = 0; i < 4; i++) {
            rect(Field.MARGIN_LEFT + 10 * Field.BLOCK_W + 30, 70 + i * 160, 140, 140);
            this.nextMinoArray[i].drawBlockAbsolute(Field.MARGIN_LEFT + 10 * Field.BLOCK_W + 40, 70 + i * 160, 30, 30);
        }
    }

    drawHoldMino() {
        fill(255);
        textAlign(CENTER);
        textSize(30);
        text("HOLD", 100, 50);
        noFill();
        rect(30, 70, 140, 140);
        if (this.field.holdMino)
            this.field.holdMino.drawBlockAbsolute(40, 70, 30, 30);
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
    blockDropTime = 500;
    dropStartTime = 0;
    clearFlag = 0;
    clearVer = 0;
    holdMino;
    holdFlag = false;

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
        if (this.clearFlag != 0) {
            if (this.clearFlag < 5) this.clearFlag++;
            else this.clearLine();
        } else
            this.dropMino();
    }

    drawField() {
        for (let i = 0; i < this.VER; i++) {
            for (let j = 0; j < this.COL; j++) {
                stroke(150);
                strokeWeight(1);
                if (this.map[i][j])
                    fill(tetris.tetriminos[this.map[i][j] - 1].color);
                else
                    noFill();
                rect(Field.MARGIN_LEFT + j * Field.BLOCK_W, i * Field.BLOCK_H, Field.BLOCK_W, Field.BLOCK_H);
            }
        }
    }

    drawMino() {
        let bottom = this.pos.y;
        while (this.isMove(this.pos.x, bottom, 0, 1)) {
            bottom++;
        }
        this.block.drawBlockGhost(this.pos.x, bottom, Field.BLOCK_W, Field.BLOCK_H);
        this.block.drawBlock(this.pos.x, this.pos.y, Field.BLOCK_W, Field.BLOCK_H);
    }

    dropMino() {
        if (this.blockDropTime < millis() - this.dropStartTime) {
            if (this.isMove(this.pos.x, this.pos.y, 0, 1))
                this.pos.y++;
            else
                this.fixMino(this.pos.x, this.pos.y);
            this.dropStartTime = millis();
        }
    }

    keyPressed() {
        if (this.clearFlag != 0) return;
        switch (keyCode) {
            case 37: // left
                if (this.isMove(this.pos.x, this.pos.y, -1, 0))
                    this.pos.x--;
                break;
            case 39: // right
                if (this.isMove(this.pos.x, this.pos.y, 1, 0))
                    this.pos.x++;
                break;
            case 40: // bottom
                if (this.isMove(this.pos.x, this.pos.y, 0, 1))
                    this.pos.y++;
                break;
            case 88: // X
                this.block.rotateMino();
                if (!this.isMove(this.pos.x, this.pos.y, 0, 0)) {
                    for (let i = 0; i < 3; i++)
                        this.block.rotateMino();
                }
                break;
            case 90: // Z
                for (let i = 0; i < 3; i++)
                    this.block.rotateMino();
                if (!this.isMove(this.pos.x, this.pos.y, 0, 0))
                    this.block.rotateMino();
                break;
            case 32: // space
                while (this.isMove(this.pos.x, this.pos.y, 0, 1))
                    this.pos.y++;
                this.fixMino(this.pos.x, this.pos.y);
                break;
            case 67: // C
                if (this.holdFlag) break;
                this.holdFlag = true;
                if (!this.holdMino) {
                    this.holdMino = tetris.createMino(this.block.id);
                    this.block = tetris.nextMinoArray.shift();
                } else {
                    let temp = tetris.createMino(this.holdMino.id);
                    this.holdMino = tetris.createMino(this.block.id);
                    this.block = temp;
                }
                this.pos.x = this.COL / 2 - 2;
                this.pos.y = -3;
                this.dropStartTime = millis();
                break;
        }
    }

    isMove(x, y, dx, dy) {
        for (let i = 0; i < this.block.tetrimino.length; i++) {
            for (let j = 0; j < this.block.tetrimino[i].length; j++) {
                if (y + i + dy < 0 || !this.block.tetrimino[i][j]) continue;
                if (
                    (y + i + dy >= this.VER) ||
                    (x + j + dx < 0) ||
                    (x + j + dx >= this.COL)
                ) {
                    return false;
                }
                if (this.map[y + i + dy][x + j + dx]) {
                    return false;
                }
            }
        }
        return true;
    }

    fixMino(x, y) {
        for (let i = 0; i < this.block.tetrimino.length; i++) {
            for (let j = 0; j < this.block.tetrimino[i].length; j++) {
                if (this.block.tetrimino[i][j])
                    this.map[y + i][x + j] = this.block.id;
            }
        }
        tetris.setMino(tetris.nextMinoArray);
        if (tetris.nextMinoArray.length <= 7)
            tetris.setNextMinoArray();
        this.pos.x = this.COL / 2 - 2;
        this.pos.y = -3;
        this.dropStartTime = millis();
        this.drawField();
        this.isClearLine();
        this.holdFlag = false;
    }

    isClearLine() {
        for (let i = 0; i < this.VER; i++) {
            for (let j = 0; j < this.COL; j++) {
                if (!this.map[i][j]) break;
                if (j >= this.COL - 1) {
                    this.clearFlag++;
                    this.clearVer = i;
                }
            }
        }
    }

    clearLine() {
        this.clearFlag = 0;
        console.log("clear");
        sleep(300);
        for (let i = 0; i < this.VER; i++) {
            for (let j = 0; j < this.COL; j++) {
                if (!this.map[i][j]) break;
                if (j >= this.COL - 1) {
                    for (let k = this.clearVer; k > 0; k--) {
                        this.map[k] = this.map[k - 1];
                    }
                    for (let k = 0; k < this.COL; k++) {
                        this.map[0][k] = 0;
                    }
                }
            }
        }
        this.dropStartTime = millis();
    }
}

function sleep(milli_second) {
    var start = new Date();
    while (new Date() - start < milli_second);
}

function keyPressed() {
    tetris.field.keyPressed();
}

function draw() {
    background(0);
    tetris.draw();
}

class Blocks {
    tetrimino;
    color;
    id;

    drawBlock(x, y, w, h) {
        fill(this.color);
        stroke(150, 255)
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.tetrimino[i][j]) {
                    rect(Field.MARGIN_LEFT + (x + j) * w, (y + i) * h, w, h);
                }
            }
        }
    }

    drawBlockAbsolute(x, y, w, h) {
        fill(this.color);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.tetrimino[i][j]) {
                    rect(x + j * w, y + i * h, w, h);
                }
            }
        }
        noFill();
    }

    drawBlockGhost(x, y, w, h) {
        fill(200, 100);
        noStroke();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.tetrimino[i][j]) {
                    rect(Field.MARGIN_LEFT + (x + j) * w, (y + i) * h, w, h);
                }
            }
        }
        noFill();
    }

    rotateMino() {
        let temp = [];
        for (let i = 0; i < 4; i++) {
            temp[i] = [];
            for (let j = 0; j < 4; j++) {
                temp[i].push(this.tetrimino[i][j]);
            }
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.tetrimino[i][j] = temp[3 - j][i];
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
    id = 1;

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
    id = 2;

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
    id = 3;

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
    id = 4;

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
    id = 5;

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
    id = 6;

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
    id = 7;

    constructor() {
        super();
    }
}
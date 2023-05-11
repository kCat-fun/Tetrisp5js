let tetris;

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent(document.getElementById('canvas'));
    tetris = new Tetris();
}

class Tetris {
    field = new Field();

    constructor() {

    }

    draw() {
        this.field.draw();
    }
}

class Field {
    VER = 20;
    COL = 10;
    field = new Array(this.VER);
    BLOCK_W = 0;
    BLOCK_H = 0;
    MARGIN_LEFT = 200;

    constructor() {
        this.BLOCK_W = 400 / this.COL;
        this.BLOCK_H = 800 / this.VER;

        for (let i = 0; i < this.VER; i++) {
            this.field[i] = new Array(this.COL);
            for (let j = 0; j < this.COL; j++) {
                this.field[i][j] = 0;
            }
        }
    }

    draw() {
        for (let i = 0; i < this.VER; i++) {
            for (let j = 0; j < this.COL; j++) {
                fill(100, 30);
                rect(this.MARGIN_LEFT + j * this.BLOCK_W, i * this.BLOCK_H, this.BLOCK_W, this.BLOCK_H);
                stroke(150);
                rect(this.MARGIN_LEFT + j * this.BLOCK_W, i * this.BLOCK_H, this.BLOCK_W, this.BLOCK_H);
            }
        }
    }
}

function draw() {
    background(0);
    tetris.draw();
}
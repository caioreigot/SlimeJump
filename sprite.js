function Sprite(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.draw = function(xCanvas, yCanvas) {
        ctx.drawImage(img, this.x, this.y, this.width, this.height, xCanvas, yCanvas, this.width, this.height);
    }
}

var bg = new Sprite(0, 0, 1600, 1600);

// "Player"
spriteSlime = new Sprite(1859, 41, 50, 50);
spriteSlimeMagma = new Sprite(1787, 41, 50, 50);

// Floor
floorSprite = new Sprite(0, 1601, 1600, 210);

// "Menus"
lose = new Sprite(1627, 504, 343, 533);
play = new Sprite(1658, 157, 298, 330);
newBoard = new Sprite(1647, 1191, 261, 61);
spriteRecord = new Sprite(1647, 1088, 330, 73);
scoreboard = new Sprite(1609, 1277, 320, 170);

// Imagem dos obstáculos
magmaObstacle1 = new Sprite(1623, 1466, 50, 120);
magmaObstacle2 = new Sprite(1683, 1466, 50, 120);
magmaObstacle3 = new Sprite(1741, 1466, 50, 120);
magmaObstacle4 = new Sprite(1803, 1466, 50, 120);
magmaObstacle5 = new Sprite(1864, 1466, 50, 120);
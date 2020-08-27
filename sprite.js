function Sprite(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    
    this.desenhar = function(xCanvas, yCanvas) {
        ctx.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura);
    }
}

var bg = new Sprite(0, 0, 1600, 1600);

// "Player"
spriteSlime = new Sprite(1859, 41, 50, 50);
spriteSlimeMagma = new Sprite(1787, 41, 50, 50);

// Chão
spriteChao = new Sprite(0, 1601, 1600, 210);

// "Menus"
perdeu = new Sprite(1627, 504, 343, 533);
jogar = new Sprite(1658, 157, 298, 330);
novo = new Sprite(1647, 1191, 261, 61);
spriteRecord = new Sprite(1647, 1088, 330, 73);
spritePlacar = new Sprite(1609, 1277, 320, 170);

// Imagem dos obstáculos
magmaObstacle1 = new Sprite(1623, 1466, 50, 120);
magmaObstacle2 = new Sprite(1683, 1466, 50, 120);
magmaObstacle3 = new Sprite(1741, 1466, 50, 120);
magmaObstacle4 = new Sprite(1803, 1466, 50, 120);
magmaObstacle5 = new Sprite(1864, 1466, 50, 120);
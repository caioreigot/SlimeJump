
// Variáveis do jogo
var canvas, ctx, ALTURA, LARGURA, maxPulos = 3, velocidade = 6,
estadoAtual, record, img,

estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
},

chao = {
    y: 550,
    x: 0,
    altura: screen.height / 6,

    atualizar() {
        // chão dinâmico
        this.x -= velocidade;
        if (this.x <= -1600) {
            this.x = 0;
        }
    },

    desenhar() {
        spriteChao.desenhar(this.x, this.y);
        spriteChao.desenhar(this.x + spriteChao.largura, this.y);
    }
},

// Bloco "player" do jogo (slime do minecraft)
slime = {
    x: 50,
    y: 0,
    altura: spriteSlime.altura - 22,
    largura: spriteSlime.largura,

    // Gravidade do slime
    gravidade: 1.5,
    velocidade: 0,
    forcaDoPulo: 22,
    
    qntPulos: 0,

    score: 0,

    atualizar() {
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
            this.y = chao.y - this.altura;
            this.qntPulos = 0;
            this.velocidade = 0;
        }
    },

    pular() {
        if (this.qntPulos < maxPulos) {
            this.velocidade = -this.forcaDoPulo;
            this.qntPulos++;
        }
    },

    reset() {
        this.velocidade = 0;
        this.y = 0;

        if (this.score > record) {
            localStorage.setItem("record", this.score);
            record = this.score;
        }

        this.score = 0;
    },

    desenhar() {
        spriteSlime.desenhar(this.x, this.y);
    },

    desenharMagma() {
        spriteSlimeMagma.desenhar(this.x, this.y);
    }
},

obstaculos = {
    _obs: [],
    _sprites: [magmaObstacle1, magmaObstacle2, magmaObstacle3, magmaObstacle4, magmaObstacle5],
    tempoInsere: 0,
    
    insere() {
        this._obs.push({
            x: LARGURA,
            y: chao.y - Math.floor(20 + Math.random() * 80), // max: 95, minimo: x - 25
            // largura: 50 + Math.floor(10 * Math.random()),
            largura: 40,
            sprite: this._sprites[Math.floor(this._sprites.length * Math.random())]
        });

        this.tempoInsere = 35 + Math.floor(21 * Math.random());
    },

    atualizar() {
        if (this.tempoInsere == 0) {
            this.insere();
        } else {
            this.tempoInsere--; 
        }

        // Decrementando o X para que os obstáculos se movam para a esquerda
        for (let i = 0, tam = this._obs.length; i < tam; i++) {
            
            var obs = this._obs[i];
            obs.x -= velocidade;

            if (slime.x < obs.x + obs.largura && slime.x + slime.largura >= obs.x && obs.y <= slime.y + slime.altura) {
                estadoAtual = estados.perdeu;
            }

            else if (obs.x <= -obs.largura) {
                this._obs.splice(i, 1);
                slime.score++;
                tam--;
                i--;
            } 
        }
    },

    limpa() {
        this._obs = [];
    },
    
    desenhar() {
        for (let i = 0, tam = this._obs.length; i < tam; i++) {
            var obs = this._obs[i];

            obs.sprite.desenhar(obs.x, obs.y);
        }
    }

};

// Fim das variáveis do jogo

function clique(event) {

    if (estadoAtual == estados.jogando) {
        slime.pular();
    }

    else if (estadoAtual == estados.jogar) {
        estadoAtual = estados.jogando;
    }

    // && => não deixa o usuário "reiniciar" o jogo antes que o slime caia por completo da tela após perder
    else if (estadoAtual == estados.perdeu && slime.y >= 2 * ALTURA) {
        estadoAtual = estados.jogar;
        obstaculos.limpa();
        slime.reset();
    }
}

function main() {
    ALTURA = window.innerHeight;
    LARGURA = window.innerWidth;

    // Definindo a altura mínima
    if (ALTURA <= 500) {
        ALTURA = 600
    }

    // Criando canvas
    canvas = document.createElement("canvas");
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    canvas.style.border = "1px solid #000";

    // Definindo o contexto
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    document.addEventListener("mousedown", clique);

    estadoAtual = estados.jogar;
    record = localStorage.getItem("record");

    if (record == null) {
        record = 0;
    }

    img = new Image();
    img.src = "./images/sprite.png";

    rodar();
}

function rodar() {
    atualizar();
    desenhar();

    window.requestAnimationFrame(rodar); // loop
}

function atualizar() {

    slime.atualizar();

    chao.atualizar();

    if (estadoAtual == estados.jogando) {
        obstaculos.atualizar();
    }
}

function desenhar() {
    // Background sem imagem (cor sólida):
    // ctx.fillStyle = "#80daff";
    // ctx.fillRect(0, 0, LARGURA, ALTURA);

    bg.desenhar(0, 0);

    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.fillText(slime.score, 30, 68);

    if (estadoAtual == estados.jogando) {
        obstaculos.desenhar();
    }

    chao.desenhar();

    // Desenharndo o slime
    if (estadoAtual == estados.perdeu) {
        slime.desenharMagma();
    } else {
        slime.desenhar();
    }

    // Tela antes de estar jogando
    if (estadoAtual == estados.jogar) {
        jogar.desenhar(LARGURA / 2 - jogar.largura / 2, ALTURA / 2 - jogar.altura / 2);
    }

    // Tela após perder o jogo (game over)
    if (estadoAtual == estados.perdeu) {

        // Imagem do creeper com o placar
        perdeu.desenhar(LARGURA / 2 - perdeu.largura / 2, ALTURA / 2 - perdeu.altura / 2 - spriteRecord.altura / 2);

        spritePlacar.desenhar(LARGURA / 2 - spriteRecord.largura / 2.1, ALTURA / 2 + perdeu.altura / 2 - spriteRecord.altura * 3);

        // Número do score
        if (slime.score < 10) {
            ctx.fillText(slime.score, LARGURA / 2 - spritePlacar.largura / 3.55, ALTURA / 2 + perdeu.altura / 2 - spritePlacar.altura * 0.63);
        }
        else if (slime.score >= 10 && slime.score < 100) {
            ctx.fillText(slime.score, LARGURA / 2 - spritePlacar.largura / 3, ALTURA / 2 + perdeu.altura / 2 - spritePlacar.altura * 0.63);
        }
        else {
            ctx.fillText(slime.score, LARGURA / 2 - spritePlacar.largura / 2.67, ALTURA / 2 + perdeu.altura / 2 - spritePlacar.altura * 0.63);
        }

        // Número do record e imagem da placa "novo"
        if (slime.score > record) {
            novo.desenhar(LARGURA / 2 - perdeu.largura / 8.57, ALTURA / 2 + perdeu.largura / 2);

            if (slime.score < 10) {
                ctx.fillText(slime.score, LARGURA / 2 - spritePlacar.largura / 2.85 + perdeu.largura / 2.05, ALTURA / 2 + perdeu.altura / 2 - spritePlacar.altura * 0.63);
            }
            else if (slime.score >= 10 && slime.score < 100) {
                ctx.fillText(slime.score, LARGURA / 2 - spritePlacar.largura / 2.5 + perdeu.largura / 2.05, ALTURA / 2 + perdeu.altura / 2 - spritePlacar.altura * 0.63);
            }
            else {
                ctx.fillText(slime.score, LARGURA / 2 - spritePlacar.largura / 2.26 + perdeu.largura / 2.05, ALTURA / 2 + perdeu.altura / 2 - spritePlacar.altura * 0.63);
            }

        }

        // Caso não bata o recorde, apenas o mostre
        else {
            if (record < 10) {
                ctx.fillText(record, LARGURA / 2 - spritePlacar.largura / 2.85 + perdeu.largura / 2.05, ALTURA / 2 + perdeu.altura / 2 - spritePlacar.altura * 0.63);
            }
            else if (record >= 10 && record < 100) {
                ctx.fillText(record, LARGURA / 2 - spritePlacar.largura / 2.5 + perdeu.largura / 2.05, ALTURA / 2 + perdeu.altura / 2 - spritePlacar.altura * 0.63);
            }
            else {
                ctx.fillText(record, LARGURA / 2 - spritePlacar.largura / 2.25 + perdeu.largura / 2.05, ALTURA / 2 + perdeu.altura / 2 - spritePlacar.altura * 0.63);
            }
        }

    }

}

// Inicializando o jogo
main();
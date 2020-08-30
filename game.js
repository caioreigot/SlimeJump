// Game variables
var canvas, ctx, screenHeight, screenWidth, maxJumps = 2, speed = 6,
currentState, record, img, levelSpeed = 55,

states = {
    play: 0,
    playing: 1,
    lose: 2
},

floor = {
    y: 550,
    x: 0,
    height: screen.height / 6,

    update() {
        // Dynamic floor
        this.x -= speed;
        if (this.x <= -1600) {
            this.x = 0;
        }
    },

    draw() {
        floorSprite.draw(this.x, this.y);
        floorSprite.draw(this.x + floorSprite.width, this.y);
    }
},

// "Player" block (minecraft slime)
slime = {
    x: 50,
    y: 0,
    height: spriteSlime.height - 22,
    width: spriteSlime.width,

    // Slime gravity
    gravity: 1.5,
    speed: 0,
    jumpForce: 22,
    
    jumpsAmount: 0,

    score: 0,
    thugLife: 0,

    update() {
        this.speed += this.gravity;
        this.y += this.speed;

        if (this.y > floor.y - this.height && currentState != states.lose) {
            this.y = floor.y - this.height;
            this.jumpsAmount = 0;
            this.speed = 0;
        }
    },

    jump() {
        if (this.jumpsAmount < maxJumps) {
            this.speed = -this.jumpForce;
            this.jumpsAmount++;
        }
    },

    // Function called to give a "new game", resetting the score
    reset() {
        this.speed = 0;
        this.y = 0;

        if (this.score > record) {
            // Storing the score in local storage, so as not to delete when closing the site or browser
            localStorage.setItem("record", this.score);
            record = this.score;
        }

        this.score = 0;
	    levelSpeed = 55;
        this.thugLife = 0;
    },

    draw() {
        spriteSlime.draw(this.x, this.y);
    },

    drawMagma() {
        spriteSlimeMagma.draw(this.x, this.y);
    },

    drawThugLife() {
        slimeThugLife.draw(this.x, this.y);
    }
},

obstacles = {
    _obs: [],
    _sprites: [magmaObstacle1, magmaObstacle2, magmaObstacle3, magmaObstacle4, magmaObstacle5],
    insertTime: 0,
    
    insert() {
        this._obs.push({
            x: screenWidth,
            y: floor.y - Math.floor(20 + Math.random() * 80), // max: 95, minimo: x - 25
            // width: 50 + Math.floor(10 * Math.random()),
            width: 40,
            sprite: this._sprites[Math.floor(this._sprites.length * Math.random())]
        });

        // Related to the distance between obstacles
        this.insertTime = levelSpeed + Math.floor(21 * Math.random());

        // Increasing the level of difficulty, decreasing the distance between obstacles
        if (slime.score == 25 || slime.score == 50 || slime.score == 75 || slime.score == 100) {
            levelSpeed -= 4;
        }
    },

    update() {
        if (this.insertTime == 0) {
            this.insert();
        } else {
            this.insertTime--; 
        }

        // Decrementing the X so that the obstacles move to the left
        for (let i = 0, tam = this._obs.length; i < tam; i++) {
            
            var obs = this._obs[i];
            obs.x -= speed;

            if (slime.x < obs.x + obs.width && slime.x + slime.width >= obs.x && obs.y <= slime.y + slime.height) {
                currentState = states.lose;
            }

            else if (obs.x <= -obs.width) {
                this._obs.splice(i, 1);
                slime.score++;
                tam--;
                i--;
            } 
        }
    },

    clean() {
        this._obs = [];
    },
    
    draw() {
        for (let i = 0, tam = this._obs.length; i < tam; i++) {
            var obs = this._obs[i];

            obs.sprite.draw(obs.x, obs.y);
        }
    }

};

// End of game variables

// Jumping or skipping game menus by pressing any key or mouse button
function buttonPressed(e) {

    if (currentState == states.playing) {
        // e.keyCode == 87 <- button W | e.keyCode == 32 <- spacebar | e.button == 0 <- mouse left click
        if (e.keyCode == 87 || e.keyCode == 32 || e.button == 0) {
            slime.jump();
        }
    }

    else if (currentState == states.play) {
        currentState = states.playing;
    }

    // && => does not let the user "restart" the game before the slime completely falls off the screen after losing
    else if (currentState == states.lose && slime.y >= 2 * screenHeight) {
        currentState = states.play;
        obstacles.clean();
        slime.reset();
    }
}

function main() {
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;

    // Setting the minimum height
    if (screenHeight <= 500) {
        screenHeight = 600;
    }
    // Maximum height
    if (screenHeight >= 700) {
        screenHeight = 700;
    }

    // Setting the maximum width
    if (screenWidth >= 1500) {
        screenWidth = 1500;
    }

    // Creating canvas
    canvas = document.createElement("canvas");
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    // Defining the context
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    // Interact with the game by pressing any key or mouse button
    document.addEventListener("mousedown", buttonPressed);
    document.addEventListener("keydown", buttonPressed);

    currentState = states.play;
    record = localStorage.getItem("record");

    if (record == null) {
        record = 0;
    }

    // Loading the sheet image
    img = new Image();
    img.src = "./images/sheet.png";

    run();
}

function run() {
    update();
    draw();
    window.requestAnimationFrame(run); // loop
}

function update() {

    slime.update();
    floor.update();

    if (currentState == states.playing) {
        obstacles.update();
    }
}

function draw() {
    // Background without image (solid color):
    // ctx.fillStyle = "#80daff";
    // ctx.fillRect(0, 0, screenWidth, screenHeight);

    bg.draw(0, 0);

    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.fillText(slime.score, 30, 68);

    if (currentState == states.playing) {
        obstacles.draw();
    }

    // Writing the levels
    if (currentState == states.playing && slime.score == 0) {
        ctx.fillText('Level 1', screenWidth / 2 - 80.5, screenHeight / 2 - 200);
    }
    if (currentState == states.playing && slime.score >= 25 && slime.score <= 30) {
        ctx.fillText('Level 2', screenWidth / 2 - 80.5, screenHeight / 2 - 200);
    }
    if (currentState == states.playing && slime.score >= 50 && slime.score <= 55) {
        ctx.fillStyle = "#ffff00";
        ctx.fillText('Level 3', screenWidth / 2 - 80.5, screenHeight / 2 - 200);
    }
    if (currentState == states.playing && slime.score >= 75 && slime.score <= 80) {
        ctx.fillStyle = "#ffa500";
        ctx.fillText('Level 4', screenWidth / 2 - 80.5, screenHeight / 2 - 200);
    }
    if (currentState == states.playing && slime.score >= 100 && slime.score <= 105) {
        ctx.fillStyle = "#ff0000";
        ctx.fillText('Level 5', screenWidth / 2 - 80.5, screenHeight / 2 - 200);
    }

    if (currentState == states.playing && slime.score >= 120 && slime.score <= 125) {
        ctx.fillStyle = "#ff0000";
        sunglassesEmote.draw(screenWidth / 2 - 71.5, screenHeight / 2 - 200);
        slime.thugLife = 1;
    }

    floor.draw();

    // Drawing the slime
    if (currentState == states.lose) {
        slime.drawMagma();
    } 
    else {
        if (slime.thugLife == 0) {
            slime.draw();
        } 
        else {
            slime.drawThugLife();
        }
    }

    // Screen before playing
    if (currentState == states.play) {
        play.draw(screenWidth / 2 - play.width / 2, screenHeight / 2 - play.height / 2);
    }

    // Screen after losing the game (game over)
    if (currentState == states.lose) {

        // Image of the creeper with the scoreboard
        lose.draw(screenWidth / 2 - lose.width / 2, screenHeight / 2 - lose.height / 2 - spriteRecord.height / 2);

        scoreboard.draw(screenWidth / 2 - spriteRecord.width / 2.1, screenHeight / 2 + lose.height / 2 - spriteRecord.height * 3);

        // Score number
        if (slime.score < 10) {
            ctx.fillText(slime.score, screenWidth / 2 - scoreboard.width / 3.55, screenHeight / 2 + lose.height / 2 - scoreboard.height * 0.63);
        }
        else if (slime.score >= 10 && slime.score < 100) {
            ctx.fillText(slime.score, screenWidth / 2 - scoreboard.width / 3, screenHeight / 2 + lose.height / 2 - scoreboard.height * 0.63);
        }
        else {
            ctx.fillText(slime.score, screenWidth / 2 - scoreboard.width / 2.67, screenHeight / 2 + lose.height / 2 - scoreboard.height * 0.63);
        }

        // Record number and plate image "new"
        if (slime.score > record) {
            newBoard.draw(screenWidth / 2 - lose.width / 8.57, screenHeight / 2 + lose.width / 2);

            if (slime.score < 10) {
                ctx.fillText(slime.score, screenWidth / 2 - scoreboard.width / 2.85 + lose.width / 2.05, screenHeight / 2 + lose.height / 2 - scoreboard.height * 0.63);
            }
            else if (slime.score >= 10 && slime.score < 100) {
                ctx.fillText(slime.score, screenWidth / 2 - scoreboard.width / 2.5 + lose.width / 2.05, screenHeight / 2 + lose.height / 2 - scoreboard.height * 0.63);
            }
            else {
                ctx.fillText(slime.score, screenWidth / 2 - scoreboard.width / 2.26 + lose.width / 2.05, screenHeight / 2 + lose.height / 2 - scoreboard.height * 0.63);
            }

        }

        // If you don't beat the record, just show it
        else {
            if (record < 10) {
                ctx.fillText(record, screenWidth / 2 - scoreboard.width / 2.85 + lose.width / 2.05, screenHeight / 2 + lose.height / 2 - scoreboard.height * 0.63);
            }
            else if (record >= 10 && record < 100) {
                ctx.fillText(record, screenWidth / 2 - scoreboard.width / 2.5 + lose.width / 2.05, screenHeight / 2 + lose.height / 2 - scoreboard.height * 0.63);
            }
            else {
                ctx.fillText(record, screenWidth / 2 - scoreboard.width / 2.25 + lose.width / 2.05, screenHeight / 2 + lose.height / 2 - scoreboard.height * 0.63);
            }
        }

    }

}

// Initializing the game
main();

var leftKey = false; // True when left arrow is down
var rightKey = false; // True when right arrow is down
var blockContext = document.getElementById("blockCanvas").getContext("2d");
var paddleContext = document.getElementById("paddleCanvas").getContext("2d");
var ballContext = document.getElementById("ballCanvas").getContext("2d");
var colors = ['rgb(200,0,0)','rgb(220,200,0)','rgb(100,200,0)','rgb(50,100,200)', 'rgb(250,100,250)']
var ball = {
	x: 250,
	y: 270,
	h: 10,
	w: 10,
	vx: 2,
	vy: 5,
	color : 'rgb(50,100,200)'
};
var balls = [ball];

var paddle = {
	x: 300,
	y: 580,
	w: 50,
	h: 15
}
var level = 1;
var blockArray;
var shouldDrawBlocks = true;
var blocksLeft;
var ballsLeft = 1;
var leftAcc = 0;
var rightAcc = 0;
var score = 0;
var streak = 1;

var blocks = [
	null,
	{   
		// Block 1
		hp: 0,
		color: 'rgb(200,0,0)',
	},{  
		// Block 2
		hp: 1,
		color: 'rgb(220,200,0)',
	},{  
		// Block 3 multiball
		hp: 5,
		color: 'rgb(220,200,0)',
		multiball: true,
	},

];

var levels = [[
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
],[
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 2, 1, 1, 2, 1, 1, 1,
	1, 1, 1, 2, 1, 1, 2, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 2, 1, 1, 1, 1, 2, 1, 1,
	1, 1, 1, 2, 1, 1, 2, 1, 1, 1,
	1, 1, 1, 1, 2, 2, 1, 1, 1, 1,
	3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
],[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 1, 0, 0, 1, 0, 0, 0,
],[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
]];


createLevel(level);
document.getElementById("score").textContent=score;

function createLevel(level) {
	blockArray = [];
	blocksLeft = 0;

	// Create block objects
	for (y = 0, i = 0; y < 8; y += 1) {
		for (x = 0; x < 10; x +=1) {

			// create a block object
			if (levels[level][i] > 0) {
				var blockType = blocks[levels[level][i]];
				blockArray.push({
					x: 15 + x * 57,
					y: 15 + y * 32,
					h: 25,
					w: 50,
					hp: blockType.hp,
					color: blockType.color,
					multiball: blockType.multiball,
				});
				blocksLeft += 1;
			}
			i += 1;
		}
	}
}

function draw() {	
	checkBrickCollision();
	checkPaddleCollision();

	// Draw the Ball
	drawBall();	

	// Draw paddle
	drawPaddle();

	// Draw blocks
	drawBlocks();

	// Draw the frame
	window.requestAnimationFrame(draw);
}

function drawBlocks() {
	// Clear the canvas
	blockContext.clearRect(0, 0, 600, 600);

	// Draw all the blocks
	for (i = 0; i < 80; i+= 1) {
		var block = blockArray[i];
		if (block) {
			blockContext.fillStyle = block.color; 
		    blockContext.fillRect(block.x, block.y, block.w, block.h); 
		}
	}
	shouldDrawBlocks = false;
}

function drawBall() {
	// Clear the canvas
	ballContext.clearRect(0, 0, 600, 600);
	
	for (len = balls.length, i=0; i<len; ++i) {
		if (balls[i]){
			// Reverse x direction if we hit wall
			if (balls[i].x < 5 || balls[i].x > 595) {
				balls[i].vx = balls[i].vx * -1;
			}

			// Reverse y direction if we hit wall
			if (balls[i].y < 5 || balls[i].y > 595) {
				balls[i].vy = balls[i].vy * -1;
			}

			// Update x and y position
			balls[i].x = balls[i].x + balls[i].vx;
			balls[i].y = balls[i].y + balls[i].vy;

			// Draw the balls[i]
			ballContext.fillStyle = balls[i].color; 
			ballContext.fillRect(balls[i].x, balls[i].y, balls[i].h, balls[i].w); 
		}
	}
}

function checkBrickCollision() {
	// Take advantage of the grid
	// Did it hit a brick?
	for (len = balls.length, k=0; k<len; ++k) {
		// If we are below the bricks then no
		if (balls[k] && balls[k].y <= 265) {

			// Check all the blocks
			for (j = 0; j < 80; j+= 1) {
				var block = blockArray[j];
				
				// Did we collide?
				if (block
					&& balls[k].x + balls[k].w >= block.x
					&& balls[k].x <= block.x + block.w
					&& balls[k].y + balls[k].h >= block.y
					&& balls[k].y <= block.y + block.h
				) {
					score += 50 * streak;
					streak *= 2;
					document.getElementById("score").textContent=score;
				
					// redirect ball
					// Horizontal check for collision
					var horizontal;
					var vertical;
					if (balls[k].vx > 0) {
						horizontal = block.x - balls[k].x;
					} else {
						horizontal = (balls[k].x + balls[k].w) - (block.x + block.w);
					}

					// Vertical check for collision
					if (balls[k].vy > 0) {
						vertical = block.y - balls[k].y;
					} else {
						vertical = (balls[k].y + balls[k].h) - (block.y + block.h);
					}

					// Flip direction
					if (horizontal > vertical) {
						balls[k].vx *= -1;
					} else if (horizontal < vertical) {
						balls[k].vy *= -1;
					} else {
						balls[k].vy *= -1;
						balls[k].vx *= -1;
					}

					// We collided, remove the block and redraw them next frame
					blockArray[j] = null;
					blocksLeft -= 1;
					shouldDrawBlocks = true;

					// Check multiball
					if (block.multiball) {
						var newball = JSON.parse(JSON.stringify(balls[k]));
						newball.vx *= -1.1;
						newball.vy *= -.8;
						newball.color = colors[k] || 'rgb(250,100,250)';
						balls.push(newball);
						ballsLeft += 1;
						//slowBalls();
					}

					// If no blocks are left start next level
					if (blocksLeft <= 0) {
						nextLevel();
					}
				}
			}
		}
	}
}

function nextLevel() {
	level += 1;
	createLevel(level);
}

function slowBalls() {
	for (len = balls.length, l=0; l<len; ++l) {
		if (balls[l]) {
			balls[l].vx *= .8;
		balls[l].vy *= .8;
		}
	}
}

function checkPaddleCollision() {
	// Take advantage of the grid
	// Did it hit a brick?

	for (len = balls.length, i=0; i<len; ++i) {
		// If we are below the bricks then no

		if (balls[i] && balls[i].y >= 580 - balls[i].vy
				&& balls[i].x + balls[i].w >= paddle.x
				&& balls[i].x <= paddle.x + paddle.w
				&& balls[i].y + balls[i].h >= paddle.y
				&& balls[i].y <= paddle.y + paddle.h
			) {
				streak = 1;
				// redirect ball
				score += 5;
				document.getElementById("score").textContent=score;
				var horizontal;
				var vertical;

				// Horizontal check for collision
				if (balls[i].vx > 0) {
					horizontal = paddle.x - balls[i].x;
					if (leftKey) {
						balls[i].vx *= .95 - leftAcc * .1;
						balls[i].vy *= 1.05 + leftAcc * .1;
					} else if (rightKey) {
						balls[i].vy *= .95 - leftAcc * .1;
						balls[i].vx *= 1.05 + leftAcc * .1;
					}
				} else {
					horizontal = (balls[i].x + balls[i].w) - (paddle.x + paddle.w);
					if (rightKey) {
						balls[i].vx *= .95 - rightAcc * .1;
						balls[i].vy *= 1.05 + rightAcc * .1;
					} else if (leftKey) {
						balls[i].vy *= .95 - rightAcc * .1;
						balls[i].vx *= 1.05 + rightAcc * .1;
					}
				}

				// Vertical check for collision
				if (balls[i].vy > 0) {
					vertical = paddle.y - balls[i].y;
				} 

				// Flip direction
				if (horizontal > vertical) {
					balls[i].vx *= -1.2; // edge
					balls[i].vy *= -1;
				} else if (horizontal < vertical) {
					balls[i].vy *= -1;
				} else {
					balls[i].vy *= -1;
					balls[i].vx *= -1;
				}

		} else if (ballsLeft < 1) {
			balls = [{
				x: 250,
				y: 270,
				h: 10,
				w: 10,
				vx: 2,
				vy: 5,
				color : 'rgb(50,100,200)'
			}];
			ballsLeft = 1;
			streak = 1;
		} else if (balls[i] && balls[i].y >= 580 - balls[i].vy){
			balls[i] = null;
			ballsLeft -= 1;
		}
	}

}

function drawPaddle() {
	// Clear the canvas
	paddle.w = 50 + 30 * ballsLeft;
	paddleContext.clearRect(0, 0, 600, 600);

	// move paddle left if left is true
	if (leftKey == true && paddle.x >= 1){
		leftAcc += .2;
		paddle.x = paddle.x - (6 + leftAcc); // Move paddle left 
	}

	// move paddle right if right is true    600|
	if (rightKey == true && paddle.x <= 600 - paddle.w){
		rightAcc += .2;
		paddle.x = paddle.x + (6 + rightAcc); // Move paddle right 
	}

	// Draw the Paddle
	paddleContext.fillStyle = 'rgb(50,200,50)'; 
	paddleContext.fillRect(paddle.x, paddle.y, paddle.w, paddle.h); 

}

// sets the true for left and right arrow keys
document.onkeydown = function(e) {
	if(e.keyCode == 37) leftKey = true;
	if(e.keyCode == 39) rightKey = true;
}

// Sets the false for left and right arrow keys
document.onkeyup = function(e) {
	if(e.keyCode == 37) {leftKey = false; leftAcc = 0;}
	if(e.keyCode == 39) {rightKey = false; rightAcc = 0;}
}

// Draw the first frame
window.requestAnimationFrame(draw);
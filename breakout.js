var leftKey = false; // True when left arrow is down
var rightKey = false; // True when right arrow is down
// var paddleXPos = 300; // Position of paddle x axis
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
	vy: 5
};
var paddle = {
	x: 300,
	y: 580,
	w: 100,
	h: 15
}
var level = 0;
var blockArray;
var shouldDrawBlocks = true;
var blocksLeft;
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
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
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
				});
				blocksLeft += 1;
			}
			i += 1;
		}
	}
}

function draw() {	

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
	
	// Check collisions
	checkBrickCollision();
	checkPaddleCollision()
	
	// Reverse x direction if we hit wall
	if (ball.x < 5 || ball.x > 595) {
		ball.vx = ball.vx * -1;
	}

	// Reverse y direction if we hit wall
	if (ball.y < 5 || ball.y > 595) {
		ball.vy = ball.vy * -1;
	}

	// Update x and y position
	ball.x = ball.x + ball.vx;
	ball.y = ball.y + ball.vy;

	// Draw the Ball
	ballContext.fillStyle = 'rgb(0,0,200)'; 
	ballContext.fillRect(ball.x, ball.y, ball.h, ball.w); 
}

function checkBrickCollision() {
	// Take advantage of the grid
	// Did it hit a brick?

	// If we are below the bricks then no
	if (ball.y > 265) {
		return false;
	} else {

		// Check all the blocks
		for (i = 0; i < 80; i+= 1) {
			var block = blockArray[i];
			
			// Did we collide?
			if (block
				&& ball.x + ball.w >= block.x
				&& ball.x <= block.x + block.w
				&& ball.y + ball.h >= block.y
				&& ball.y <= block.y + block.h
			) {
				score += 50 * streak;
				streak *= 2;
				document.getElementById("score").textContent=score;
			
				// redirect ball
				// Horizontal check for collision
				var horizontal;
				var vertical;
				if (ball.vx > 0) {
					horizontal = block.x - ball.x;
				} else {
					horizontal = (ball.x + ball.w) - (block.x + block.w);
				}

				// Vertical check for collision
				if (ball.vy > 0) {
					vertical = block.y - ball.y;
				} else {
					vertical = (ball.y + ball.h) - (block.y + block.h);
				}

				// Flip direction
				if (horizontal > vertical) {
					ball.vx *= -1;
				} else if (horizontal < vertical) {
					ball.vy *= -1;
				} else {
					ball.vy *= -1;
					ball.vx *= -1;
				}

				// We collided, remove the block and redraw them next frame
				blockArray[i] = null;
				blocksLeft -= 1;
				shouldDrawBlocks = true;

				// If no blocks are left start next level
				if (blocksLeft <= 0) {
					nextLevel();
				}
			}
		}
		// ball.vy *= -1;
		// return true;
	}
}

function nextLevel() {
	level += 1;
	createLevel(level);
}

function checkPaddleCollision() {
	// Take advantage of the grid
	// Did it hit a brick?

	// If we are below the bricks then no
	if (ball.y < 580 - ball.vy) {
		return false;
	} else if (ball.x + ball.w >= paddle.x
			&& ball.x <= paddle.x + paddle.w
			&& ball.y + ball.h >= paddle.y
			&& ball.y <= paddle.y + paddle.h
		) {
			streak = 1;
			// redirect ball
			score += 5;
			document.getElementById("score").textContent=score;
			var horizontal;
			var vertical;

			// Horizontal check for collision
			if (ball.vx > 0) {
				horizontal = paddle.x - ball.x;
				if (leftKey) {
					ball.vx *= .9 - leftAcc * .5;
					ball.vy *= 1.05 + leftAcc * .5;
				} else if (rightKey) {
					ball.vy *= .95 - leftAcc * .5;
					ball.vx *= 1.1 + leftAcc * .5;
				}
			} else {
				horizontal = (ball.x + ball.w) - (paddle.x + paddle.w);
				if (rightKey) {
					ball.vx *= .9 - rightAcc * .5;
					ball.vy *= 1.05 + rightAcc * .5;
				} else if (leftKey) {
					ball.vy *= .95 - rightAcc * .5;
					ball.vx *= 1.1 + rightAcc * .5;
				}
			}

			// Vertical check for collision
			if (ball.vy > 0) {
				vertical = paddle.y - ball.y;
			} 

			// Flip direction
			if (horizontal > vertical) {
				ball.vx *= -1.4; // edge
				ball.vy *= -1;
			} else if (horizontal < vertical) {
				ball.vy *= -1;
			} else {
				ball.vy *= -1;
				ball.vx *= -1;
			}

	} else {
		ball = {
			x: 250,
			y: 270,
			h: 10,
			w: 10,
			vx: 2,
			vy: 5
		};
		streak = 1;
	}

}

function drawPaddle() {
	// Clear the canvas
	paddleContext.clearRect(0, 0, 600, 600);

	// move paddle left if left is true
	if (leftKey == true && paddle.x >= 4){
		leftAcc += .05;
		paddle.x = paddle.x - (5 + leftAcc); // Move paddle left 
	}

	// move paddle right if right is true    600|
	if (rightKey == true && paddle.x <= 496){
		rightAcc += .06;
		paddle.x = paddle.x + (5 + rightAcc); // Move paddle right 
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
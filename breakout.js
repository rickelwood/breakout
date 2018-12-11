var leftKey = false; // True when left arrow is down
var rightKey = false; // True when right arrow is down
var paddleXPos = 300; // Position of paddle x axis
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
var level = 1;

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
]];

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
	for (y = 0, i = 0; y < 8; y += 1) {
		for (x = 0; x < 10; x +=1) {

			// Draw a block
			if (levels[level][i] > 0) {
				blockContext.fillStyle = colors[levels[level][i]-1]; 
				blockContext.fillRect(15 + x * 57, 15 + y * 32, 50, 25); 
			}
			i += 1;
		}
	}
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
		ball.vy *= -1;
		return true;
	}
}

function checkPaddleCollision() {
	// Take advantage of the grid
	// Did it hit a brick?

	// If we are below the bricks then no
	if (ball.y < 580 - ball.vy) {
		return false;
	} else if (ball.x >= paddleXPos && ball.x <= paddleXPos + 90) {
		ball.vy *= -1;
		return true;
	} else {
		ball = {
			x: 250,
			y: 270,
			h: 10,
			w: 10,
			vx: 2,
			vy: 5
		};
	}
}

function drawPaddle() {
	// Clear the canvas
	paddleContext.clearRect(0, 0, 600, 600);

	// move paddle left if left is true
	if (leftKey == true && paddleXPos >= 4){
		paddleXPos = paddleXPos - 5; // Move paddle left 
	}

	// move paddle right if right is true    600|
	if (rightKey == true && paddleXPos <= 496){
		paddleXPos = paddleXPos + 5; // Move paddle right 
	}

	// Draw the Paddle
	paddleContext.fillStyle = 'rgb(50,200,50)'; 
	paddleContext.fillRect(paddleXPos, 580, 100, 15); 

}

// sets the true for left and right arrow keys
document.onkeydown = function(e) {
	if(e.keyCode == 37) leftKey = true;
	if(e.keyCode == 39) rightKey = true;
}

// Sets the false for left and right arrow keys
document.onkeyup = function(e) {
	if(e.keyCode == 37) leftKey = false;
	if(e.keyCode == 39) rightKey = false;
}

// Draw the first frame
window.requestAnimationFrame(draw);
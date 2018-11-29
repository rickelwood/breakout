var leftKey = false; // True when left arrow is down
var rightKey = false; // True when right arrow is down
var paddleXPos = 300; // Position of paddle x axis
var context = document.getElementById("myCanvas").getContext("2d");
var colors = ['rgb(200,0,0)','rgb(220,200,0)','rgb(100,200,0)','rgb(50,100,200)', 'rgb(250,100,250)']
var ball = {
	x: 5,
	y: 500,
	h: 10,
	w: 10,
	vx: 2,
	vy: 5
};

function draw() {	
	// Clear the canvas
	context.clearRect(0, 0, 600, 600);

	// Draw the Ball
	drawBall();	

	// Draw paddle
	drawPaddle();

	// Draw all the blocks
	for (y = 0; y < 4; y += 1) {
	    for (x = 0; x < 10; x +=1) {

	        // Draw a block
	        context.fillStyle = colors[y]; 
	        context.fillRect(15 + x * 57, 15 + y * 32, 50, 25); 
	    }
	}

	// Draw the frame
	window.requestAnimationFrame(draw);
}

function drawBall() {
	
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
	context.fillStyle = 'rgb(0,0,200)'; 
	context.fillRect(ball.x, ball.y, ball.h, ball.w); 
}

function drawPaddle() {
	// move paddle left if left is true
	if (leftKey == true && paddleXPos >= 4){
		paddleXPos = paddleXPos - 5; // Move paddle left 
	}

	// move paddle right if right is true    600|
	if (rightKey == true && paddleXPos <= 496){
		paddleXPos = paddleXPos + 5; // Move paddle right 
	}

	// Draw the Paddle
	context.fillStyle = 'rgb(50,200,50)'; 
	context.fillRect(paddleXPos, 580, 100, 15); 

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
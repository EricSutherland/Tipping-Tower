var canvasContext = null
    fps = 30,
    interval     =    1000/fps,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0,
	canvasHeight = 0,
	canvasWidth = 0;
	
// variables for the current floor
var floorWidth = 300,
	floorHeight = 40,
	floorPosition = 0,
	speed = 3,
	targetPosition = 0;
	
	
	

window.onload = function() 
{
	var canvas = document.getElementById('game');
	canvasContext = canvas.getContext('2d');
	canvasHeight = canvas.height;
	canvasWidth = canvas.width;
	
	floorPosition = canvasWidth/2;
	
	gameLoop();
};


function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    
    currentTime = (new Date()).getTime();
    delta = (currentTime-lastTime);

    if(delta > interval) 
	{
		canvasContext.clearRect(0,0,canvasHeight,canvasWidth);
		update();
		draw()
        lastTime = currentTime - (delta % interval);
    }
}

function update()
{
	updateCurrentFloor();
}

function draw()
{
	drawCurrentFloor();
}

function updateCurrentFloor()
{
	if (floorPosition + floorWidth >= canvasWidth || floorPosition <= 0) // if the floor has reached the edge of the screen
	{
		speed = speed - (speed * 2); //flips the direction the floor is travelling
	}
	
	floorPosition += speed;
}

function drawCurrentFloor()
{
	canvasContext.beginPath();
	canvasContext.rect(floorPosition,canvasHeight/2- floorHeight, floorWidth , 100);
	canvasContext.fillStyle = 'blue';
	canvasContext.fill();

}
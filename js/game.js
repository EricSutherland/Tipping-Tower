// variables for gameloop and drawing
var canvasContext = null
    fps = 30,
    interval     =    1000/fps,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0,
	canvasHeight = 0,
	canvasWidth = 0;
	
// variables for the current floor
var floor = {
	width : 300,
	height : 60,
	position : 0,
	speed : 3,
};
	targetPosition = 100;
	marginOfError = 5;
	
var previousFloors = new Array(5);



window.onload = function() 
{
	var canvas = document.getElementById('game');
	canvasContext = canvas.getContext('2d');
	canvasHeight = canvas.height;
	canvasWidth = canvas.width;
	
	floor.position = canvasWidth / 2;
	
	canvas.addEventListener('click', PlaceFloor);
	GameLoop();
};


function GameLoop() {
    window.requestAnimationFrame(GameLoop);
    
    currentTime = (new Date()).getTime();
    delta = (currentTime-lastTime);

    if(delta > interval) 
	{
		canvasContext.clearRect(0,0,canvasHeight,canvasWidth);
		Update();
		Draw()
        lastTime = currentTime - (delta % interval);
    }
}

function Update()
{
	UpdateCurrentFloor();
}

function Draw()
{
	DrawCurrentFloor();
	DrawDebugLines();
	DrawPreviousFloors();
}

function UpdateCurrentFloor()
{
	if (floor.position + floor.width >= canvasWidth || floor.position <= 0) // if the floor has reached the edge of the screen
	{
		floor.speed = floor.speed - (floor.speed * 2); //flips the direction the floor is travelling
	}
	
	floor.position += floor.speed;
}

function DrawCurrentFloor()
{
	canvasContext.beginPath();
	canvasContext.rect(floor.position,(canvasHeight / 2) - floor.height, floor.width , floor.height);
	canvasContext.fillStyle = 'blue';
	canvasContext.fill();

}
function DrawDebugLines()
{
	canvasContext.beginPath();
    canvasContext.moveTo(targetPosition, (canvasHeight / 2) - floor.height);
    canvasContext.lineTo(targetPosition, canvasHeight / 2);
    canvasContext.stroke();
}

function DrawPreviousFloors()
{
	for ( i = 0 ; i < previousFloors.length ; i++)
	{
		if (previousFloors[i])
		{
			canvasContext.beginPath();
			var temp = (canvasHeight / 2) + (floor.height *(i+1));
			canvasContext.rect(previousFloors[i].position, (canvasHeight / 2) + (floor.height *(i)), previousFloors[i].width , floor.height);
			canvasContext.fillStyle = 'blue';
			canvasContext.fill();
			canvasContext.lineWidth = 1;
			canvasContext.strokeStyle = 'black';
			canvasContext.stroke();
		}
	}
}

function PlaceFloor()
{
	var difference = Math.abs(floor.position - targetPosition);
	console.log("difference", difference);
	if (difference > marginOfError)
	{
		floor.width -= difference;
		
		if (floor.width <= 0)
		{
			// gameover
			console.log("gameover");
			return;
		}
		
		if (targetPosition < floor.position)
		{
			targetPosition = floor.position;
		}
	}
	else
	{
		floor.position = targetPosition;
	}
	
	SetupPreviousFloors();
	
	floor.position = 1;
	console.log(targetPosition);

}

function SetupPreviousFloors()
{

	previousFloors[4] = previousFloors[3];
	previousFloors[3] = previousFloors[2];
	previousFloors[2] = previousFloors[1];
	previousFloors[1] = previousFloors[0];
	
	var tempPos = floor.position;
	if (targetPosition > floor.position)
		{
			tempPos = targetPosition;
		}
		
	previousFloors[0] = {
		width : floor.width,
		position : tempPos
	};
}
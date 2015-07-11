// variables for gameloop and drawing
var canvasContext = null
    fps = 30,
    interval     =    1000/fps,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0,
	canvasHeight = 0,
	canvasWidth = 0;
	
	var buildingImage = {
		source : new Image(),
		width: 488,
		height: 530
	};

// variables for the current floor
var floor = {
	spriteID: 1,
	width : 300,
	height : 60,
	position : 0,
	speed : 3,
};
	targetPosition = 100;
	marginOfError = 10;
	
var previousFloors = new Array(5);

// variables for displaying game information

var floorLevel = 0,
	combo = 0,
	Winnings = 0;

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
	DrawGameInfo();
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
	var temp = GetSprite(floor.spriteID);
      canvasContext.drawImage(buildingImage.source,
	  temp.x,
	  temp.y,
	  temp.width,
	  temp.height,
	  floor.position,
	  (canvasHeight / 2) - floor.height, 
	  floor.width,
	  floor.height);

      buildingImage.source.src = 'resources/building.jpg';

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
			var temp = GetSprite(previousFloors[i].spriteID);
			canvasContext.drawImage(buildingImage.source,
			temp.x,
			temp.y,
			temp.width,
			temp.height,
			previousFloors[i].position,
			(canvasHeight / 2) + (floor.height *(i)),
			previousFloors[i].width,
			floor.height);
			
		}
	}
}

function GetSprite(id)
{
	var sprite = {
		x: 0,
		y: 0,
		width: buildingImage.width,
		height: buildingImage.height/3
	};
	
	switch (id)
	{

		case 2:
			sprite.y = sprite.height;
		break;
		case 3:
			sprite.y = sprite.height  * 2;
		break;
	}

	return sprite;
}

function DrawGameInfo()
{
	canvasContext.beginPath();
	canvasContext.rect(0, 0, canvasWidth, 50);
	canvasContext.fillStyle = '#B5E2F7';
	canvasContext.fill();
	
	
	canvasContext.fillStyle = 'blue';
	canvasContext.font = 'italic 20pt Helvetica';
	
	var floorString = "Floor: " + floorLevel;
	var comboString = "Combo: " + combo;
	
    canvasContext.fillText(floorString, 5, 40);
	canvasContext.fillText(comboString, canvasWidth - canvasContext.measureText(comboString).width -5, 40);

}
function PlaceFloor()
{
	var difference = Math.abs(floor.position - targetPosition);
	
	
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
		combo = 0;
	}
	else
	{
		floor.position = targetPosition;
		combo++;
	}
	
	SetupPreviousFloors();
	
	floor.position = 1;
	floorLevel++;
	floor.speed +=0.25;
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
		position : tempPos,
		spriteID : Math.floor(Math.random() * 3) + 1 
	};
}
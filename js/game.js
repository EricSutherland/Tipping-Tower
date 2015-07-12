// variables for gameloop and drawing
var canvasContext = null,
	canvas,
    fps = 30,
    interval     =    1000/fps,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0,
	canvasHeight = 0,
	canvasWidth = 0,
	playing = false,
	lost = false;
	
//variables for the various arrows used in the start screen
var arrows = {
	UPimg : new Image(),
	DOWNimg : new Image(),
	size : 20,
	targetUP : {
		x: 220,
		y: 420
		},
	targetDOWN :{
		x: 220,
		y: 445
		},
	betUP : {
		x: 320,
		y: 420
		},
	betDOWN : {
		x: 320,
		y: 445
		}
	};


// variables for the floors
var floor = {
	spriteID: 1,
	width : 300,
	height : 60,
	position : 0,
	speed : 3,
	imageWidth :0
};
	targetPosition = 0;
	marginOfError = 10;
	totalSizeDifference = 0;
	
var previousFloors = new Array(5);

var buildingImage = {
		source : new Image(),
		width: 488,
		height: 530
	};

// variables for displaying game information

var floorLevel = 0,
	combo = 0,
	winnings = "",
	target = 0,
	bet = 0,
	instructions = 'Welcome! The aim of the game is to build the tower to reach your target. You place a floor by simply tapping or clicking anywhere on the screen. You will have to time the placement right or you will end up with less room to build the next floor on!. As your tower gets higher and higher the speed will increase. If you manage to place a floor perfectly 5x in a row you can earn either Slow Speed or Extra Floors!',
	dispalyText = instructions;
var playButton = {
	img : new Image(),
	x : 250,
	y : 500,
	width : 100,
	height : 40
};	

var title = {
	img : new Image(),
	x : 100,
	y : 50,
	width : 400,
	height : 50
};	

// variables to calculate the betting
var floorOdds = new Array(7);
floorOdds[0] = {level : 20 , odds :"7:5" };
floorOdds[1] = {level : 35 , odds :"3:2" };
floorOdds[2] = {level : 50 , odds :"2:1" };
floorOdds[3] = {level : 65 , odds :"5:1" };
floorOdds[4] = {level : 80 , odds :"15:1"};
floorOdds[5] = {level : 90 , odds :"20:1"};
floorOdds[6] = {level : 100, odds :"35:1"};

var bettingAmounts = new Array(4);
bettingAmounts[0] = { value: 10, unit : "p" };
bettingAmounts[1] = { value: 50, unit : "p" };
bettingAmounts[2] = { value: 1, unit : "£" };
bettingAmounts[3] = { value: 2, unit : "£" };
bettingAmounts[4] = { value: 5, unit : "£" };

currentBetIndex = 0;
currentOddIndex = 0;
currentWinningCalculation = "25p";

// sound variables
var sounds = {
	coin : null,
	thud : null,
	bonus : null,
	win : null,
	lose : null
}

// variables to do with bonuses
var bonuses = {
	slowSpeed : 3,
	bonusFloors : 2,
	slowSpeedMessage : "Floor Speed Slowed!",
	bonusFloorMessage: "x Floors Added!",
	active : false,
	slowSpeedActive : false,
	position : {
		x : 5,
		y : 80
	}
}

window.onload = function() 
{
	canvas = document.getElementById('game');
	canvasContext = canvas.getContext('2d');
	canvasHeight = canvas.height;
	canvasWidth = canvas.width;
	
	bonuses.bonusFloorMessage = bonuses.bonusFloors + bonuses.bonusFloorMessage;
	canvas.addEventListener('click', ClickButtons);
	
	LoadResources();
	GameLoop();
};

function LoadResources()
{
	buildingImage.source.src = 'resources/building.jpg';
	arrows.UPimg.src = 'resources/arrow-UP.png';
	arrows.DOWNimg.src = 'resources/arrow-DOWN.png';
	playButton.img.src = 'resources/play.png';
	title.img.src = 'resources/title.png'
	
	sounds.coin =  new Audio('resources/coins.wav');
	sounds.thud =  new Audio('resources/thud.wav');
	sounds.bonus = new Audio('resources/bonus.wav');
	sounds.win = new Audio('resources/win.wav');
	sounds.lose = new Audio('resources/lose.wav');
}

function DisplayInfoScreen()
{
	canvasContext.beginPath();
	canvasContext.rect(20,20, canvasWidth - 40 , canvasHeight - 40);
	canvasContext.fillStyle = '#B5E2F7';
	canvasContext.fill();
	canvasContext.lineWidth = 5;
    canvasContext.strokeStyle = 'black';
    canvasContext.stroke();
	
	canvasContext.drawImage(title.img, title.x, title.y, title.width, title.height);
	
	canvasContext.fillStyle = 'blue';
	canvasContext.font = 'italic 20px Helvetica';
	
    wrapText(canvasContext, dispalyText, 25, 145, canvasWidth - 45 , 20);
		
	canvasContext.drawImage(arrows.UPimg, arrows.targetUP.x, arrows.targetUP.y, arrows.size, arrows.size);  
	canvasContext.drawImage(arrows.DOWNimg, arrows.targetDOWN.x, arrows.targetDOWN.y, arrows.size, arrows.size);
	canvasContext.drawImage(arrows.UPimg, arrows.betUP.x, arrows.betUP.y, arrows.size, arrows.size);
	canvasContext.drawImage(arrows.DOWNimg, arrows.betDOWN.x, arrows.betDOWN.y, arrows.size, arrows.size);
	
	var oddsString = "Target: " + floorOdds[currentOddIndex].level + " floors (" + floorOdds[currentOddIndex].odds + ")";
	canvasContext.fillText(oddsString, arrows.targetDOWN.x - canvasContext.measureText(oddsString).width, arrows.targetDOWN.y);
	
	var betString ="";
	
	if (bettingAmounts[currentBetIndex].unit == "£")
	{
		betString= "Bet: " + bettingAmounts[currentBetIndex].unit + bettingAmounts[currentBetIndex].value;
	}
	else
	{
		betString= "Bet: " + bettingAmounts[currentBetIndex].value + bettingAmounts[currentBetIndex].unit;
	}
	canvasContext.fillText(betString, arrows.betDOWN.x - canvasContext.measureText(betString).width, arrows.betDOWN.y);
	
	canvasContext.fillText("Potential return: " + currentWinningCalculation, arrows.betDOWN.x + 30, arrows.betDOWN.y);
	
	canvasContext.drawImage(playButton.img, playButton.x, playButton.y, playButton.width, playButton.height);
}

function ClickButtons(event) 
{
	mouseX = event.pageX - document.getElementById('game').offsetLeft;
	mouseY = event.pageY - document.getElementById('game').offsetTop;
	
	if (mouseX > arrows.targetUP.x && mouseX < arrows.targetUP.x + arrows.size && mouseY > arrows.targetUP.y && mouseY < arrows.targetUP.y + arrows.size) 
	{
		if (currentOddIndex < floorOdds.length -1)
		{
			currentOddIndex++;
		}
	}
	else if (mouseX > arrows.targetDOWN.x && mouseX < arrows.targetDOWN.x + arrows.size && mouseY > arrows.targetDOWN.y && mouseY < arrows.targetDOWN.y + arrows.size) 
	{
		if (currentOddIndex > 0)
		{
			currentOddIndex--;
		}
	}
	else if (mouseX > arrows.betUP.x && mouseX < arrows.betUP.x + arrows.size && mouseY > arrows.betUP.y && mouseY < arrows.betUP.y + arrows.size) 
	{
		sounds.coin.play();
		if (currentBetIndex < bettingAmounts.length -1)
		{
			currentBetIndex++;
		}
	}
	else if (mouseX > arrows.betDOWN.x && mouseX < arrows.betDOWN.x + arrows.size && mouseY > arrows.betDOWN.y && mouseY < arrows.betDOWN.y + arrows.size) 
	{
		sounds.coin.play();
		if (currentBetIndex > 0)
		{
			currentBetIndex--;
		}
	}
	else if (mouseX > playButton.x && mouseX < playButton.x + playButton.width && mouseY > playButton.y && mouseY < playButton.y + playButton.height)
	{
		StartGame();
		
	}
	CalculateWinings();
}

function CalculateWinings()
{
	// converts £ to pence
	var pence = bettingAmounts[currentBetIndex].unit == "£" ? (bettingAmounts[currentBetIndex].value * 100) : bettingAmounts[currentBetIndex].value;
	var pence = bettingAmounts[currentBetIndex].unit == "£" ? (bettingAmounts[currentBetIndex].value * 100) : bettingAmounts[currentBetIndex].value;
	
	var betChance = floorOdds[currentOddIndex].odds.split(':');
	
	var betIncrease = (betChance[0] / betChance[1]) * pence;
	
	pence += betIncrease; 
	
	//checks if the amount is greater then a pound before storing
	currentWinningCalculation = pence >= 100 ? "£" + (pence / 100).toFixed(2) : pence + "p";	
}

function StartGame()
{
	canvas.addEventListener('click', PlaceFloor);
	canvas.removeEventListener("click", ClickButtons);
	
	floor.position = canvasWidth / 2;
	floor.width = 300;
	floor.speed = 3;
	floor.imageWidth = buildingImage.width;
	playing = true;
		
	targetPosition = (canvasWidth / 2) - (floor.width / 2);
	floorLevel = 0,
	combo = 0,
	target = floorOdds[currentOddIndex].level;
	winnings = currentWinningCalculation;
	
	for ( i = 0 ; i < previousFloors.length ; i++)
	{
		previousFloors[i] = {
			width : floor.width,
			imageWidth :floor.imageWidth,
			position : targetPosition,
			spriteID : Math.floor(Math.random() * 3) + 1 
		}
	}
}

function GameOver()
{
	canvas.addEventListener('click',ClickButtons);
	canvas.removeEventListener("click", PlaceFloor);
	
	playing = false;
	
	if (lost)
	{
		sounds.lose.play();
		title.img.src = 'resources/game-over.png';
		dispalyText = 'Oh No! Unfortunetly you only made it ' + floorLevel +' Floors , better luck next time. Would you like to play again?';
	}
	else
	{
		sounds.win.play();
		title.img.src = 'resources/won.png';
		dispalyText = 'Congratulations ! You managed to make it to your target floor. ' + winnings + ' has been added to your account. Would you like to play again?';
	}
}

function GameLoop() 
{
    window.requestAnimationFrame(GameLoop);
    
    currentTime = (new Date()).getTime();
    delta = (currentTime-lastTime);

    if(delta > interval) 
	{
		canvasContext.clearRect(0, 0, canvasHeight, canvasWidth);
		
		Draw();
		if (playing)
		{
			Update();
		}
		else
		{
			DisplayInfoScreen();
		}

        lastTime = currentTime - (delta % interval);
    }
}

function Update()
{
	UpdateCurrentFloor();
	
	if (floorLevel >= target)
	{
		lost = false;
		GameOver();
	}
}

function Draw()
{
	DrawBackground();
	DrawGameInfo();
	DrawCurrentFloor();
	DrawPreviousFloors();
	
	if (bonuses.active)
	{
		DrawBonusAlert();
	}
}

function DrawBackground()
{
	canvasContext.beginPath();
	canvasContext.rect(0, 0, canvasWidth, canvasHeight);
	
	var grd = canvasContext.createLinearGradient(0, 0, 0, canvasHeight);
    grd.addColorStop(0, '#5ECFFF');   
    grd.addColorStop(1, 'white');
	
    canvasContext.fillStyle = grd;
	canvasContext.fill();
}

function UpdateCurrentFloor()
{
	if (floor.position + floor.width >= canvasWidth || floor.position <= 0) // if the floor has reached the edge of the screen
	{
		if (bonuses.slowSpeedActive)
		{
			bonuses.slowSpeed = bonuses.slowSpeed - (bonuses.slowSpeed * 2);
		}
		else
		{
			floor.speed = floor.speed - (floor.speed * 2); //flips the direction the floor is travelling
		}
	}
	
	if (bonuses.slowSpeedActive) // checking to see if the slow speed bonus is active
	{
		floor.position += bonuses.slowSpeed;
	}
	else
	{
		floor.position += floor.speed;
	}
}

function DrawCurrentFloor()
{
	var temp = GetSprite(floor.spriteID);
      canvasContext.drawImage(buildingImage.source,
	  temp.x,
	  temp.y,
	  floor.imageWidth,
	  temp.height,
	  floor.position,
	  (canvasHeight / 2) - floor.height, 
	  floor.width,
	  floor.height);

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
			previousFloors[i].imageWidth,
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
		height: buildingImage.height / 3
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

// wrap text function found at  http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }

function DrawGameInfo()
{
	canvasContext.beginPath();
	canvasContext.rect(0, 0, canvasWidth, 50);
	canvasContext.fillStyle = '#33CCCC';
	canvasContext.fill();
	
	canvasContext.fillStyle = 'blue';
	canvasContext.font = 'italic 20pt Helvetica';
	
	var floorString = "Floor: " + floorLevel;
	var comboString = "Combo: " + combo;
	
    canvasContext.fillText(floorString, 5, 40);
	canvasContext.fillText(comboString, canvasWidth - canvasContext.measureText(comboString).width -5, 40);

}

function DrawBonusAlert()
{
	canvasContext.fillStyle = 'blue';
	canvasContext.font = 'italic 20pt Helvetica';
	
	if (bonuses.slowSpeedActive)
	{
		canvasContext.fillText(bonuses.slowSpeedMessage, bonuses.position.x, bonuses.position.y);
	}
	else
	{
		canvasContext.fillText(bonuses.bonusFloorMessage, bonuses.position.x, bonuses.position.y);
	}
}

function PlaceFloor()
{
	var difference = Math.abs(floor.position - targetPosition);
	sounds.thud.play();
	
	// resets the bonuses
	bonuses.active = false;
	bonuses.slowSpeedActive = false;
	
	if (difference > marginOfError)
	{
		floor.width -= difference;
		
		totalSizeDifference += difference;
		while (totalSizeDifference >= 300 / 6) // reduces the size of future selected sprite to stop the image being squashed
		{
			floor.imageWidth -= buildingImage.width/6;
			totalSizeDifference -= 300 / 6;
		}
		
		if (floor.width <= 0)
		{
			lost = true;
			GameOver();
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
	
	if ((combo % 5) == 0 && combo != 0)
	{
		ApplyBonus();
	}
	
	SetupPreviousFloors();
	
	if ((Math.floor(Math.random() * 2) + 1) == 1) // alternates starting side
	{
		floor.position = 1;
		floor.speed = Math.abs(floor.speed) + 0.25;
	}
	else
	{
		floor.position = canvasWidth - floor.width - 1;
		floor.speed = -Math.abs(floor.speed) - 0.25;;
	}
	floorLevel++;
}

function ApplyBonus()
{
	sounds.bonus.play();
	bonuses.active = true;
	if ((Math.floor(Math.random() * 2) + 1) == 1)
	{
		bonuses.slowSpeedActive = true;
	}
	else
	{
		for ( i = 0 ; i < bonuses.bonusFloors ; i++)
		{
			SetupPreviousFloors();
			floorLevel++;
		}
	}
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
		imageWidth :floor.imageWidth,
		position : tempPos,
		spriteID : Math.floor(Math.random() * 3) + 1 
	};
}
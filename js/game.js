var canvasContext = null
    fps = 30,
    interval     =    1000/fps,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0,
	canvasHeight = 0,
	canvasWidth = 0;
	

window.onload = function() 
{
	var canvas = document.getElementById('game');
	canvasContext = canvas.getContext('2d');
	canvasHeight = canvas.height;
	canvasWidth = canvas.width;
	gameLoop();
};


function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    
    currentTime = (new Date()).getTime();
    delta = (currentTime-lastTime);

    if(delta > interval) 
	{
		canvasContext.clearRect(0,0,canvasHeight,canvasWidth);
		console.log("looping");
        lastTime = currentTime - (delta % interval);
    }
}

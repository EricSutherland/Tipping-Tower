window.onload = function() {
	var canvas = document.getElementById('game');
    var context = canvas.getContext('2d');
	context.font = '40pt Calibri';
    context.fillStyle = 'blue';
    context.fillText('Hello World!', 150, 100);
};
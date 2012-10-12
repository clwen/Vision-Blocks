var loadImage = function (nextBlock) {
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var img = new Image();
    img.src = "img/rmc.jpg";
	var maxWidth = 320;
	var maxHeight = 240;
	
	img.onload = function() {
		var newSize = resize(img, maxWidth, maxHeight);
		context.drawImage(img, 0, 0, newSize[0], newSize[1]);
		VB.interpreter.dictionary["canvas"] = canvas;
		nextBlock.execute();
	};	
};

var loadVideo = function (nextBlock) {
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var video = document.getElementById("inputVideo");
	switch(video.src) {
		case "":
			video.src = "img/fox.mp4";
			if(video.paused) video.play();
			function draw() {
				if(video.ended) return false;
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				VB.interpreter.dictionary["canvas"] = canvas;
				nextBlock.execute();
				setTimeout(draw,10);
			}
			draw();
			break;
		default:
			break;
	}
	return video;
};

var loadWebcam = function (nextBlock) {
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var video = document.getElementById("inputVideo");
	if (navigator.getUserMedia) {	
		if(video.paused) video.play();
		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		VB.interpreter.dictionary["canvas"] = canvas;
		nextBlock.execute();
	} else {
		console.error("Can't access webcam...");
	}
};

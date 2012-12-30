var remoteImage = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var img = new Image();
	var url = null;
	if (this.options) {
		url = this.options['remoteImgUrl'];
	}
	img.src = url ? url : "./files/mona_lisa.jpg";
	var maxWidth = 640;
	var maxHeight = 480;
	
	img.onload = function() {
		var newSize = resize(img, maxWidth, maxHeight);
		context.drawImage(img, 0, 0, newSize[0], newSize[1]);
		VB.interpreter.dictionary["canvas"] = canvas;
		
		thiss.executeNext();
	};	
};

var loadImage = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var img = new Image();
	var url = null;
	if (this.options) {
		url = this.options['url'];
	}
	img.src = url ? url : "./files/mona_lisa.jpg";
	var maxWidth = 640;
	var maxHeight = 480;
	
	img.onload = function() {
		var newSize = resize(img, maxWidth, maxHeight);
		context.drawImage(img, 0, 0, newSize[0], newSize[1]);
		VB.interpreter.dictionary["canvas"] = canvas;
		
		thiss.executeNext();
	};	
};

var loadVideo = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var video = document.getElementById("inputVideo");
	
	var url = null;
	if (this.options) {
		url = this.options['url'];
	}
	
	url = url ? url : "file/fox.mp4";
	
	if (video.src.indexOf(url) == -1) {
		video.src = url;
	}
	
	if (video.paused) {
		video.play();
	}
	
	context.drawImage(video, 0, 0, canvas.width, canvas.height);
	VB.interpreter.dictionary["canvas"] = canvas;
	thiss.executeNext();
};

var loadWebcam = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var video = document.getElementById("inputVideoCam");
	if (navigator.getUserMedia) {	
		if(video.paused) video.play();
		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		VB.interpreter.dictionary["canvas"] = canvas;
		thiss.executeNext();
	} else {
		console.error("Can't access webcam...");
	}
};

var loadFoodcam = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var video = document.getElementById("inputVideoCam");

    var mjpeg = new MjpegCanvas({
        host : 'foodcam-proxy.media.mit.edu',
        topic : '/axis-cgi/mjpg/video.cgi?',
        canvasID : 'outputCanvas',
    });

    VB.interpreter.dictionary["canvas"] = canvas;
    thiss.executeNext();
};

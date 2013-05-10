var remoteImage = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var img = new Image();
	var url = null;
	if (this.options) {
		url = this.options['remoteImgUrl'];
	}
	img.src = url ? url : "./files/cell.gif";
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
	img.src = url ? url : "./files/cell.gif";
	var maxWidth = 640;
	var maxHeight = 480;
	
	img.onload = function() {
		var newSize = resize(img, maxWidth, maxHeight);
		context.drawImage(img, 0, 0, newSize[0], newSize[1]);
		VB.interpreter.dictionary["canvas"] = canvas;
		
		thiss.executeNext();
	};	
};

var remoteVideo = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");
	var context = canvas.getContext('2d');
	var video = document.getElementById("inputVideo");
	
	var url = null;
	if (this.options) {
		url = this.options['remoteVideoUrl'];
	}
	
	url = url ? url : "http://vblocks.media.mit.edu/files/fox.mp4";
	
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
        askWebcamPermission();
	}
};

var loadFoodcam = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");

    var mjpeg = new MjpegCanvas({
        host : 'vblocks.media.mit.edu',
        topic : '/proxy/foodcam/video.cgi?',
        canvasID : 'outputCanvas',
    });

    VB.interpreter.dictionary["canvas"] = canvas;
    thiss.executeNext();
};

var loadTrafficcam = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");

    var mjpeg = new MjpegCanvas({
        host : 'vblocks.media.mit.edu',
        topic : '/proxy/traffic/nphMotionJpeg?Resolution=640x480',
        canvasID : 'outputCanvas',
    });

    VB.interpreter.dictionary["canvas"] = canvas;
    thiss.executeNext();
};

var loadParkingcam = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");

    var mjpeg = new MjpegCanvas({
        host : 'vblocks.media.mit.edu',
        topic : '/proxy/parking/nphMotionJpeg?Resolution=640x480',
        canvasID : 'outputCanvas',
    });

    VB.interpreter.dictionary["canvas"] = canvas;
    thiss.executeNext();
};

var loadLaundrocam = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");

    var mjpeg = new MjpegCanvas({
        host : 'vblocks.media.mit.edu',
        topic : '/proxy/laundro/nphMotionJpeg?Resolution=640x480',
        canvasID : 'outputCanvas',
    });

    VB.interpreter.dictionary["canvas"] = canvas;
    thiss.executeNext();
};

var loadPortcam = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");

    var mjpeg = new MjpegCanvas({
        host : 'vblocks.media.mit.edu',
        topic : '/proxy/port/nphMotionJpeg?Resolution=640x480',
        canvasID : 'outputCanvas',
    });

    VB.interpreter.dictionary["canvas"] = canvas;
    thiss.executeNext();
};

var loadStorecamA = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");

    var mjpeg = new MjpegCanvas({
        host : 'vblocks.media.mit.edu',
        topic : '/proxy/dads/video.cgi',
        canvasID : 'outputCanvas',
    });

    VB.interpreter.dictionary["canvas"] = canvas;
    thiss.executeNext();
};

var loadStorecamB = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");

    var mjpeg = new MjpegCanvas({
        host : 'vblocks.media.mit.edu',
        topic : '/proxy/bike/video.cgi',
        canvasID : 'outputCanvas',
    });

    VB.interpreter.dictionary["canvas"] = canvas;
    thiss.executeNext();
};

var loadBirdcam = function () {
	var thiss = this;
	var canvas = document.querySelector("#outputCanvas");

    var mjpeg = new MjpegCanvas({
        host : 'vblocks.media.mit.edu',
        topic : '/proxy/bird/nphMotionJpeg?Resolution=640x480',
        canvasID : 'outputCanvas',
    });

    VB.interpreter.dictionary["canvas"] = canvas;
    thiss.executeNext();
};


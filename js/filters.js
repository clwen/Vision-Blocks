var grayScale = function (canvas) {
	var pixels = getPixels(canvas);
	var data = pixels.data;
	var i, r, g, b, v;
	for (i=0; i<data.length; i+=4) {
		r = data[i];
		g = data[i+1];
		b = data[i+2];
		v = 0.2126*r + 0.7152*g + 0.0722*b;
		data[i] = data[i+1] = data[i+2] = v;
	}
    return pixels;
};

var invert = function (canvas) {
	var pixels = getPixels(canvas);
	var data = pixels.data;
	var i;
	for (i=0; i<data.length; i+=4) {
		data[i] = 255 - data[i];
		data[i+1] = 255 - data[i+1];
		data[i+2] = 255 - data[i+2];
	}
    return pixels;
};

var colorRearrangement = function(canvas){
	var pixels = getPixels(canvas);
	var newPixels = getPixels(canvas);
	var data = pixels.data;
	var newData = newPixels.data;
	var i;
	for (i=0; i<data.length; i+=4) {
		newData[i] = data[i+1];
		newData[i+1] = data[i+2];
		newData[i+2] = data[i];
	}
    return newPixels;
};

var sobel = function(canvas) {
	var v = convolve(canvas, [-1,0,1,-1,0,1,-1,0,1], true);
 	var h = convolve(canvas, [-1,-1,-1,0,0,0,1,1,1], true);
	var outputPixels = v;
	var hData = h.data;
	var oData = v.data;
	var i;
	for (i = 0 ; i < hData.length; i++) {
		oData[i]+=hData[i];
	}
	return outputPixels;
};

var distortion = function(args) {
	var canvas = args[0];
	var pixels = getPixels(canvas);
	var data = pixels.data;
	var dPixels = getPixels(canvas);
	var dData = dPixels.data;
	var width = VB.defaultValues.workingArea.width;
	var height = VB.defaultValues.workingArea.height;
	var centerX = Math.floor(width/2);
	var centerY = Math.floor(height/2);
	var radius = 0.35;
	var aux, dx, dy, sx, sy, newI;
	var i;

	for (i=0; i<data.length; i+=4) {
		aux = i/4;
		dx = aux % width;
		dy = Math.floor(aux / width);
		sx = Math.floor(dx + Math.abs(centerX - dx) * radius);
		sy = Math.floor(dy + Math.abs(centerY - dy) * radius);
		newI = (sy * width + sx) * 4;
		dData[i] = data[newI];
		dData[i+1] = data[newI+1];
		dData[i+2] = data[newI+2];
		dData[i+3] = data[newI+3];
	}
	return dPixels;
};

var faceDetection = function(canvas) { 
	var canvas = canvas;
	new HAAR.Detector(haarcascade_frontalface_alt)
		.image(canvas).complete(function() {
			var rect=this.objects[0];
			var ctx=canvas.getContext('2d');
			ctx.strokeStyle="rgba(0,0,0,1)";
			ctx.strokeRect(rect.x,rect.y,rect.width,rect.height);
			vb.Interpreter.dictionary["face"] = objects;
		}).detect(1, 1.25, 0.1, 1, true);

	return getPixels(canvas);
};
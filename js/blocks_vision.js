var faceDetection = function() {
	var thiss = this;
	var canvas = VB.interpreter.dictionary["canvas"];
	VB.interpreter.dictionary["faces_array"] = new HAAR.Detector(haarcascade_frontalface_alt)
		.image(canvas).complete(function(){
			VB.interpreter.dictionary["faces_array"] = this.objects;
			if (this.objects && this.objects.length > 0) {
				VB.interpreter.dictionary["faces"] = this.objects.length;
				
				var face0 = this.objects[0];
				VB.interpreter.dictionary["faceX"] = face0.x;
				VB.interpreter.dictionary["faceY"] = face0.y;
				VB.interpreter.dictionary["faceW"] = face0.width;
				VB.interpreter.dictionary["faceH"] = face0.height;
			} else {
				VB.interpreter.dictionary["faces"] = 0;
			}
			thiss.executeNext();
		}).detect(1, 1.25, 0.1, 1, true);
};

var drawRegion = function() {
	var faces = VB.interpreter.dictionary["faces_array"];
	if (faces) {
		for (var i in faces) {
			draw(faces[i], this.options['rgb']);
		}
	}
};

var selectRegion = function() {
	VB.interpreter.dictionary["workingArea"].x = this.options['x'];
	VB.interpreter.dictionary["workingArea"].x = this.options['y'];
	VB.interpreter.dictionary["workingArea"].x = this.options['width'];
	VB.interpreter.dictionary["workingArea"].x = this.options['height'];
}


var intrusionDetection = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var newPixels = getPixels(canvas);
	var data = pixels.data;
	var newData = newPixels.data;

	if (!VB.interpreter.dictionary["pixelsMean"]) {
		VB.interpreter.dictionary["pixelsMean"] = data;
	}

	var pixelsMean = VB.interpreter.dictionary["pixelsMean"];
	var i;

	for (i=0; i<data.length; i+=4) {
		newData[i] = data[i] - pixelsMean[i];
		newData[i+1] = data[i+1] - pixelsMean[i+1];
		newData[i+2] = data[i+2] - pixelsMean[i+2];

		pixelsMean[i] = (pixelsMean[i] + data[i]) / 2;
		pixelsMean[i+1] = (pixelsMean[i+1] + data[i+1]) / 2;
		pixelsMean[i+2] = (pixelsMean[i+2] + data[i+2]) / 2;
	}
	updateCanvas(newPixels);
}

var speedDetection = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
}
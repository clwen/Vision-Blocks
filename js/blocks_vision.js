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

var drawRegions = function() {
	var boxes = VB.interpreter.dictionary[this.options['boxes']];
	if (boxes) { 
		for (var i in boxes) {
			draw(boxes[i], this.options['rgb']);
		}
	}
};

var selectRegion = function() {
	VB.interpreter.dictionary["workingArea"].x = this.options['x'];
	VB.interpreter.dictionary["workingArea"].y = this.options['y'];
	VB.interpreter.dictionary["workingArea"].width = this.options['width'];
	VB.interpreter.dictionary["workingArea"].height = this.options['height'];
	draw(VB.interpreter.dictionary["workingArea"], 000000);
}


var intrusionDetection = function () {
	VB.interpreter.dictionary["intrusion"] = false;
	VB.interpreter.dictionary["workingArea"].x = this.options['x'];
	VB.interpreter.dictionary["workingArea"].y = this.options['y'];
	VB.interpreter.dictionary["workingArea"].width = this.options['width'];
	VB.interpreter.dictionary["workingArea"].height = this.options['height'];
	draw(VB.interpreter.dictionary["workingArea"], 000000);
	
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var newPixels = getPixels(canvas);
	var data = pixels.data;
	var newData = newPixels.data;

	if (!VB.interpreter.dictionary["pixelsMean"]) {
		VB.interpreter.dictionary["pixelsMean"] = data;
	}

	var pixelsMean = VB.interpreter.dictionary["pixelsMean"];
	var i=0, end=0;
	var begin = data.length;

	for (i=0; i<data.length; i+=4) {
		newData[i] = data[i] - pixelsMean[i];
		newData[i+1] = data[i+1] - pixelsMean[i+1];
		newData[i+2] = data[i+2] - pixelsMean[i+2];

		if (((newData[i] + newData[i+1] + newData[i+2])/3) > 128) {
			VB.interpreter.dictionary["intrusion"] = true;
		}

		pixelsMean[i] = (pixelsMean[i] + data[i]) / 2;
		pixelsMean[i+1] = (pixelsMean[i+1] + data[i+1]) / 2;
		pixelsMean[i+2] = (pixelsMean[i+2] + data[i+2]) / 2;
	}

}

var speedDetection = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
}
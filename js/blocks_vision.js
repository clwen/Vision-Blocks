var faceDetection = function() { 
	var canvas = VB.interpreter.dictionary["canvas"];
	new HAAR.Detector(haarcascade_frontalface_alt)
		.image(canvas).complete(function(objects) {
			VB.interpreter.dictionary["face"] = this.objects;
		}).detect(1, 1.25, 0.1, 1, true);
	return VB.interpreter.dictionary["face"];
};

var selectRegion = function() {
	var faces = VB.interpreter.dictionary["face"];
	if (faces) {
		for (var i in faces) {
			drawRegion(faces[i]);
		}
	}
};
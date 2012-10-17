var faceDetection = function() {
	var thiss = this;
	var canvas = VB.interpreter.dictionary["canvas"];
	VB.interpreter.dictionary["faces_array"] = new HAAR.Detector(haarcascade_frontalface_alt)
		.image(canvas).complete(function(){
			VB.interpreter.dictionary["faces_array"] = this.objects;
			VB.interpreter.dictionary["faces"] = this.objects ? this.objects.length : 0;
			thiss.executeNext();
		}).detect(1, 1.25, 0.1, 1, true);
};

var selectRegion = function() {
	var faces = VB.interpreter.dictionary["faces_array"];
	if (faces) {
		for (var i in faces) {
			drawRegion(faces[i], this.options['rgb']);
		}
	}
};
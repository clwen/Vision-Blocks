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
	draw(VB.interpreter.dictionary["workingArea"], "FF0000");
};

var intrusionDetection = function () {
	VB.interpreter.dictionary["intrusion"] = false;
	VB.interpreter.dictionary["workingArea"].x = this.options['x'];
	VB.interpreter.dictionary["workingArea"].y = this.options['y'];
	VB.interpreter.dictionary["workingArea"].width = this.options['width'];
	VB.interpreter.dictionary["workingArea"].height = this.options['height'];
	draw(VB.interpreter.dictionary["workingArea"], "FF0000");
	
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var diffPixels = getPixels(canvas);
	var data = pixels.data;
    var diff = diffPixels.data;

	if (!VB.interpreter.dictionary["initData"]) {
		VB.interpreter.dictionary["initData"] = data;
	}

	var initData = VB.interpreter.dictionary["initData"];
	var i = 0;
    var diff_sum = 0;

	for (i = 0; i < data.length; i += 4) {
		diff_sum += data[i] - initData[i];
		diff_sum += data[i+1] - initData[i+1];
		diff_sum += data[i+2] - initData[i+2];
	}
    var avg_diff = diff_sum / (data.length * 0.75); // only three channels calculated
    var threshold = this.options['threshold'];
    if (avg_diff > threshold) {
        VB.interpreter.dictionary["intrusion"] = true;
    }
}

var opticalFlow = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var ctx = canvas.getContext('2d');
	var pixels = getPixels(canvas);
	var data = pixels.data;

	if (!VB.interpreter.dictionary["initData"]) {
		VB.interpreter.dictionary["initData"] = data;
	}

	var initData = VB.interpreter.dictionary["initData"];

	var winSize = 8;
	var winStep = winSize * 8 + 1;

	var i,j,k,l,address;

	var gradX, gradY, gradT;
	var A2, A1B2, B1, C1, C2;
	var u, v, uu, vv, n;
	
	uu = vv = n = 0;
	
	var width = VB.interpreter.dictionary["workingArea"].width;
	var height = VB.interpreter.dictionary["workingArea"].height;

	var wmax = width - winSize - 1;
	var hmax = height - winSize - 1;

	for (i = winSize + 1; i < hmax; i += winStep) {
		for (j = winSize + 1; j < wmax; j += winStep) {
			
			A2 = A1B2 = B1 = C1 = C2 = 0;

			for (k = -winSize; k <= winSize; k++) {
				for (l = -winSize; l <= winSize; l++) {
					address = (i + k) * width + j + l;

					gradX = (data[address - 1] & 0xff) - (data[address + 1] & 0xff);
					gradY = (data[address - width] & 0xff) - (data[address + width] & 0xff);
					gradT = (initData[address] & 0xff) - (data[address] & 0xff);

					A2 += gradX * gradX;
					A1B2 += gradX * gradY;
					B1 += gradY * gradY;
					C2 += gradX * gradT;
					C1 += gradY * gradT;
				}
			}
			var delta = (A1B2 * A1B2 - A2 * B1);

			if (delta) {
					/* system is not singular - solving by Kramer method */
					var deltaX, deltaY;
					var Idelta = 8 / delta;

					deltaX = -(C1 * A1B2 - C2 * B1);
					deltaY = -(A1B2 * C2 - A2 * C1);

					u = deltaX * Idelta;
					v = deltaY * Idelta;
				} else {
					/* singular system - find optical flow in gradient direction */
					var Norm = (A1B2 + A2) * (A1B2 + A2) + (B1 + A1B2) * (B1 + A1B2);

					if (Norm) {
						var IGradNorm = 8 / Norm;
						var temp = -(C1 + C2) * IGradNorm;
						u = (A1B2 + A2) * temp;
						v = (B1 + A1B2) * temp;
					} else {
						u = v = 0;
					}
				}

			if (-winStep < u && u < winStep && -winStep < v && v < winStep) {
				uu += u;
				vv += v;
				n++;
			}
			var scaleX = scaleY = Math.sqrt(u * u + v * v) * 2;
			var toDegree = 180 / Math.PI;
			var rotation = Math.atan2(v, u) * toDegree + 360;
			
			ctx.strokeRect(j-20,i-20,40,40);
			
			ctx.moveTo(j,i);

			ctx.lineTo(j+scaleX*Math.cos(rotation), i+scaleY*Math.sin(rotation));
			ctx.stroke();
		}
	}
	uu /= n;
	vv /= n;
	
	//Not completed
	// var scaleX = scaleY = Math.sqrt(uu * uu + vv * vv) * 10;
	// var toDegree = 180 / Math.PI;
	// var rotation = Math.atan2(vv, uu) * toDegree + 360;
	// ctx.strokeRect(0,0,160,80);
	// ctx.moveTo(80,40);

	// ctx.lineTo(scaleX*Math.cos(rotation), scaleY*Math.sin(rotation));
	// ctx.stroke();
}
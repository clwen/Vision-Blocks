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
	VB.interpreter.dictionary["initData"] = data;

	var winSize = 10;
	var winStep = winSize * 2 + 1;

	var i,j,k,l,address;

	var gradX, gradY, gradT;
	var A2, A1B2, B1, C1, C2;
	var u, v, uu, vv, n;

	uu = vv = n = 0;
	
	var width = VB.interpreter.dictionary["workingArea"].width;
	var height = VB.interpreter.dictionary["workingArea"].height;

	var wmax = (width*4) - (winSize*4) - 4;
	var hmax = height - winSize - 1;

	var pVX, nVX, pVY, nVY, pVT, nVT;
	// http://www.mathworks.com/help/vision/ref/vision.opticalflowclass.html
	for (i = winSize + 1; i < hmax; i+=winStep) {
		for (j = (winSize*4); j < wmax; j += (winStep*4)) {
			A2 = A1B2 = B1 = C1 = C2 = 0;

			for (k = -winSize; k <= winSize; k++) {
				for (l = -(winSize*4); l <= winSize*4; l+=4) {
					
					address = (i + k) * (width*4) + j + l;

					pVX = Math.max(data[address-4],data[address-3],data[address-2]);
					nVX = Math.max(data[address+4],data[address+5],data[address+6]);

					pVY = Math.max(data[address-(width*4)],data[address-(width*4)+1],data[address-(width*4)+2]);
					nVY = Math.max(data[address+(width*4)],data[address+(width*4)+1],data[address+(width*4)+2]);

					pVT = Math.max(initData[address], initData[address+1], initData[address+2]);
					nVT = Math.max(data[address], data[address+1], data[address+2]);

					gradX = (pVX & 0xff) - (nVX & 0xff);
					gradY = (pVY & 0xff) - (nVY & 0xff);
					gradT = (pVT & 0xff) - (nVT & 0xff);

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

			var scaleX = scaleY = Math.sqrt(u * u + v * v);

			if (scaleY > winSize) {
				scaleY = winSize;
			}

			if (scaleX > winSize) {
				scaleX = winSize;
			}

			var toDegree = 180 / Math.PI;
			var rotation = Math.atan2(v, u);
			ctx.beginPath();
			ctx.moveTo((j-1)/4 , i);
			ctx.lineTo(((j-1)/4)+scaleX*Math.cos(rotation), i+scaleY*Math.sin(rotation));
			ctx.strokeStyle = "#000000"
			ctx.lineWidth = 1;
			ctx.stroke();
			if (-winStep < u && u < winStep && -winStep < v && v < winStep) {
				uu += u;
				vv += v;
				n++;
			}
		}
	}
	uu /= n;
	vv /= n;
	var scale = Math.sqrt(uu*uu+vv*vv)*25; 
	var toDegree = 180 / Math.PI;
	var rotation = Math.atan2(vv, uu);
	ctx.beginPath();
	ctx.moveTo(width/2, height/2);
	ctx.lineTo((width/2)+scale*Math.cos(rotation), (height/2)+scale*Math.sin(rotation));
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#ff0000";
	ctx.stroke();

}
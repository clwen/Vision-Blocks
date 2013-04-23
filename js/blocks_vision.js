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
    console.log(VB.interpreter.dictionary['intrusion'])
    if (avg_diff > threshold) {
        VB.interpreter.dictionary["intrusion"] = true;
    }
}

var opticalFlow = function () {
    var canvas = VB.interpreter.dictionary["canvas"];
    var ctx = canvas.getContext('2d');
    var pixels = getPixels(canvas);
    var curr = pixels.data;

    if (!VB.interpreter.dictionary["prevData"]) {
        VB.interpreter.dictionary["prevData"] = curr;
    }

    var prev = VB.interpreter.dictionary["prevData"];
    VB.interpreter.dictionary["prevData"] = curr;

    var winSize = 8;
    var winStep = winSize * 2 + 1;

    var i, j, k, l, add; // add: address
    var gradX, gradY, gradT;
    var A2, A1B2, B1, C1, C2;
    var u, v, uu, vv, n;

    var width = VB.interpreter.dictionary["workingArea"].width;
    var height = VB.interpreter.dictionary["workingArea"].height;

    var wmax = (width*4) - (winSize*4) - 4;
    var hmax = height - winSize - 1;

    uu = vv = n = 0;

    for (i = winSize + 1; i < hmax; i+=winStep) {
        for (j = (winSize*4) + 4; j < wmax; j += (winStep*4)) {
            A2 = A1B2 = B1 = C1 = C2 = 0;

            for (k = -winSize; k <= winSize; k++) {
                for (l = -(winSize*4); l <= winSize*4; l+=4) {

                    add = (i + k) * (width*4) + j + l;

                    gradX = ((curr[add+4] - curr[add-4]) +      // R
                            (curr[add+5] - curr[add-3]) +       // G 
                            (curr[add+6] - curr[add-2])) / 3;   // B

                    gradY = ((curr[add + width*4] - curr[add - width*4]) +              // R
                             (curr[add + width*4 + 1] - curr[add - width*4 + 1]) +      // G
                             (curr[add + width*4 + 2] - curr[add - width*4 + 2])) / 3 ; // B

                    gradT = ((curr[add] - prev[add]) +          // R
                            (curr[add+1] - prev[add+1]) +       // G
                            (curr[add+2] - prev[add+2])) / 3;   // B

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
                // draw line for current point
                var rotation = Math.atan2(v, u);
                var toDegree = 180 / Math.PI;
                var hue = rotation * toDegree + 180;
                ctx.beginPath();
                ctx.strokeStyle = "hsl(" + hue + ", 80%, 50%)";
                ctx.lineWidth = 1;
                ctx.moveTo((j-1)/4, i);
                ctx.lineTo((j-1)/4 + u*3, i + v*3);
                ctx.stroke();

                // save u, v for the aggregated arrow
                uu += u;
                vv += v;
                n++;
            }
        } // end of inner-for (j for x)
    } // end of outer-for (i for y)

    // draw the aggregated arrow
    uu /= n;
    vv /= n;
    var scale = Math.sqrt(uu*uu + vv*vv) * 36;
    var rotation = Math.atan2(vv, uu);
    var toDegree = 180 / Math.PI;
    var hue = rotation * toDegree + 180;

    ctx.beginPath();
    ctx.strokeStyle = "hsl(" + hue + ", 80%, 50%)";
    ctx.lineWidth = 5;
    ctx.moveTo(width/2, height/2);
    ctx.lineTo((width/2) + scale*Math.cos(rotation), (height/2) + scale*Math.sin(rotation));
    ctx.stroke();
}

var opticalIntrusion = function(){
	//Setting up the variable
	VB.interpreter.dictionary["intrusion"] = false;
	//Setting up the region to draw
	
	VB.interpreter.dictionary["workingArea"].x = this.options['x'];
	VB.interpreter.dictionary["workingArea"].y = this.options['y'];
	VB.interpreter.dictionary["workingArea"].width = this.options['width'];
	VB.interpreter.dictionary["workingArea"].height = this.options['height'];

	//Drawing the region
	draw(VB.interpreter.dictionary["workingArea"], "FF0000");

	//Getting the canvas
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var currentData = pixels.data;

	//Checking for previous data
    if (!VB.interpreter.dictionary["prevData"]) {
        VB.interpreter.dictionary["prevData"] = currentData;
    }

    //Initialization data?
	if (!VB.interpreter.dictionary["initData"]) {
		VB.interpreter.dictionary["initData"] = currentData;
	}

    var prev = VB.interpreter.dictionary["prevData"];
    VB.interpreter.dictionary["prevData"] = currentData;

    var winSize = 8;
    var winStep = winSize * 2 + 1;

    //Vector and math variables
    var i, j, k, l, add; // add: address
    var gradX, gradY, gradT;
    var A2, A1B2, B1, C1, C2;
    var u, v, uu, vv, n;

    //Storing the dimensions into interpreter
    var width = VB.interpreter.dictionary["workingArea"].width;
    var height = VB.interpreter.dictionary["workingArea"].height;

    var wmax = (width*4) - (winSize*4) - 4;
    var hmax = height - winSize - 1;

    //Aggregate vector variables
    uu = vv = n = 0;

    //Divying up the window into a grid
    for (i = winSize + 1; i < hmax; i+=winStep) {
        for (j = (winSize*4) + 4; j < wmax; j += (winStep*4)) {
            A2 = A1B2 = B1 = C1 = C2 = 0;

            //[-winSize, winSize]
            for (k = -winSize; k <= winSize; k++) {
                for (l = -(winSize*4); l <= winSize*4; l+=4) {

                    add = (i + k) * (width*4) + j + l;

                    gradX = ((curr[add+4] - curr[add-4]) +      // R
                            (curr[add+5] - curr[add-3]) +       // G 
                            (curr[add+6] - curr[add-2])) / 3;   // B

                    gradY = ((curr[add + width*4] - curr[add - width*4]) +              // R
                             (curr[add + width*4 + 1] - curr[add - width*4 + 1]) +      // G
                             (curr[add + width*4 + 2] - curr[add - width*4 + 2])) / 3 ; // B

                    gradT = ((curr[add] - prev[add]) +          // R
                            (curr[add+1] - prev[add+1]) +       // G
                            (curr[add+2] - prev[add+2])) / 3;   // B

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
            	//Removed the code for drawing the vector
                // save u, v for the aggregated arrow
                uu += u;
                vv += v;
                n++;
            }//end if
        } // end of inner-for (j for x)
    } // end of outer-for (i for y)

    // draw the aggregated arrow
    uu /= n;
    vv /= n;
    var scale = Math.sqrt(uu*uu + vv*vv) * 36;

    if(scale >= 4.0){
        VB.interpreter.dictionary["intrusion"] = true;
    }

    //Removed the code for drawing the aggregate arrow
};
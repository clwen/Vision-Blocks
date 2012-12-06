var grayScale = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
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
    updateCanvas(pixels);
};

var invert = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var data = pixels.data;
	var i;
	for (i=0; i<data.length; i+=4) {
		data[i] = 255 - data[i];
		data[i+1] = 255 - data[i+1];
		data[i+2] = 255 - data[i+2];
	}
	updateCanvas(pixels);
};

var colorRearrangement = function(canvas){
	var canvas = VB.interpreter.dictionary["canvas"];
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
    updateCanvas(newPixels);
};

var sobel = function() {
	var canvas = VB.interpreter.dictionary["canvas"]
	var v = convolve(canvas, [-1,0,1,-1,0,1,-1,0,1], true);
 	var h = convolve(canvas, [-1,-1,-1,0,0,0,1,1,1], true);
	var outputPixels = v;
	var hData = h.data;
	var oData = v.data;
	var i;
	for (i = 0 ; i < hData.length; i++) {
		oData[i]+=hData[i];
	}
	updateCanvas(outputPixels);
};

var distortion = function(args) {
	var canvas = VB.interpreter.dictionary["canvas"]
	var pixels = getPixels(canvas);
	var data = pixels.data;
	var dPixels = getPixels(canvas);
	var dData = dPixels.data;
	var width = VB.interpreter.dictionary["workingArea"].width;
	var height = VB.interpreter.dictionary["workingArea"].height;
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
	updateCanvas(dPixels);
};

var rgb_to_h = function(r, g, b) {
    var h;
    var min, max;

    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    delta = max - min;

    if (max === 0) {
        h = -1;
        return h;
    }

    if (r === max) {
        h = (g - b) / delta;
    } else if (g === max) {
        h = 2 + (b - r) / delta;
    } else {
        h = 4 + (r - g) / delta;
    }

    h *= 60;
    if (h < 0) {
        h += 360;
    }
    return h;
}

var skinDetection = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var data = pixels.data;
    var r, g, b;
    var cr, cb, h;
	var i;
	for (i=0; i<data.length; i+=4) {
		r = data[i];
		g = data[i+1];
		b = data[i+2];

        cr = 0.15 * r - 0.3 * g + 0.45 * b + 128;
        cb = 0.45 * r - 0.35 * g - 0.07 + 128;
        h = rgb_to_h(r, g, b);

        if ((cr >= 140) && (cr <= 175) && 
                (cb >= 135) && (cb <= 200) &&
                (h >= 5) && (h <= 50)) {
            data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;
        } else {
            data[i] = 0;
            data[i+1] = 0;
            data[i+2] = 0;
        }
	}
	updateCanvas(pixels);
};

var pixelArt = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var data = pixels.data;
    var r, g, b;
    var cr, cb, h;
	var i;
	for (i=0; i<data.length; i+=4) {
		r = data[i];
		g = data[i+1];
		b = data[i+2];

        cr = 0.15 * r - 0.3 * g + 0.45 * b + 128;
        cb = 0.45 * r - 0.35 * g - 0.07 + 128;
        h = rgb_to_h(r, g, b);

        if ((cr >= 140) && (cr <= 175) && 
                (cb >= 135) && (cb <= 200) &&
                (h >= 5) && (h <= 50)) {
            data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;
        } else {
            data[i] = 0;
            data[i+1] = 0;
            data[i+2] = 0;
        }
	}
	updateCanvas(pixels);
};

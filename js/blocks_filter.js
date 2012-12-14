var grayscale = function () {
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

var binarize = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var data = pixels.data;
	var i, r, g, b, v;
	for (i=0; i<data.length; i+=4) {
		r = data[i];
		g = data[i+1];
		b = data[i+2];
		v = 0.2126*r + 0.7152*g + 0.0722*b;
        if (v > this.options['binThreshold']) {
            v = 255;
        } else {
            v = 0;
        }
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

var avg_colors = function(data, sx, sy, w, h, c, gsz) {
    var sum = 0.0;
    var pxl_num = 0.0; // number of pixels
    for (y = sy; y < sy+gsz; y += 1) {
        for (x = sx; x < sx+gsz; x += 1) {
            if ((x >= 0) && (x < w) && (y >= 0) && (y < h)) {
                sum += data[(y*w + x) * 4 + c];
                pxl_num += 1;
            }
        }
    }
    return sum / pxl_num;
};

var pixelization = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var data = pixels.data;
    var gsz = parseInt(this.options['gridSize']); // grid_size
    var w = canvas.width;
    var h = canvas.height;
    var x = 0, y = 0;
    // for each seed (top left corner in a block)
    for (y = 0; y < h; y += gsz) {
        for (x = 0; x < w; x += gsz) {
            // calculate r, g, b for this block
            avg_r = avg_colors(data, x, y, w, h, 0, gsz);
            avg_g = avg_colors(data, x, y, w, h, 1, gsz);
            avg_b = avg_colors(data, x, y, w, h, 2, gsz);

            // assign avg r, g, b to each pixel in this block
            for (yi = y; yi < y+gsz; yi += 1) {
                for (xi = x; xi < x+gsz; xi += 1) {
                    if ((xi >= 0) && (xi < w) && (yi >= 0) && (yi < h)) {
                        data[(yi*w + xi) * 4] = avg_r;
                        data[(yi*w + xi) * 4 + 1] = avg_g;
                        data[(yi*w + xi) * 4 + 2] = avg_b;
                    }
                }
            }
        }
	}
	updateCanvas(pixels);
};

var idx = function(x, y, c, w, h) {
    return ((y*w + x) * 4 + c);
};

var blur_avg = function(data, x, y, w, h, c, bsz) {
    var s = 0.0;
    var pxl_num = 0.0;
    for (yi = y-bsz; yi <= y+bsz; yi += 1) {
        for (xi = x-bsz; xi <= x+bsz; xi += 1) {
            if ((xi >= 0) && (xi < w) && (yi >= 0) && (yi < h)) { // if within canvas size
                s += data[idx(xi, yi, c, w, h)];
                pxl_num += 1;
            }
        }
    }
    return s / pxl_num;
};

var bluring = function () {
	var canvas = VB.interpreter.dictionary["canvas"];
	var pixels = getPixels(canvas);
	var data = pixels.data;
	var i;
    var w = canvas.width;
    var h = canvas.height;
    var x = 0, y = 0;
    var bsz = parseInt(this.options['blurSize']); // blur size
    for (y = 0; y < h; y += 1) {
        for (x = 0; x < w; x += 1) {
            data[(y*w + x) * 4] = blur_avg(data, x, y, w, h, 0, bsz);
            data[(y*w + x) * 4 + 1] = blur_avg(data, x, y, w, h, 1, bsz);
            data[(y*w + x) * 4 + 2] = blur_avg(data, x, y, w, h, 2, bsz);
        }
	}
	updateCanvas(pixels);
};

/* Aux Functions */
/* Resizes, under the same ratio, a object given a max width and a max height*/
var resize = function(obj, maxWidth, maxHeight) {
	var newW = obj.width, newH = obj.height;
	if(obj.width > maxWidth) {
		ratio = maxWidth / obj.width;
        newW =  maxWidth;
        newH =  obj.height * ratio;
        obj.height = obj.height * ratio;
        obj.width = obj.width * ratio;
	}
	
	if(obj.height > maxHeight) {
		ratio = maxHeight / obj.height;
        newH = maxHeight;
       	newW = obj.width * ratio;
        obj.width = obj.width * ratio;
	}

	return [newW, newH];
};

/* Returns the pixels of a given canvas element */
var getPixels = function (canvas) {
  ctx = canvas.getContext('2d');
  return ctx.getImageData(
  		VB.interpreter.dictionary["workingArea"].x,
  		VB.interpreter.dictionary["workingArea"].y,
  		VB.interpreter.dictionary["workingArea"].width,
  		VB.interpreter.dictionary["workingArea"].height
  		);
};

/* Concolves the information inside a given canvas element with
	a given kernel */
var convolve = function (canvas, kernel, opaque) {
	var base = Math.round(Math.sqrt(kernel.length));
	var topLeft = Math.floor(base-1/2);
	var ctx = canvas.getContext('2d');
	var srcPixels = getPixels(canvas).data;
	var output = getPixels(canvas);
	var dstPixels = output.data;
	var alphaFac = opaque ? 1 : 0;

	var y, x, sy, sx, dstOff, r, g, b, a, cy, cx, scy, scx, srcOff, wt;

	for (y=0; y < canvas.height; y++) {
	  for (x=0; x< canvas.width; x++) {
	    sy = y;
	    sx = x;
	    dstOff = (y* canvas.width +x)*4;
	    r=0, g=0, b=0, a=0;
	    for (cy=0; cy<base; cy++) {
	      for (cx=0; cx<base; cx++) {
	        scy = Math.min(canvas.height-1, Math.max(0, sy + cy - topLeft));
	        scx = Math.min(canvas.width-1, Math.max(0, sx + cx - topLeft));
	        srcOff = (scy* canvas.width +scx)*4;
	        wt = kernel[cy*base+cx];
	        r += srcPixels[srcOff] * wt;
	        g += srcPixels[srcOff+1] * wt;
	        b += srcPixels[srcOff+2] * wt;
	        a += srcPixels[srcOff+3] * wt;
	      }
	    }
	    dstPixels[dstOff] = r;
	    dstPixels[dstOff+1] = g;
	    dstPixels[dstOff+2] = b;
	    dstPixels[dstOff+3] = a + alphaFac*(255-a);
	  }
	}
	return output;
};

/* Update the information of the outputCanvas with a given imageData */
var updateCanvas = function(imgData) {
	var canvas = document.getElementById("outputCanvas");
	canvas.getContext('2d').putImageData(
		imgData,
		VB.interpreter.dictionary["workingArea"].x,
		VB.interpreter.dictionary["workingArea"].y		
		);
};

var reload = function() {
	
	window.location = window.location.href.replace(/#/,'');
};

/* Ask permission to load user's webcam*/
var camLoad = function(){
	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	var video = document.querySelector('#inputVideoCam');
  	
  	navigator.getUserMedia({video: true}, function(stream) {
    	video.src = window.URL.createObjectURL(stream);
  	});
};
/* Bad practice . . .*/
camLoad();

/* Select the region to work with the blocks */
var draw = function(box, color) {
	var canvas = VB.interpreter.dictionary["canvas"];
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle="#"+color ? color : "000000";
	ctx.strokeRect(
		box.x,
		box.y,
		box.width,
		box.height);	
	
	updateCanvas(getPixels(canvas));
};

var writeText = function() {
	var canvas = VB.interpreter.dictionary["canvas"];
	var ctx = canvas.getContext('2d');
	ctx.font="30px Georgia";
    ctx.fillStyle = '#FF0000';
	ctx.fillText(this.options['text'], 30, 30);
};

/*
 * Returns the chain of block-info (Base information about a block, like name and options on popover)
 * */
var getBlockInfoChain = function() {
	var firstBlock = $(".build-area").find(" > .build-block");
	
	if (firstBlock) {
		var result = {
			name: firstBlock.data("block-name"),
			children: []
		};
		
		var fillResult = function(blockContainer, blockObj) {
			blockContainer.find(".content:first > .build-block").each(function() {
				var block = {
					name: $(this).data("block-name"),
					options: $(this).data("block-options"),
					children: []
				};
				
				blockObj.children.push(block);
				
				fillResult($(this), block);
			});
		};
		
		fillResult(firstBlock, result);
		
		return result;
	}
};

var reset = function() {
	var canvas = document.querySelector("#outputCanvas");
	var ctx = canvas.getContext('2d');
	
	// Store the current transformation matrix
	ctx.save();

	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Restore the transform
	ctx.restore();
	
	var inputVideo = document.getElementById("inputVideo");
	inputVideo.src = "";
	
	var inputVideoCam = document.getElementById("inputVideoCam");
	inputVideoCam.pause();
};

var performExecute = function() {
	reset();
	
	VB.execute();
};

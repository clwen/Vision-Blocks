/* Aux Functions */
/* Resizes, under the same ratio, a object given a max width and a max height*/
var resize = function(obj, maxWidth, maxHeight) {
	var newW, newH;
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
  		VB.defaultValues.workingArea.x,
  		VB.defaultValues.workingArea.y,
  		VB.defaultValues.workingArea.width,
  		VB.defaultValues.workingArea.height
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
		VB.defaultValues.workingArea.x,
		VB.defaultValues.workingArea.y		
		);
};

/* Adds a block at the working area */
var addBlock = function (name) {
	var block = VB.base[name];
	if ($.isFunction(block)) {
		block = block();
	}
	if (name == "loadWebcam") {
		camLoad();
	}
	VB.blocks.add(block);
};

/* Gets the first available spot on a list of blocks */
var getSpot = function (blocks) {
	if (blocks.length > 0) {
		for (var i = 0; i < blocks.length; i++) {
			if (blocks[i].y != VB.defaultValues.block.height * i + 20 + i) {
				return [VB.b_canvas.width / 2, VB.defaultValues.block.height * i + 20 + i];
			}
		}
		return [VB.b_canvas.width / 2, VB.defaultValues.block.height * blocks.length + 20 + blocks.length];
	} else {
		return [VB.b_canvas.width / 2, VB.defaultValues.block.height / 2 ];
	}
}

/* Gets all the blocks added on a given canvas*/
var getCanvasBlocks = function(canvas) {
	var blocks = canvas.children;
	var blocksOrdered = [];
		
	for (var i in blocks) {
		if (blocks[i]._block) {
			blocksOrdered[blocksOrdered.length] = blocks[i];
		}
	}
	
	blocksOrdered.sort(function(b1,b2){
		return b1.y - b2.y;
	});

	return blocksOrdered;
}

/* Organizes the blocks and append them into the LinkedList for the execution */
var execute = function () {
	var blocksOrdered = getCanvasBlocks(VB.b_canvas);
	VB.interpreter.clear();
	var lastBlock = null;
	for (var i in blocksOrdered) {
		var _block = blocksOrdered[i]._block;
		
		if (lastBlock && lastBlock instanceof vb.FlowBlock) {
			lastBlock.subStack.clear();
			lastBlock.subStack.append(_block);
		} else {
			VB.interpreter.append(_block);
		}
		lastBlock = _block;
	}
	VB.interpreter.execute();
};

var executeLoop = function () {
	execute();
	
	setInterval(function () {
		VB.interpreter.execute();
	}, 10);
};

var reload = function() {
	
	window.location = window.location.href.replace(/#/,'');
};

/* Ask permission to load user's webcam*/
var camLoad = function(){
	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	var video = document.querySelector('#inputVideo');
  	
  	navigator.getUserMedia({video: true}, function(stream) {
    	video.src = window.URL.createObjectURL(stream);
  	});
};

/* This is a try for making the layout reponsive
	It isn't finished because the layout wasn't decided.*/
var blocksCanvasLoad = function() {
	var width = $("#blocksDiv").width();
	var height = $("#blocksDiv").height();
	var blocksCanvas = document.getElementById("blocksCanvas");

	blocksCanvas.setAttribute('width', width);  
	blocksCanvas.setAttribute('height', height);
};

var wait = function() {
	//TODO
}

/* Select the region to work with the blocks */
var drawRegion = function(box) {
	var canvas = VB.interpreter.dictionary["canvas"];

	var ctx = canvas.getContext('2d');
	ctx.fillStyle="#FF0000";
	ctx.strokeRect(
		box.x,
		box.y,
		box.width,
		box.height);	
	
	updateCanvas(getPixels(canvas));
};
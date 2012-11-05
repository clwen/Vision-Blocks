var vb = {};
var VB = null;

$(document).ready(function(){
	VB = {
		interpreter : new vb.Interpreter(),
		
		defaultValues : {
			workingArea : {
				x : 0,
				y : 0,
				width: 320,
				height: 240
			}
		},

		/* Blocks declaration */
		base : {
			'loadImage' 			: function() {return new vb.Block('Load Image', loadImage, true)},
			'loadVideo' 			: function() {return new vb.Block('Load Video', loadVideo, true)},
			'loadWebcam' 			: function() {return new vb.Block('Load Webcam', loadWebcam, true)},
			'sobelFilter' 			: function() {return new vb.Block('Sobel', sobel)},
			'invertFilter' 			: function() {return new vb.Block('Invert Filter', invert)},
			'colorRearrangement'	: function() {return new vb.Block('Color Rearrangement', colorRearrangement)},
			'grayScaleFilter' 		: function() {return new vb.Block('Gray Scale', grayScale)},
			'distortionFilter' 		: function() {return new vb.Block('Distortion Filter', distortion)},
			'selectRegion' 			: function() {return new vb.Block('select Region', selectRegion)},
			'faceDetection' 		: function() {return new vb.Block('Face Detection', faceDetection, true)},
			'skinDetection' 		: function() {return new vb.Block('Skin Detection', skinDetection)},
			'intrusionDetection' 	: function() {return new vb.Block('Intrusion Detection', intrusionDetection)},
			'speedDetection' 		: function() {return new vb.Block('Speed Detection', speedDetection)},
			'ifBlock'				: function() {return new vb.ConditionalFlowBlock('If Block', ifBlock)},
			'play'					: function() {return new vb.FlowBlock('Play', play)},
			'playForever'			: function() {return new vb.FlowBlock('Play Forever', playForever)}
		},
		
		converter : function() {
			var mainBlockFake = htmlExecute();
			
			var mainBlock = VB.base[mainBlockFake.name]();
			
			var fillStack = function(blockParent, blockParentFake) {
				for (var i in blockParentFake.children) {
					var blockFake = blockParentFake.children[i];
					var blockReal = VB.base[blockFake.name]();
					
					blockReal.options = blockFake.options;
					
					blockParent.subStack.append(blockReal);
					
					if (blockReal.subStack) {
						fillStack(blockReal, blockFake);
					}
				}
			};
			
			fillStack(mainBlock, mainBlockFake);
			
			VB.interpreter.clear();
			VB.interpreter.append(mainBlock);
			VB.interpreter.execute();
		}
	};
});

var vb = {};
var VB = null;

$(document).ready(function(){
    VB = {
        interpreter : new vb.Interpreter(),

    /* Blocks declaration */
    base : {
        'loadImage' 			: function() {return new vb.Block('Load Image', loadImage, true)},
        'loadVideo' 			: function() {return new vb.Block('Load Video', loadVideo, true)},
        'loadWebcam' 			: function() {return new vb.Block('Load Webcam', loadWebcam, true)},
        'loadFoodcam' 			: function() {return new vb.Block('Load Foodcam', loadFoodcam, true)},

        'sobelFilter' 			: function() {return new vb.Block('Sobel', sobel)},
        'invertFilter' 			: function() {return new vb.Block('Invert Filter', invert)},
        'binarizeFilter'    	: function() {return new vb.Block('Binarize Filter', binarize)},
        'colorRearrangement'	: function() {return new vb.Block('Color Rearrangement', colorRearrangement)},
        'grayscaleFilter' 		: function() {return new vb.Block('Gray Scale', grayscale)},
        'distortionFilter' 		: function() {return new vb.Block('Distortion Filter', distortion)},
        'blurFilter'     		: function() {return new vb.Block('Blur Filter', bluring)},

        'drawRegions' 			: function() {return new vb.Block('Draw Regions', drawRegions)},
        'writeText' 			: function() {return new vb.Block('Write Text', writeText)},
        'browserAlert'		    : function() {return new vb.Block('Alert', browserAlert)},

        'faceDetection' 		: function() {return new vb.Block('Face Detection', faceDetection, true)},
        'skinDetection' 		: function() {return new vb.Block('Skin Detection', skinDetection)},
        'pixelization'     		: function() {return new vb.Block('Pixelization', pixelization)},
        'intrusionDetection' 	: function() {return new vb.Block('Intrusion Detection', intrusionDetection)},
        'speedDetection' 		: function() {return new vb.Block('Speed Detection', speedDetection)},

        'ifBlock'				: function() {return new vb.ConditionalFlowBlock('If Block', ifBlock)},
        'play'					: function() {return new vb.FlowBlock('Play', play)},
        'playForever'			: function() {return new vb.FlowBlock('Play Forever', playForever)}
    },

    /*
     * Get the chain of block-info, creates real blocks based on block-info and organization of the chain.
     * 
     * A block-info has;
     *  - name     : Name of real block
     *  - options  : Options on popover
     *  - children : Blocks dragged inside
     * */
    execute : function() {
        var mainBlockInfo = getBlockInfoChain();

        var mainBlock = VB.base[mainBlockInfo.name]();

        var fillStack = function(blockParent, blockParentInfo) {
            for (var i in blockParentInfo.children) {
                var blockInfo = blockParentInfo.children[i];
                var blockReal = VB.base[blockInfo.name]();

                blockReal.options = blockInfo.options;

                blockParent.subStack.append(blockReal);

                if (blockReal.subStack) {
                    fillStack(blockReal, blockInfo);
                }
            }
        };

        fillStack(mainBlock, mainBlockInfo);

        VB.interpreter.clear();
        VB.interpreter.append(mainBlock);
        VB.interpreter.execute();
    }
    };
    VB.interpreter.dictionary["workingArea"] = {
        x : 0,
        y : 0,
        width: 640,
        height: 480
    };

});

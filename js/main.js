var vb = {};
var VB = null;

$(document).ready(function(){
	/* This is a try for making the layout reponsive
		It isn't finished because the layout isn't decided.*/
	blocksCanvasLoad();

	VB = {
		interpreter : new vb.Interpreter(),

		/* Default values for Working Area and Blocks */
		defaultValues : {
			block : {
				width : 90,
				height: 40,
				gap : 1,
				flowShift: 25
			},
			workingArea : {
				x : 0,
				y : 0,
				width: 320,
				height: 240
			}
		},

		/* Blocks declaration */
		base : {
			'loadImage' 			: new vb.LoadBlock('Load Image', loadImage),
			'loadVideo' 			: new vb.LoadBlock('Load Video', loadVideo),
			'loadWebcam' 			: new vb.LoadBlock('Load Webcam', loadWebcam),
			'sobelFilter' 			: new vb.Block('Sobel', sobel),
			'invertFilter' 			: new vb.Block('Invert Filter', invert),
			'colorRearrangement'	: new vb.Block('Color Rearrangement', colorRearrangement),
			'grayScaleFilter' 		: new vb.Block('Gray Scale', grayScale),
			'distortionFilter' 		: new vb.Block('Distortion Filter', distortion),
			'selectRegion' 			: new vb.Block('select Region', selectRegion),
			'faceDetection' 		: new vb.Block('Face Detection', faceDetection),
			'ifBlock'				: new vb.FlowBlock('If Block', ifBlock),
		},
		
		/* Creation of the blocks canvas */
		b_canvas : oCanvas.create({
				canvas : '#blocksCanvas'
		}),
		
		/* Auxiliar functions for moving blocks on canvas */
		blocks : {
			/* Return the drop position for the moving block */
			getGridXY : function(obj) {
				var xw = obj.x;
				var tempy = Math.floor((obj.y) / (obj.height + VB.defaultValues.block.gap));
				var yw = tempy * obj.height;
				
				yw = yw + obj.height / 2 + VB.defaultValues.block.gap * tempy;
				
				return [xw, yw];
			},
			
			/* Add a new block into the canvas */
			add : function(block) {
				var blocks = getCanvasBlocks(VB.b_canvas);
				b_x = getSpot(blocks)[0];
				b_y = getSpot(blocks)[1];
				
				if (blocks.length > 0 && blocks[blocks.length-1]._block instanceof vb.FlowBlock) {
					b_x += VB.defaultValues.block.flowShift;
				}

				/* Setting the box */
				var drawing = VB.b_canvas.display.rectangle({
					x : b_x,
					y : b_y,
					origin: { x: "center", y: "center" },
					width : VB.defaultValues.block.width,
					height : VB.defaultValues.block.height,
					fill : '#22f'
				});

				/* Setting the name */
				var drawingText = VB.b_canvas.display.text({
					x: 0,
					y: 0,
					origin: { x: "center", y: "center" },
					align: "center",
					font: "bold 10px sans-serif",
					text: block.name,
					fill: "#fff"
				});
				
				/* adding the block */
				drawing.addChild(drawingText);

				var temporalDropArea = null;
				
				/* Drag and drop for blocks */
				drawing.dragAndDrop({
					
					/* When moving */
					move : function () {
						if (temporalDropArea == null) {
							temporalDropArea = VB.b_canvas.display.rectangle({
								x: 0,
								y: 0,
								origin: { x: "center", y: "center" },
								width: VB.defaultValues.block.width,
								height:  VB.defaultValues.block.height,
								fill: "none",
								stroke: "1px rgba(0, 0, 156, 0.15)"
							});
						}
						
						VB.b_canvas.addChild(temporalDropArea);
						var xy = VB.blocks.getGridXY(this);
						temporalDropArea.x = xy[0];
						temporalDropArea.y = xy[1];
						var blocks = getCanvasBlocks(VB.b_canvas);
						for (var i = 0; i < blocks.length; i++){
							if (blocks[i].y == xy[1]) {
								for (var j = i; j < blocks.length; j++) {
									blocks[j].y = VB.defaultValues.block.height * j + 20 + j;
								}
							} else if ( i > 0 && blocks[i-1]._block instanceof vb.FlowBlock) {
									blocks[i].x = Math.floor(VB.b_canvas.width / 2) + VB.defaultValues.block.flowShift;
									// blocks[i-1].subStack[subStack.length] = blocks[i];
							}  else {
								blocks[i].x = Math.floor(VB.b_canvas.width / 2);
							}
						}
						temporalDropArea.redraw();
					},

					/* After moving */
					end : function() {
						if (temporalDropArea != null) {
							VB.b_canvas.removeChild(temporalDropArea);
						}
						if (this.x - this.width / 2 < 0) {
							VB.b_canvas.removeChild(this);
						} else {
							var xy = VB.blocks.getGridXY(this);
							this.x = xy[0];
							this.y = xy[1];
							this.redraw();
						}
					}
				});
				
				drawing._block = block;					
				VB.b_canvas.addChild(drawing);
			}
		}
	};

});
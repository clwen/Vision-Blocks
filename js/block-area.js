$(document).ready(function() {

	VB = {
		interpreter : new vb.Interpreter(),

		/* Blocks declaration */
		base : {
			
			/* Hat Blocks */
			'play'					: new vb.HatBlock('Play', play),
			'playForever'			: new vb.HatBlock('Play Forever', playForever),
			
			/* Load Blocks */
			'loadImage' 			: new vb.LoadBlock('Load Image', loadImage),
			'loadVideo' 			: new vb.LoadBlock('Load Video', loadVideo),
			'loadWebcam' 			: new vb.LoadBlock('Load Webcam', loadWebcam),
			
			/* Filter Blocks */
			'sobelFilter' 			: new vb.Block('Sobel', sobel),
			'invertFilter' 			: new vb.Block('Invert Filter', invert),
			'colorRearrangement'	: new vb.Block('Color Rearrangement', colorRearrangement),
			'grayScaleFilter' 		: new vb.Block('Gray Scale', grayScale),
			'distortionFilter' 		: new vb.Block('Distortion Filter', distortion),
			
			/* Vision Blocks */
			'faceDetection' 		: new vb.Block('Face Detection', faceDetection),
			
			/* Flow Blocks */
			'ifBlock'				: new vb.FlowBlock('If Block', ifBlock),

			/* Auxiliary Blocks */
			'selectRegion' 			: new vb.Block('select Region', selectRegion)
		}
	};

	var refreshBlocks = function() {
		var buildArea = $(".build-area");
		
		var applyMainBlock = function(firstBlock) {
			var firstBlockContent = firstBlock.find(".content:first");
			var blocks = firstBlockContent.children().filter(".build-block");
			
			if (blocks.size() > 0) {
				var valueTopFirst = -20;
				$(blocks[0]).css({
					"top" : valueTopFirst + "px",
					"left" : "12px"
				});
				
				var heightMax = $(blocks[0]).height();
				
				for (var i = 1; i < blocks.size(); i++) {
					valueTopFirst -= 8;
					$(blocks[i]).css({
						"top" : valueTopFirst + "px",
						"left" : "12px"
					});
					heightMax += $(blocks[i]).height();
				}
				
				var height = (heightMax - (28 + 8 * (blocks.size() - 1)));
				
				firstBlockContent.height(height);
				firstBlock.find(".build-block-1-leftbar:first").height(height + 21);
			}
		}
		
		
		var blockWithContent = buildArea.find(".content").toArray().reverse();
		for (var i = 0; i < blockWithContent.length; i++) {
			applyMainBlock($(blockWithContent[i]).parents(".build-block:first"));
		}
		
		buildArea.find(".build-block-if .build-block-title-wrapper").each(function(){
			var $this = $(this);
			$this.popover({
				title: 'Options',
				content: function() {
					var html = "<div class='build-block-if-popover'>"
							html += "<div class='build-block-if-popover-top'>"
								html += "<div>Entry #1</div> <div>Condition</div> <div>Entry #2</div>"
							html += "</div>"
							html += "<div class='build-block-if-popover-bottom'>"
								html += "<div><input id='if-popover-entry-1'/></div> <div><input id='if-popover-condition'/></div> <div><input id='if-popover-entry-2'/></div>"
							html += "</div>"
					    html += "</div>"
					
					return html;
				}
			});
			$this.off("shown").on("shown", function() {
				var data = $(this).data("block-options");
				if (data) {
					$("#if-popover-entry-1").val(data['entry-1']);
					$("#if-popover-condition").val(data['condition']);
					$("#if-popover-entry-2").val(data['entry-2']);
				}
			});
			
			$this.off("hidden").on("hidden", function() {
				var data = $(this).data("block-options");
				if (!data) {
					data = {};
					$(this).data("block-options", data);
				}
				
				data['entry-1'] = $("#if-popover-entry-1").val();
				data['condition'] = $("#if-popover-condition").val();
				data['entry-2'] = $("#if-popover-entry-2").val();
				
				if (data['entry-1'] && data['condition'] && data['entry-2']) {
					$(this).find(".build-block-if-condition span").text(data['entry-1'] + " " + data['condition'] + " " + data['entry-2']);
				}
			});
		});
	};
	
	var linkToDragAndDrop = function(parent) {
		parent.find(".build-block").dragAndDrop({
			move : function(block, posX, posY) {
				var blocks = $(".build-area .build-block .build-block:not(.empty-block)").toArray();
				for (var i = 0; i < blocks.length; i++) {
					var $this = $(blocks[i]);
					var offTop = $this.offset().top;
					var diff = $this.height();
					
					var emptyBlock = $("<div class='build-block empty-block'/>")
					
					if (posY < offTop) {
						if (!$this.prev().hasClass(".build-block")) {
							$(".empty-block").remove();
							emptyBlock.height(block.height());
							if ($this.find(".content").size() > 0) {
								$this.find(".content:first").append(emptyBlock);
							} else {
								$this.before(emptyBlock);
							}
							refreshBlocks();
							break;
						}
					} else {
						if (!$this.prev().hasClass(".build-block") && i == blocks.length - 1) {
							$(".empty-block").remove();
							emptyBlock.height(block.height());
							$this.after(emptyBlock);
							refreshBlocks();
							break;
						}
					}
					
				}
			},
			end : function(block) {
				var emptyBlock = $(".build-area .empty-block");
				var buildArea = $(".build-area");
				if (buildArea.children().size() == 0) {
					buildArea.append(block);
				} else {
					if (emptyBlock.size() > 0) {
						emptyBlock.replaceWith(block);
					} else {
						buildArea.find(".content:first").append(block);
					}
					refreshBlocks();
				}
			}
		});
	};
	
	$(".block-container:not(.block-container-more)").click(function(){
		var $this = $(this);
		var blockClassActive = "block-container-active";
		$this.siblings().removeClass(blockClassActive);
		$this.toggleClass(blockClassActive);
		
		$(".block-area-options").slideUp(function() {
			if ($this.hasClass(blockClassActive)) {
				$(this).html($this.find(".block-container-content").clone().removeClass("block-container-content"));
				linkToDragAndDrop($(this));
				$(this).slideDown();
			}
		});
	});
	
});
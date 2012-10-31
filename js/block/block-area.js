$(document).ready(function() {
	
	var hidePopoverActive = function() {
		if ($(".popover.in").size() > 0) {
			var $popover = null;
			var popovers = $(".popover-enable").toArray();
			for (var idx in popovers) {
				var $p = $(popovers[idx]);
				if ($p.data("popover").tip().hasClass('in')) {
					$popover = $p;
					break;
				}
			}
			
			if ($popover) {
				$popover.popover("hide", true);
			}
		}
	};
	
	$("html").on("click", "body", function(e){
		var test = $(e.target);
		if (!test.is(".popover") && test.parents(".popover:first").size() == 0) {
			hidePopoverActive();
		}
	});
	
	$("body").on("keydown", ".enter-out-popover", function(e){
		if (e.keyCode == 13) {
			hidePopoverActive();
		}
	});
	
	$(".block-container").tooltip({placement: "right"});
	
	var measurements = {
		"build-block-border-width": parseInt($(".build-block-title-wrapper:first").css("border-left-width")) + 
		parseInt($(".build-block-title-wrapper:first").css("border-right-width")), 
	};
	measurements["build-area-gap-right"] = parseInt($(".build-area").css("padding-left")) + measurements['build-block-border-width'];
	
	var recalcWidth = function() {
		var max = 0;
		var firstBlock = $(".build-area .build-block:first");
		var mainLeft = firstBlock.offset().left;
		$(".build-area .build-block").each(function(){
			var diffLeft = ($(this).offset().left - mainLeft);
			var wid = $(this).find("*:first").width() + diffLeft;
			if (wid > max) {
				max = wid;
			}
		});
		
		$(".build-area .build-block").each(function(){
			var wid = max - ($(this).offset().left - mainLeft);
			$(this).find(".build-block-recalc-width").width(wid);
		});
		$(".build-area").width(firstBlock.find("*:first").width() + measurements["build-area-gap-right"]);
	};
	
	var addedBlock = function(block) {
		recalcWidth();
		
		block.find(".icon-remove-block").off("click").on("click", function(){
			block.trigger("block-remove");
			block.remove();
			refreshBlocks();
		});
		
		if (block.hasClass("build-block-if")) {
			block.find(".build-block-title-wrapper:first").applyPopover({
				'popover': {
					content: function() {
						var html = "<div class='build-block-if-popover'>"
								html += "<div class='build-block-if-popover-top'>"
									html += "<div>Condition</div> <div><input id='if-popover-condition' value='== 0' class='enter-out-popover'/></div>"
								html += "</div>"
								html += "<div class='build-block-if-popover-bottom'>"
									html += "<div id='if-popover-final-condition'><span></span></div>"
								html += "</div>"
						    html += "</div>"
						
						return html;
					}
				},
				'block-options': {
					'condition' : ' == 0',
					'entry': 'faces'
				},
				'shown-event': function(blockOptions) {
					if (blockOptions['condition'] != null) {
						$("#if-popover-condition").val(blockOptions['condition']);
					}
					$("#if-popover-condition").change(function(){
						var ifCondition = blockOptions['entry'] + " " + blockOptions['condition'];
						$("#if-popover-final-condition span").text(ifCondition);
						block.find(".build-block-desc:eq(0) span").text(ifCondition);
					});
					$("#if-popover-condition").change();
				},
				'hidden-event': function(blockOptions) {
					blockOptions['condition'] = $("#if-popover-condition").val();
				}
			});
		} else if (block.hasClass("build-block-select-region")) {
			block.find(".build-block-2-title-wrapper:first").applyPopover({
				'popover': {
					content: function() {
						var html = "<div class='build-block-select-region-popover'>"
								html += "<div class='build-block-select-region-popover-top'>"
									html += "<div>RGB</div> <div><input id='select-region-popover-color' maxlength='6' class='enter-out-popover'/></div>"
								html += "</div>"
						    html += "</div>"
						
						return html;
					}
				},
				'block-options': {
					'rgb' : '000000'
				},
				'shown-event': function(blockOptions) {
					$("#select-region-popover-color").val(blockOptions['rgb']);
				},
				'hidden-event': function(blockOptions) {
					blockOptions['rgb'] = $("#select-region-popover-color").val();
					
					if (blockOptions['rgb']) {
						block.find(".build-block-draw-rect-condition-rgb").css("background-color", '#'+blockOptions['rgb']);
					}
				}
			});
			
		} else if (block.hasClass("build-block-load-image")) {
			block.find(".build-block-2-title-wrapper:first").applyPopover({
				'popover': {
					content: function() {
						var html = "<div>"
								html += "<div>"
									html += "<div>URL</div> <div><input id='load-image-url' class='enter-out-popover'/></div>"
								html += "</div>"
						    html += "</div>"
						
						return html;
					}
				},
				'block-options': {
					'url' : 'file/rmc.jpg'
				},
				'shown-event': function(blockOptions) {
					$("#load-image-url").val(blockOptions['url']);
				},
				'hidden-event': function(blockOptions) {
					blockOptions['url'] = $("#load-image-url").val();
					
					if (blockOptions['url']) {
						block.find(".build-block-desc span").text(blockOptions['url']);
					}
				}
			});
		
		} else if (block.hasClass("build-block-load-video")) {
			block.find(".build-block-2-title-wrapper:first").applyPopover({
				'popover': {
					content: function() {
						var html = "<div>"
								html += "<div>"
									html += "<div>URL</div> <div><input id='load-video-url' class='enter-out-popover'/></div>"
								html += "</div>"
						    html += "</div>"
						
						return html;
					}
				},
				'block-options': {
					'url' : 'file/fox.mp4'
				},
				'shown-event': function(blockOptions) {
					$("#load-video-url").val(blockOptions['url']);
				},
				'hidden-event': function(blockOptions) {
					blockOptions['url'] = $("#load-video-url").val();
					
					if (blockOptions['url']) {
						block.find(".build-block-desc span").text(blockOptions['url']);
					}
				}
			});
			
		} else if (block.hasClass("build-block-detect-face")) {
			block.find(".build-block-2-title-wrapper:first").applyPopover({
				'popover': {
					contentFooter: function() {
						var html = "";
						html += "<div class='output_element'><span>faces</span></div>";
			    		html += "<div class='output_element'><span>faceX</span></div>";
		    			html += "<div class='output_element'><span>faceY</span></div>";
		    			html += "<div class='output_element'><span>faceW</span></div>";
		    			html += "<div class='output_element'><span>faceH</span></div>";
		    				
						return html;
					}
				},
				'shown-event': function(blockOptions) {
					$("#load-image-url").val(blockOptions['url']);
					$(".popover-footer-content > div").dragAndDrop({
						end: function(element) {
							var blockIf = $(".build-area .build-block-if:eq(0)");
							if (blockIf) {
								blockIf.data("block-options")['entry'] = element.text();
								blockIf.find(".build-block-desc:eq(0) span").text(element.text() + " " +blockIf.data("block-options")['condition']);
							}
						}
					});
				},
				'hidden-event': function(blockOptions) {
					blockOptions['url'] = $("#load-image-url").val();
				}
			});
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
	};
	
	var linkToDragAndDrop = function(parent) {
		var moveDragFitBlock = function(blockParent, block, posY) {
			var content = blockParent.find(".content:first");
			if (content.size() > 0) {
				var children = blockParent.find(".content:first > .build-block:not(.empty-block)").toArray();
				
				var emptyBlock = $("<div class='build-block empty-block'/>")
				
				if (children.length > 0) {
					for (var i = 0; i < children.length; i++) {
						var $this = $(children[i]);
						var offTop = $this.offset().top;
						var diff = $this.height();
	
						
						if (posY < offTop) {
							if ($this.prev().size() == 0 || !$this.prev().hasClass(".build-block")) {
								$(".empty-block").remove();
								emptyBlock.height(block.height());
								$this.before(emptyBlock);
								refreshBlocks();
								return;
							}
						} else if ((posY > (offTop + diff))){
							if (!$this.prev().hasClass(".build-block") && i == children.length - 1) {
								$(".empty-block").remove();
								emptyBlock.height(block.height());
								$this.after(emptyBlock);
								refreshBlocks();
								return;
							}
						} else {
							moveDragFitBlock($this, block, posY);
						}
					}
				} else {
					$(".empty-block").remove();
					content.append(emptyBlock);
				}
			}
		};
		
		parent.find(".build-block").dragAndDrop({
			move : function(block, posX, posY) {
				var blocks = $(".build-area .build-block .build-block:not(.empty-block)").toArray();
				
				moveDragFitBlock($(".build-area .build-block:eq(0)"), block, posY);
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
				addedBlock(block);
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
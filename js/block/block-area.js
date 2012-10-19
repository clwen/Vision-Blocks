$(document).ready(function() {
	
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
			var blockOptions = block.data("block-options");
			if (!blockOptions) {
				blockOptions = {};
				block.data("block-options", blockOptions);
			}
			
			block.find(".build-block-title-wrapper:first").each(function(){
				var $this = $(this);
				$this.popover({
					title: 'Values',
					content: function() {
						var html = "<div class='build-block-if-popover'>"
								html += "<div class='build-block-if-popover-top'>"
									html += "<div>Condition</div> <div><input id='if-popover-condition' value='== 0'/></div>"
								html += "</div>"
								html += "<div class='build-block-if-popover-bottom'>"
									html += "<div id='if-popover-final-condition'><span></span></div>"
								html += "</div>"
						    html += "</div>"
						
						return html;
					}
				});
				
				block.off("block-remove").on("block-remove", function(){
					$this.popover("destroy");
				});
				
				$this.off("shown").on("shown", function() {
					if (blockOptions['condition'] != null) {
						$("#if-popover-condition").val(blockOptions['condition']);
					}
					$("#if-popover-condition").change(function(){
						$("#if-popover-final-condition span").text(block.find(".build-block-if-condition").text() + " " + $("#if-popover-condition").val());
					});
					$("#if-popover-condition").change();
				});
				
				$this.off("hidden").on("hidden", function() {
					blockOptions['condition'] = $("#if-popover-condition").val();
				});
			});
		} else if (block.hasClass("build-block-select-region")) {
			block.find(".build-block-2-title-wrapper:first").each(function(){
				var $this = $(this);
				$this.popover({
					title: 'Values',
					content: function() {
						var html = "<div class='build-block-select-region-popover'>"
								html += "<div class='build-block-select-region-popover-top'>"
									html += "<div>RGB</div> <div><input id='select-region-popover-color' maxlength='6'/></div>"
								html += "</div>"
						    html += "</div>"
						
						return html;
					}
				});
				
				block.off("block-remove").on("block-remove", function(){
					$this.popover("destroy");
				});
				
				$this.off("shown").on("shown", function() {
					var data = $(this).parents(".build-block:first").data("block-options");
					if (data) {
						$("#select-region-popover-color").val(data['rgb']);
					}
				});
				
				$this.off("hidden").on("hidden", function() {
					var data = $(this).parents(".build-block:first").data("block-options");
					if (!data) {
						data = {};
						$(this).parents(".build-block:first").data("block-options", data);
					}
					
					data['rgb'] = $("#select-region-popover-color").val();
					
					if (data['rgb']) {
						$(this).find(".build-block-draw-rect-condition-rgb").css("background-color", '#'+data['rgb']);
					}
				});
				$this.parents(".build-block:first").data("block-options", {'rgb' : '000000'})
			});
		} else if (block.hasClass("build-block-load-image")) {
			block.find(".build-block-2-title-wrapper:first").each(function(){
				var $this = $(this);
				$this.popover({
					title: 'Values',
					content: function() {
						var html = "<div class='build-block-select-region-popover'>"
								html += "<div>"
									html += "<div>URL</div> <div><input id='load-image-url'/></div>"
								html += "</div>"
						    html += "</div>"
						
						return html;
					}
				});
				
				block.off("block-remove").on("block-remove", function(){
					$this.popover("destroy");
				});
				
				$this.off("shown").on("shown", function() {
					var data = $(this).parents(".build-block:first").data("block-options");
					if (data) {
						$("#load-image-url").val(data['url']);
					}
				});
				
				$this.off("hidden").on("hidden", function() {
					var data = $(this).parents(".build-block:first").data("block-options");
					if (!data) {
						data = {};
						$(this).parents(".build-block:first").data("block-options", data);
					}
					
					data['url'] = $("#load-image-url").val();
				});
			});
		} else if (block.hasClass("build-block-detect-face")) {
			block.find(".build-block-2-title-wrapper:first").each(function(){
				var $this = $(this);
				$this.popover({
					title: 'Values',
					contentFooter: function() {
						var html = "";
						html += "<div class='output_element'><span>faces</span></div>";
			    		html += "<div class='output_element'><span>faceX</span></div>";
		    			html += "<div class='output_element'><span>faceY</span></div>";
		    			html += "<div class='output_element'><span>faceW</span></div>";
		    			html += "<div class='output_element'><span>faceH</span></div>";
		    				
						return html;
					}
				});
				
				block.off("block-remove").on("block-remove", function(){
					$this.popover("destroy");
				});
				
				$this.off("shown").on("shown", function() {
					var data = $(this).parents(".build-block:first").data("block-options");
					if (data) {
						$("#load-image-url").val(data['url']);
					}
					$(".popover-footer-content > div").dragAndDrop({
						end: function(element) {
							var blockIf = $(".build-area .build-block-if");
							blockIf.find(".build-block-if-condition:eq(0) span").text(element.text());
							blockIf.data("block-options")['entry'] = element.text();
						}
					});
				});
				
				$this.off("hidden").on("hidden", function() {
					var data = $(this).parents(".build-block:first").data("block-options");
					if (!data) {
						data = {};
						$(this).parents(".build-block:first").data("block-options", data);
					}
					
					data['url'] = $("#load-image-url").val();
				});
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
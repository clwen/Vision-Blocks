$(document).ready(function() {

    /*
     * Hides visible popovers
     * */
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

    /*
     * When user clicks out a popover, visible popovers are closed
     * */
    $("html").on("click", "body", function(e){
        var test = $(e.target);
        if (!test.is(".popover") && test.parents(".popover:first").size() == 0) {
            hidePopoverActive();
        }
    });

    /*
     * When user press ENTER inside a input with class "enter-out-popover", the parent
     * popover is closed
     * */
    $("body").on("keydown", ".enter-out-popover", function(e){
        if (e.keyCode == 13) {
            hidePopoverActive();
        }
    });

    /*
     * Configures popovers to the right
     * */
    $(".block-container").tooltip({placement: "right"});

    /*
     * Stores base measurements to do the process of drag-and-drop 
     * */
    var measurements = {
        "build-block-border-width": parseInt($(".build-block-title-wrapper:first").css("border-left-width")) + 
            parseInt($(".build-block-title-wrapper:first").css("border-right-width")), 
    };
    measurements["build-area-gap-right"] = parseInt($(".build-area").css("padding-left")) + measurements['build-block-border-width'];

    /*
     * Recalcs the max width of the blocks, and adjust all of them to the same width
     * */
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

    /*
     * Function called when a block is added
     * */
    var addedBlock = function(block) {
        recalcWidth();

        block.find(".icon-remove-block").off("click").on("click", function(){
            block.trigger("block-remove");
            block.remove();
            refreshBlocks();
        });

        if (block.hasClass("build-block-load-image")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div>";
                        html += "<div>";
                        html += "<div>URL</div> <div><input id='load-image-url' name='files[]' type='file'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'hidden-event': function(blockOptions) {
                    var file = document.getElementById("load-image-url").files;
                    if (file && file.length) {
                        file = file[0];

                        blockOptions['url'] =  window.URL.createObjectURL(file);

                        if (blockOptions['url']) {
                            block.find(".build-block-desc div").text(file.name.substring(0,6));
                        }
                    }
                }
            });
        } else if (block.hasClass("build-block-load-video")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div>";
                        html += "<div>";
                        html += "<div>URL</div> <div><input type='file' id='load-video-url' name='files[]' /></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'hidden-event': function(blockOptions) {
                    var file = document.getElementById("load-video-url").files;
                    if (file && file.length) {
                        file = file[0];

                        blockOptions['url'] = window.URL.createObjectURL(file);

                        if (blockOptions['url']) {
                            block.find(".build-block-desc div").text(file.name.substring(0,6));
                        }
                    }
                }
            });
        } else if (block.hasClass("build-block-binarize")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-binarize-popover'>";
                        html += "<div class='build-block-binarize-popover-top'>";
                        html += "<div>Threshold</div> <div><input id='binarize-popover-threshold' maxlength='15' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': {
                    'binThreshold': '128'
                },
                'shown-event': function(blockOptions) {
                    $("#binarize-popover-threshold").val(blockOptions['binThreshold']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['binThreshold'] = $("#binarize-popover-threshold").val();

                }
            });
        } else if (block.hasClass("build-block-pixelization")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-pixelization-popover'>";
                        html += "<div class='build-block-pixelization-popover-top'>";
                        html += "<div>Grid size</div> <div><input id='pixelization-popover-size' maxlength='15' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': {
                    'gridSize': '10'
                },
                'shown-event': function(blockOptions) {
                    $("#pixelization-popover-size").val(blockOptions['gridSize']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['gridSize'] = $("#pixelization-popover-size").val();

                }
            });
        } else if (block.hasClass("build-block-color-detect")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-color-detect-popover'>";
                        html += "<div class='build-block-color-detect-popover-top'>";
                        html += "<div>Hue</div> <div><input id='color-detect-popover-hue' class='enter-out-popover' type='range' min='1' max='360' /></div>";
                        html += "<div>Threshold</div> <div><input id='color-detect-popover-thresh' maxlength='15' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': {
                    'hue': '50',
                    'colThreshold': '18',
                },
                'shown-event': function(blockOptions) {
                    $("#color-detect-popover-hue").val(blockOptions['hue']);
                    $("#color-detect-popover-thresh").val(blockOptions['colThreshold']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['hue'] = $("#color-detect-popover-hue").val();
                    blockOptions['colThreshold'] = $("#color-detect-popover-thresh").val();
                }
            });
        } else if (block.hasClass("build-block-blur")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-blur-popover'>";
                        html += "<div class='build-block-blur-popover-top'>";
                        html += "<div>Blur extent<br/>(1 ~ 5, the larger the blurrier)</div> <div><input id='blur-popover-size' maxlength='15' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': {
                    'blurSize': '3'
                },
                'shown-event': function(blockOptions) {
                    $("#blur-popover-size").val(blockOptions['blurSize']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['blurSize'] = $("#blur-popover-size").val();

                }
            });
        } else if (block.hasClass("build-block-detect-face")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    contentFooter: function() {
                        var html = "";
                        html += "<div class='output_element'><span>faces</span></div>";
                        html += "<div class='output_element'><span>faces_array</span></div>";
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
        } else if (block.hasClass("build-block-detect-intrusion")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content : function() {
                        var html = "<div class='build-block-detect-intrusion-popover'>";
                        html += "<div class='build-block-detect-intrusion-popover-top'>";
                        html += "<div>Start X</div> <div><input id='detect-intrusion-popover-x' maxlength='3' class='enter-out-popover'/></div>";
                        html += "<div>Start Y</div> <div><input id='detect-intrusion-popover-y' maxlength='3' class='enter-out-popover'/></div>";
                        html += "<br/>";
                        html += "<div>Width</div> <div><input id='detect-intrusion-popover-w' maxlength='3' class='enter-out-popover'/></div>";
                        html += "<div>Height</div> <div><input id='detect-intrusion-popover-h' maxlength='3' class='enter-out-popover'/></div>";
                        html += "<br/>";
                        html += "<div>Threshold</div> <div><input id='detect-intrusion-popover-thresh' maxlength='3' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";
                        return html;
                    },
                    contentFooter: function() {
                        var html = "";
                        html += "<div class='output_element'><span>intrusion</span></div>";
                        return html;
                    }
                },
                'block-options': {
                    'x': 50,
                    'y': 50,
                    'width': 100,
                    'height': 100,
                    'threshold': 10,
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
                    $("#detect-intrusion-popover-x").val(blockOptions['x']);
                    $("#detect-intrusion-popover-y").val(blockOptions['y']);
                    $("#detect-intrusion-popover-w").val(blockOptions['width']);
                    $("#detect-intrusion-popover-h").val(blockOptions['height']);
                    $("#detect-intrusion-popover-thresh").val(blockOptions['threshold']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['url'] = $("#load-image-url").val();
                    blockOptions['x'] = $("#detect-intrusion-popover-x").val();
                    blockOptions['y'] = $("#detect-intrusion-popover-y").val();
                    blockOptions['width'] = $("#detect-intrusion-popover-w").val();
                    blockOptions['height'] = $("#detect-intrusion-popover-h").val();
                    blockOptions['threshold'] = $("#detect-intrusion-popover-thresh").val();
                }
            });
        } else if (block.hasClass("build-block-if")) {
            block.find(".build-block-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-if-popover'>";
                        html += "<div class='build-block-if-popover-top'>";
                        html += "<div>Variable</div> <div><input id='if-popover-entry' value='faces' class='enter-out-popover'/></div>";
                        html += "<br/>";
                        html += "<div>Condition</div> <div><input id='if-popover-condition' value='> 0' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "<div class='build-block-if-popover-bottom'>";
                        html += "<div id='if-popover-final-condition'><span></span></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': {
                    'condition': ' > 0',
                    'entry': 'faces'
                },
                'shown-event': function(blockOptions) {
                    if (blockOptions['entry'] != null) {
                        $("#if-popover-entry").val(blockOptions['entry']);
                    }
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
                        blockOptions['entry'] = $("#if-popover-entry").val();
                    }
            });
        } else if (block.hasClass("build-block-write-text")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-write-text-popover'>";
                        html += "<div class='build-block-write-text-popover-top'>";
                        html += "<div>Text</div> <div><input id='write-text-popover-text' maxlength='15' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': {
                    'text': 'Yay!'
                },
                'shown-event': function(blockOptions) {
                    $("#write-text-popover-text").val(blockOptions['text']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['text'] = $("#write-text-popover-text").val();

                }
            });
        } else if (block.hasClass("build-block-draw-regions")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-draw-region-popover'>";
                        html += "<div class='build-block-draw-region-popover-top'>";
                        html += "<div>RGB</div> <div><input id='draw-regions-popover-color' maxlength='6' class='enter-out-popover'/></div>";
                        html += "<div>Boxes</div> <div><input id='draw-regions-popover-boxes' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': {
                    'rgb': 'FF0000',
                    'boxes': 'faces_array'
                },
                'shown-event': function(blockOptions) {
                    $("#draw-regions-popover-color").val(blockOptions['rgb']);
                    $("#draw-regions-popover-boxes").val(blockOptions['boxes']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['rgb'] = $("#draw-regions-popover-color").val();
                    blockOptions['boxes'] = $("#draw-regions-popover-boxes").val();

                    if (blockOptions['rgb']) {
                        block.find(".build-block-draw-rect-condition-rgb").css("background-color", '#'+blockOptions['rgb']);
                    }
                }
            });
        } else if (block.hasClass("build-block-os-alert")) {
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-draw-region-popover'>";
                        html += "<div class='build-block-draw-region-popover-top'>";
                        html += "<div>Title</div> <div><input id='os-alert-popover-title' maxlength='15' class='enter-out-popover'/></div>";
                        html += "<div>Msg</div> <div><input id='os-alert-popover-msg' maxlength='15' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': {
                    'notifTitle': 'Vision Blocks',
                    'notifMsg': 'Come and get some food!',
                },
                'shown-event': function(blockOptions) {
                    $("#os-alert-popover-title").val(blockOptions['notifTitle']);
                    $("#os-alert-popover-msg").val(blockOptions['notifMsg']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['notifTitle'] = $("#os-alert-popover-title").val();
                    blockOptions['notifMsg'] = $("#os-alert-popover-msg").val();
                }
            });
        }
    };

    /*
     * Function called to reorganize blocks on stack.
     * 
     * Fix - There are some magic numbers
     * */
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
            move: function(block, posX, posY) {
                var blocks = $(".build-area .build-block .build-block:not(.empty-block)").toArray();

                moveDragFitBlock($(".build-area .build-block:eq(0)"), block, posY);
            },
            end: function(block) {
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

    var canvas = $("#outputCanvas")[0];
    var ctx = canvas.getContext('2d');
    var rect = {};
    var drag = false;
    var drag_draw_btn = false;
    var type={ 'intrusion':'boolean', 'faces': 'numerical' }
     // Hides visible popovers
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

    var cvsMouseDown = function(e) {
        if (!drag_draw_btn) { return; }

        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        drag = true;
    };

    var cvsMouseUp = function(e) {
        drag = false;
        drag_draw_btn = false;

        // update x, y, w, h to popover panel
        $("#detect-motion-pop-x").val(rect.startX);
        $("#detect-motion-pop-y").val(rect.startY);
        $("#detect-motion-pop-w").val(rect.w);
        $("#detect-motion-pop-h").val(rect.h);

        //has to be done for this block as well
        $("#optical-intrusion-pop-x").val(rect.startX);
        $("#optical-intrusion-pop-y").val(rect.startY);
        $("#optical-intrusion-pop-w").val(rect.w);
        $("#optical-intrusion-pop-h").val(rect.h);
    };

    var drawRect = function() {
        ctx.strokeStyle = "#F00";
        ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
    };

    var cvsMouseMove = function(e) {
        if (drag) {
            rect.w = (e.pageX - this.offsetLeft) - rect.startX;
            rect.h = (e.pageY - this.offsetTop) - rect.startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRect();
        }
    };

    $("#outputCanvas").bind('mousedown', cvsMouseDown);
    $("#outputCanvas").bind('mouseup', cvsMouseUp);
    $("#outputCanvas").bind('mousemove', cvsMouseMove);
    $('#play-button').click(function(){performExecute()})
    $("html").on("click", "body", function(e){
        var $tgt = $(e.target);

       /* $tgt.parents().each(function() {
            if ($(this).is("#block-playForever") || $(this).is("#block-play") || $(this).is("#play-button")) {
                performExecute();
            }
        }); */

        if ($tgt.is("#drag-draw-btn")) {
            drag_draw_btn = true;
        }

         // When user clicks out a popover, visible popovers are closed
        if (!$tgt.is(".popover") && $tgt.parents(".popover:first").size() == 0) {
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
    var addedBlock = function(block, settings) {
        recalcWidth();
        block.find(".icon-remove-block").off("click").on("click", function(){
            block.trigger("block-remove");
            block.remove();
            refreshBlocks();
        });

        if (block.hasClass("build-block-remoteImage")) {

            var thisOptions={'remoteImgUrl': 'http://vblocks.media.mit.edu/files/cell.gif'}
            if (typeof settings!== 'undefined') thisOptions=settings  
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-remote-img-popover'>";
                        html += "<div class='build-block-remote-img-popover-top'>";
                        html += "<div>URL</div> <div><input id='remote-img-url' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': thisOptions,
                'shown-event': function(blockOptions) {
                    $("#remote-img-url").val(blockOptions['remoteImgUrl']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['remoteImgUrl'] = $("#remote-img-url").val();
                }
            });

        } else if (block.hasClass("build-block-loadImage")) {
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

                        blockOptions['url'] = window.URL.createObjectURL(file);

                        if (blockOptions['url']) {
                            block.find(".build-block-desc div").text(file.name.substring(0,6));
                        }
                    }
                }
            });

        } else if (block.hasClass("build-block-remoteVideo")) {
            var thisOptions={'remoteVideoUrl': 'http://vblocks.media.mit.edu/files/fox.mp4'}
            if (typeof settings!== 'undefined') thisOptions=settings  
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-remote-video-popover'>";
                        html += "<div class='build-block-remote-video-popover-top'>";
                        html += "<div>URL</div> <div><input id='remote-video-url' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': thisOptions,
                'shown-event': function(blockOptions) {
                    $("#remote-video-url").val(blockOptions['remoteVideoUrl']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['remoteVideoUrl'] = $("#remote-video-url").val();
                }
            });
        } else if (block.hasClass("build-block-loadVideo")) {
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
        } else if (block.attr("data-block-name")=='binarize') {
            var thisOptions={'binThreshold': '128'}
            if (typeof settings!== 'undefined') thisOptions=settings  
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
                'block-options': thisOptions,
                'shown-event': function(blockOptions) {
                    $("#binarize-popover-threshold").val(blockOptions['binThreshold']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['binThreshold'] = $("#binarize-popover-threshold").val();

                }
            });
        } else if (block.hasClass("build-block-pixelization")) {
            var thisOptions={
                    'gridSize': '10'
                    }
            if (typeof settings!== 'undefined') thisOptions=settings  
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
                'block-options': thisOptions,
                'shown-event': function(blockOptions) {
                    $("#pixelization-popover-size").val(blockOptions['gridSize']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['gridSize'] = $("#pixelization-popover-size").val();

                }
            });
        } else if (block.hasClass("build-block-colorDetection")) {
            var thisOptions={
                    'hue': '50',
                    'colThreshold': '18',
                }
            if (typeof settings!== 'undefined') thisOptions=settings  
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-color-detect-popover'>";
                        html += "<div class='build-block-color-detect-popover-top'>";
                        html += "<div>Hue</div> <div><input id='color-detect-popover-hue' class='enter-out-popover' type='range' min='1' max='360' /></div>";
                        html +="<div id='colorRect' style='width:207px; height:15px; background-color:hsl(120,100%,50%)'> </div>"
                        html += "<div>Threshold</div> <div><input id='color-detect-popover-thresh' maxlength='15' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': thisOptions,
                'shown-event': function(blockOptions) {
                    $("#color-detect-popover-hue").val(blockOptions['hue'])
                    $('#colorRect').css('background-color','hsl('+blockOptions.hue+',100%,50%)')
                    $("#color-detect-popover-thresh").val(blockOptions['colThreshold'])
                    $("#color-detect-popover-hue").live('change keyup focus',function(){
                        blockOptions['hue'] = $("#color-detect-popover-hue").val();
                        $('#colorRect').css('background-color','hsl('+blockOptions.hue+',100%,50%)')
                    })
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
        } else if (block.hasClass("build-block-faceDetection")) {
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
        } else if (block.hasClass("build-block-intrusionDetection")) {
            window.imageURI = [];
            // default parameters
            var thisOptions = {
                    'x': 50,
                    'y': 50,
                    'width': 100,
                    'height': 100,
                    'threshold': 10,
                };
            if (typeof settings !== 'undefined') { thisOptions=settings; }
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content : function() {
                        var html = "<div class='build-block-detect-motion-pop'>";
                        html += "<div class='build-block-detect-motion-pop-top'>";
                        html += "<span>Start X</span> <span><input id='detect-motion-pop-x' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
                        html += "<span>Start Y</span> <span><input id='detect-motion-pop-y' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
                        html += "<br/>";
                        html += "<span>Width</span> <span><input id='detect-motion-pop-w' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
                        html += "<span>Height</span> <span><input id='detect-motion-pop-h' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
                        html += "<br/>";
                        html += "<div id='drag-draw-ctn'><button id='drag-draw-btn' type='button'>Drag region</button></div>";
                        html += "<span>Threshold</span> <span><input id='detect-motion-pop-thresh' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
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
                'block-options': thisOptions,
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
                    $("#detect-motion-pop-x").val(blockOptions['x']);
                    $("#detect-motion-pop-y").val(blockOptions['y']);
                    $("#detect-motion-pop-w").val(blockOptions['width']);
                    $("#detect-motion-pop-h").val(blockOptions['height']);
                    $("#detect-motion-pop-thresh").val(blockOptions['threshold']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['url'] = $("#load-image-url").val();
                    blockOptions['x'] = $("#detect-motion-pop-x").val();
                    blockOptions['y'] = $("#detect-motion-pop-y").val();
                    blockOptions['width'] = $("#detect-motion-pop-w").val();
                    blockOptions['height'] = $("#detect-motion-pop-h").val();
                    blockOptions['threshold'] = $("#detect-motion-pop-thresh").val();
                }
            });
        } else if (block.hasClass("build-block-opticalIntrusion")) {
            $("#imageOutput").css("visibility","visible");
            window.imageURI = [];
            var thisOptions = {
                'x': 50,
                'y': 50,
                'width': 100,
                'height': 100,
                'threshold': 80
            };
            if (typeof settings !== 'undefined') { thisOptions = settings; }
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function(){
                        var html = "<div class='build-block-detect-motion-pop'>";
                        html += "<div class='build-block-optical-intrusion-pop-top'>";
                        html += "<span>Start X</span> <span><input id='optical-intrusion-pop-x' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
                        html += "<span>Start Y</span> <span><input id='optical-intrusion-pop-y' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
                        html += "<br/>";
                        html += "<span>Width</span> <span><input id='optical-intrusion-pop-w' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
                        html += "<span>Height</span> <span><input id='optical-intrusion-pop-h' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
                        html += "<br/>";
                        html += "<div id='drag-draw-ctn'><button id='drag-draw-btn' type='button'>Drag region</button></div>";
                        html += "<span>Threshold</span> <span><input id='optical-intrusion-pop-thresh' maxlength='3' class='enter-out-popover intrusion-popover-input'/></span>";
                        html += "</div>";
                        html += "</div>";
                        return html;
                    },
                    contentFooter: function(){
                        var html = "";
                        html += "<div class='output_element'><span>intrusion</span></div>";
                        return html;
                    }
                },
                'block-options': thisOptions,
                'shown-event': function(blockOptions){
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
                    $("#optical-intrusion-pop-x").val(blockOptions['x']);
                    $("#optical-intrusion-pop-y").val(blockOptions['y']);
                    $("#optical-intrusion-pop-w").val(blockOptions['width']);
                    $("#optical-intrusion-pop-h").val(blockOptions['height']);
                    $("#optical-intrusion-pop-thresh").val(blockOptions['threshold']);
                },
                'hidden-event': function(blockOptions){
                    blockOptions['url'] = $("#load-image-url").val();
                    blockOptions['x'] = $("#optical-intrusion-pop-x").val();
                    blockOptions['y'] = $("#optical-intrusion-pop-y").val();
                    blockOptions['width'] = $("#optical-intrusion-pop-w").val();
                    blockOptions['height'] = $("#optical-intrusion-pop-h").val();
                    blockOptions['threshold'] = $("#optical-intrusion-pop-thresh").val();
                }
            });
        } else if (block.hasClass("build-block-if")) {
            var dropdownNumerial='<select id="if-popover-condition-select" name="condition" style=" width:55px">'
                dropdownNumerial+='<option class="operator" value="&gt;" selected>&gt; </option>'
                dropdownNumerial+='<option  class="operator" value="&lt;">&lt; </option>'
                dropdownNumerial+='<option   class="operator" value="=" >=</option>'                       
                dropdownNumerial+='</select>'

            var dropdownBoolean='<select id="if-popover-condition-select" name="condition" style=" width:70px">'
                dropdownBoolean+='<option  class="operator" value="true" selected> true </option>'
                dropdownBoolean+='<option  class="operator" value="false"> false </option>'                       
                dropdownBoolean+='</select>'

            var input="<input id='if-popover-value' value='0' class='enter-out-popover'/></div>"
           
            var thisOptions={
                    'condition': '>',
                    'value':'0',
                    'entry': 'faces'}
            if (typeof settings!== 'undefined') thisOptions=settings  
            block.find(".build-block-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-if-popover'>";
                            html += "<div class='build-block-if-popover-top'>";
                            html += "<div>Variable</div> <div><input id='if-popover-entry' value='faces' class='enter-out-popover'/></div>";
                            html += "<br/>";
                            html += "<div>Condition</div> <span id='conditionBoolean'></span> <div>"+dropdownNumerial+"</div><div  id='numericalValue'>"+input+"</div>";
                            html += "</div>";
                            html += "<div class='build-block-if-popover-bottom'>";
                            html += "<div id='if-popover-final-condition'><span>faces >0</span></div>";
                            html += "</div>";
                            html += "</div>";

                        return html;
                    }
                },
                'block-options': thisOptions,
                'shown-event': function(blockOptions) {
                    var UpdateFinalCondition=function(){
                        var ifCondition = blockOptions['entry'] + " " + blockOptions['condition'] + " " + blockOptions['value']
                        $("#if-popover-final-condition span").text(ifCondition)
                        block.find(".build-block-desc:eq(0) span").text(ifCondition)
                    }
                    
                    var CheckType= function(){
                        if (type[blockOptions['entry']]=='boolean') {
                            $('#numericalValue').html('')
                            $('#conditionBoolean').html('is')
                            if (typeof eval(blockOptions['value'])!="boolean") {
                                blockOptions['condition']='=='
                                blockOptions['value']='true'
                            }
                            $('#if-popover-condition-select').replaceWith(dropdownBoolean)
                            $("#if-popover-condition-select").val(blockOptions['value'])

                            
                        } else {
                            $('#numericalValue').html(input)
                            $('#conditionBoolean').html('')
                            if (typeof eval(blockOptions['value'])!="number") {
                                blockOptions['condition']='>'
                                console.log('not number')
                                blockOptions['value']='0'
                            }
                            $('#if-popover-condition-select').replaceWith(dropdownNumerial)
                            $("#if-popover-condition-select").val(blockOptions['condition'])
                            console.log(blockOptions.value)
                            $("#if-popover-value").val(blockOptions['value'])
                        
                        }
                        
                        UpdateFinalCondition()  
                    }
                    CheckType()
                    if (blockOptions['entry'] != null) {
                        $("#if-popover-entry").val(blockOptions['entry']);
                    }
                    if (blockOptions['condition'] != null) {
                        if (type[blockOptions['entry']]=='boolean') {
                            $("#if-popover-condition-select").val(blockOptions['value'])
                        } else {
                            $("#if-popover-condition-select").val(blockOptions['condition'])
                            $("#if-popover-value").val(blockOptions['value'])

                        }}

                    $("#if-popover-entry").live('change keyup focus',function(){
                        blockOptions['entry'] = $("#if-popover-entry").val();
                        CheckType()
                    }) 

                    $("#if-popover-condition-select").live('change keyup focus',function(){ 
                         
                        if (type[blockOptions['entry']]=='boolean') {
                            blockOptions['condition']='=='
                            blockOptions['value']=$("#if-popover-condition-select").val()
                        } else{
                            blockOptions['condition']=$("#if-popover-condition-select").val()
                            blockOptions['value']=$("#if-popover-value").val()                            
                        }
                        UpdateFinalCondition()
                    });  

                    $("#if-popover-value").live('change keyup focus',function(){ 
                        blockOptions['value']=$("#if-popover-value").val()                            
                        UpdateFinalCondition()
                    });   
                },
                    'hidden-event': function(blockOptions) {
                        blockOptions['entry'] = $("#if-popover-entry").val()
                        if (type[blockOptions['entry']]=='boolean') {
                            blockOptions['condition']='=='
                            blockOptions['value']=$("#if-popover-condition-select").val()
                        } else{
                            blockOptions['condition']=$("#if-popover-condition-select").val()
                            blockOptions['value']=$("#if-popover-value").val()                            
                        }
                    }
            });
        } else if (block.hasClass("build-block-writeText")) {
            var thisOptions={
                    'text': 'Yay!'
                }
            if (typeof settings!== 'undefined') thisOptions=settings  
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-write-text-popover'>";
                        html += "<div class='build-block-write-text-popover-top'>";
                        html += "<div>Text</div> <div><input id='write-text-popover-text' maxlength='50' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': thisOptions,
                'shown-event': function(blockOptions) {
                    $("#write-text-popover-text").val(blockOptions['text']);
                },
                'hidden-event': function(blockOptions) {
                    blockOptions['text'] = $("#write-text-popover-text").val();

                }
            });
        } else if (block.hasClass("build-block-drawRegions")) {
            var thisOptions={
                  'rgb': 'FF0000',
                  'boxes': 'faces_array'
                }
            if (typeof settings!== 'undefined') thisOptions=settings  
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
                'block-options': thisOptions,
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
        } else if (block.hasClass("build-block-osAlert")) {
            var thisOptions={
                    'notifTitle': 'Vision Blocks',
                    'notifMsg': 'Come and get some food!',
                }
            if (typeof settings!== 'undefined') thisOptions=settings  
            block.find(".build-block-2-title-wrapper:first").applyPopover({
                'popover': {
                    content: function() {
                        var html = "<div class='build-block-draw-region-popover'>";
                        html += "<div class='build-block-draw-region-popover-top'>";
                        html += "<div>Title</div> <div><input id='os-alert-popover-title' maxlength='30' class='enter-out-popover'/></div>";
                        html += "<div>Msg</div> <div><input id='os-alert-popover-msg' maxlength='50' class='enter-out-popover'/></div>";
                        html += "</div>";
                        html += "</div>";

                        return html;
                    }
                },
                'block-options': thisOptions,
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
    }; // end of addedBlock

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
$(document).ready(function() {
    $(".block-container:not(.block-container-more, .block-container-help)").click(function(){
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

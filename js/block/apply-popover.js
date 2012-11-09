/*
 * This jQuery's plugin creates popovers on blocks. The popovers
 * receive inputs from user.
 * 
 * The parameter "options" is an object, and can has these attributes:
 * 
 * {
 * 	 "popover": Object that is used by Bootstrap's Popover function.
 *	 "shown-event": Function that is called when the popover is opened.
 *	 "hidden-event": Function that is called when the popover is closed.
 * }
 * 
 * */
$.fn.applyPopover = function(options) {
	var popoverDefault = {
		title: "Values"
	};
	
	options['popover'] = $.extend({}, popoverDefault, options['popover']);
	
	return this.each(function(){
		var $this = $(this);
		$this.addClass("popover-enable");
		$this.popover(options['popover']);
		
		var block = $this.parents(".build-block:first");
		
		var blockOptions = block.data("block-options");
		if (!blockOptions) {
			blockOptions = options['block-options'] || {};
			block.data("block-options", blockOptions);
		}
		
		block.off("block-remove").on("block-remove", function(){
			$this.popover("destroy");
		});
		
		$this.off("shown").on("shown", function() {
			$(".popover-enable").not(this).popover("hide", false);
			if (options['shown-event']) {
				options['shown-event'](blockOptions);
			}
		});
		
		$this.off("hidden").on("hidden", function() {
			if (options['hidden-event']) {
				options['hidden-event'](blockOptions);
			}
		});
	});
};
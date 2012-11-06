$.fn.dragAndDrop = function(callback) {
	return this.each(function() {
		var $this = $(this);
		var _dragElement;
		var _startX = 0;
		var _startY = 0;
		var _oldOffset = 0;
		var _dragOn = 0; 

		InitDragDrop();
		
		function InitDragDrop()
		{
			$this.on("mousedown", OnMouseDown);
		}
		
		function OnMouseDown(e)
		{
			_startX = e.clientX;
			_startY = e.clientY;
			
			// grab the clicked element's position
			_offset = $this.offset();
			
			// cancel out any text selections
			document.body.focus();
			
			dragOn = 1;
			
			_dragElement = $this.clone().addClass("drag-element").hide();
			$("body").append(_dragElement);
			
			_dragElement.on("mouseup", OnMouseUp);
			
			$(document).on("mousemove.draganddrop", OnMouseMove);
			
			// prevent text selection (except IE)
			return false;
		}
		
		function OnMouseMove(e)
		{
			if (dragOn) {
				var left = _offset.left + e.clientX - _startX;
				var top = _offset.top + e.clientY - _startY;
				_dragElement.offset({left: left, top: top});
				
				if (dragOn == 1) {
					_dragElement.show();
					dragOn++;
				}
				
				if (callback.move) {
					callback.move(_dragElement, left, top);
				}
			}
		}
		
		function OnMouseUp(e)
		{
			if (dragOn) {
				dragOn = 0;
				$(document).off(".draganddrop");
				if (callback.end) {
					callback.end(getNormalizedDragElement());
				}
			}
		}
		
		function getNormalizedDragElement() {
			var dragElement = _dragElement.remove().removeClass("drag-element");
			dragElement.get(0).style.top = '';
			dragElement.get(0).style.left = '';
			
			return dragElement; 
		}
	});
};
/* Block Skeleton */
vb.Block = function (name, action, async) {
	this.name = name;
	this.action = action;
	this.async = async;
	this.next = null;
	this.executeNext = function() {
		if (this.next) {
			this.next.execute();
		}
	};

	this.execute = function() {
		var result = action.call(this);
		if (!async) {
			this.executeNext();
		}
	}
};

vb.ConditionalFlowBlock = function (name, action) {
	this.name = name;
	this.action = action;
	this.options = null;
	this.next = null;
	this.subStack = new vb.Interpreter();

	this.execute = function() {
		if (this.options) {
			var result = action(this.options);
			if (result === true) {
				this.subStack.execute();
			}
		}
		
		switch(this.next) {
			case null:
				break;
			default:
				this.next.execute();
		}
	}
}
vb.ConditionalFlowBlock.prototype = new vb.Block();

vb.FlowBlock = function (name, action) {
	this.name = name;
	this.subStack = new vb.Interpreter();
	this.execute = function() {
		action(this.subStack);
	};
}
vb.FlowBlock.prototype = new vb.Block();

/* The interpreter uses a implementation similar to a LinkedList and
	keep the results of blocks' execution on a dictionary */
vb.Interpreter = function () {
	this.length = 0;
	this.first = null;
	this.last = null;
	this.isLoaded = false;
	
	this.dictionary = {
		"canvas" : "",
		"count": 0
	};

	/* The interpreter execute function is responsible to call the first
		block execute */
	this.execute = function() {
		var canvas = document.querySelector("#outputCanvas");
		if (this.length > 0) {
			VB.interpreter.dictionary["workingArea"].x = 0;
			VB.interpreter.dictionary["workingArea"].y = 0;
			VB.interpreter.dictionary["workingArea"].width = canvas.width;
			VB.interpreter.dictionary["workingArea"].height = canvas.height;
			this.first.execute();
		}
	};

	/* Refreshes the linked list adding a new block */
	this.append = function (block) {
		if (this.first === null) {
			this.first = block;
			this.last = block;
		} else {
			this.last.next = block;
			this.last = block;
		}
		this.length++;
	};

	/* Refreshes the linked list adding a new block in a specific position */
	this.insertAfter = function (block, newBlock) {
		newBlock.next = block.next;
		block.next = newBlock;
		if (newBlock.next === null) { last = newBlock; }
		this.length++;
	};

	/* Refreshes the linked list removing a block */
	this.remove = function(block) {
		if (this.length > 1) {
			if (first === block) {
				first = block.next;
			} else {
				var aux = first;
				while (aux.next != null) {
					if (aux.next === block) {
						aux.next = block.next;
					}
				}
			}
		} else {
			first = null;
			last = null;
		}
		block.next = null;
		this.length--;
	};

	/* Clear the linked list */
	this.clear = function() {
		this.length = 0;
		this.first = null;
		this.last = null;
	};
};

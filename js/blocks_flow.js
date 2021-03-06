var executingLoopInterval = false;

/* Organizes the blocks and append them into the LinkedList for the execution */
var play = function (stack) {
	executingLoopInterval = false;
	stack.execute();
};

var playForever = function (stack) {
	var executeLoop = function() {
		if (executingLoopInterval)  {
			stack.execute();
			setTimeout(executeLoop, 100)
		}
	}; 
	executingLoopInterval=false

	var start = function() {
		executingLoopInterval=true
		executeLoop()
	}
	setTimeout(start,102)

};
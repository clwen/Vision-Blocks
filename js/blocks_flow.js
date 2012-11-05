/* Organizes the blocks and append them into the LinkedList for the execution */
var executeLoopInterval = null;
var clearExecuteLoopInterval = function() {
	if (executeLoopInterval) {
		clearInterval(executeLoopInterval);
		executeLoopInterval = null;
	}
};

/* Organizes the blocks and append them into the LinkedList for the execution */
var play = function (stack) {
	clearExecuteLoopInterval();
	stack.execute();
};

var playForever = function (stack) {
	clearExecuteLoopInterval();
	executeLoopInterval = setInterval(function () {
		stack.execute();
	}, 500);
};
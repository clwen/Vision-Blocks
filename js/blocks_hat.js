/* Organizes the blocks and append them into the LinkedList for the execution */
var play = function () {
	VB.interpreter.execute();
};

/* Executes the play function forever */
var playForever = function () {
	play();
	
	setInterval(function () {
		VB.interpreter.execute();
	}, 10);
};
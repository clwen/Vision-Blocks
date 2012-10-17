var ifBlock = function (options) {
	var options1 = options['entry-1'].split(".");
	var options2 = options['condition'];
	var options3 = options['entry-2'];
	
	return eval("VB.interpreter.dictionary['"+options1[0]+"']."+options1[1] + " " + options2 + " " + options3);
};
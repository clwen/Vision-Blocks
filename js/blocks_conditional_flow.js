var ifBlock = function (options) {
	var options1 = options['entry']
	var options2 = options['condition']+options['value']
	if (options1 != null && options2 != null) {
		return eval("VB.interpreter.dictionary."+options1+ " " + options2)
	} else {
		return false
	}
}
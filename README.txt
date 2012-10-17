Remember starting a simple server (e.g. python -m SimpleHTTPServer) to avoid canvas security errors
-------------------
Browsers Compatibility
Chrome	->	Ok
Opera	->	Ok
Firefox	->	NOk
Safari	->	NOk
------------------
We are using object properties as "Dictionary" that may cause problems if we let user create his own keys
(like "watch", "__proto__" and others reserved words), there is a solution[1] but its perfomance is slower (?)

[1]https://github.com/sid0/jsdict
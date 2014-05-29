var net = require('net'),
	pipe = new net.Socket({ fd: 3 }),
	json = '',
	EOF = /\-\-\-$/,
	EOFLEN = 3;

pipe.on('data', function(buffer) {
	var b = buffer.toString();
	console.log('[consumer] chunk length: %d => %s', b.length, b);

    var len = buffer.length;
	if (EOF.test(b)) {
		json += b.substring(0, len - EOFLEN);
		pipe.end();
	} else {
		json += b;
	}
});

pipe.on('end', function() {
	var data = JSON.parse(json);
	console.log('[consumer] data: ' + data);
	console.log('[consumer] pipe closing');
});

pipe.on('close', function(hadError) {
	console.log('[consumer] pipe closed (%s)', hadError ? 'error' : 'success');
});


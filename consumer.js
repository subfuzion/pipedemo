var net = require('net'),
	pipe = new net.Socket({ fd: 3 }),
	data = '',
	EOF = '---',
	EOFLEN = EOF.length;

pipe.on('data', function(buffer) {
	var b = buffer.toString();
	console.log('[consumer] chunk length: %d => %s', b.length, b);

    var len = buffer.length;
	if (b.endsWith(EOF)) {
		data += b.substring(0, len - EOFLEN);
		pipe.end();
	} else {
		data += b;
	}
});

pipe.on('end', function() {
	console.log('[consumer] data: ' + data);
	console.log('[consumer] pipe closing');
});

pipe.on('close', function(hadError) {
	console.log('[consumer] pipe closed (%s)', hadError ? 'error' : 'success');
});

// won't need anymore with ecmascript 6
if (typeof String.prototype.endsWith !== 'function') {
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}

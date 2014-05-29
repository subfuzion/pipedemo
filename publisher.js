var data = require('./root'),
	json = JSON.stringify(data),
	consumer = require('child_process').spawn(
		'node',
		['consumer.js'],
		{ stdio: [process.stdin, process.stdout, process.stderr, 'pipe'] }),
	pipe = consumer.stdio[3],
	EOF = '---';


consumer.on('close', function(code) {
	console.log('[publisher] consumer exit code: %d', code);
});

pipe.on('end', function() {
	console.log('[publisher] pipe closing');
});

pipe.on('close', function(hadError) {
	console.log('[publisher] pipe closed (%s)', hadError ? 'error' : 'success');
});

// remember, you might want to manually throttle data when writing
// see: http://nodejs.org/api/net.html#net_socket_buffersize
pipe.write(JSON.stringify(json));
pipe.write(EOF);

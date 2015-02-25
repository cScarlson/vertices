
var statik = require('statik');
var config = {
	root: './src',
	port: '3001'
};

statik(config);

console.log('Running on port: %s', config.port);
console.log('Go to localhost:%s/example.html', config.port);

'use strict';

const { exec } = require('child_process');

const syntaxes = require('../lib/syntaxes');

const bundle = (command) => {
	const task = exec(command, (error, stdout, stderr) => {
		if (error) {
			console.log(error.stack);
			console.log('Error code: ' + error.code);
			console.log('Signal received: ' + error.signal);
		}
		console.log('Child Process STDOUT: ' + stdout);
		console.log('Child Process STDERR: ' + stderr);
	});

	task.on('exit', (code) => {
		console.log('Child process exited with exit code ' + code);
	});
};

Object.keys(syntaxes).forEach((syntax) => {
	const command = `node_modules/.bin/browserify lib/syntaxes/syntax-${syntax}.js --standalone syntax-${syntax} | node_modules/.bin/terser --compress --mangle -o dist/syntax-${syntax}.js`;

	bundle(command);
});

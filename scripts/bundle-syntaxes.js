'use strict';

const camelCase = require('lodash/camelCase');
const { exec } = require('child_process');

const syntaxes = require('../lib/syntaxes');

const bundle = (command) => {
	const task = exec(command, (error, stdout, stderr) => {
		if (error) {
			console.log(error.stack); // eslint-disable-line no-console
			console.log(`Error code: ${error.code}`); // eslint-disable-line no-console
			console.log(`Signal received: ${error.signal}`); // eslint-disable-line no-console
		}

		console.log(`Child Process STDOUT: ${stdout}`); // eslint-disable-line no-console
		console.log(`Child Process STDERR: ${stderr}`); // eslint-disable-line no-console
	});

	task.on('exit', (code) => {
		console.log(`Child process exited with exit code ${code}`); // eslint-disable-line no-console
	});
};

Object.keys(syntaxes).forEach((syntax) => {
	const syntaxName = camelCase(`syntax-${syntax}`);
	const command = `node_modules/.bin/browserify lib/syntaxes/syntax-${syntax}.js --standalone ${syntaxName} | node_modules/.bin/terser --compress --mangle -o dist/${syntaxName}.js`;

	bundle(command);
});

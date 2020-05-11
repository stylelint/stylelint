'use strict';

const pkg = require('../package.json');
const { exec } = require('child_process');
const targets = pkg.targets;

Object.keys(targets).forEach((target) => {
	const srcName = decamelize(target);
	let src = `lib/${srcName}.js`;

	if (target.startsWith(`syntax`)) src = `lib/syntaxes/${srcName}.js`;

	run(`node_modules/.bin/parcel build ${src} --target ${target}`);
});

function run(command) {
	const task = exec(command, (error, stdout, stderr) => {
		if (error) {
			console.log(error.stack); // eslint-disable-line no-console
			console.log(`Error code: ${error.code}`); // eslint-disable-line no-console
			console.log(`Signal received: ${error.signal}`); // eslint-disable-line no-console
		}

		console.log(stdout); // eslint-disable-line no-console

		if (stderr) console.warn(stderr); // eslint-disable-line no-console
	});

	task.on('exit', (code) => {
		console.log(`Child process exited with exit code ${code}`); // eslint-disable-line no-console
	});
}

function decamelize(str) {
	return str
		.replace(/([a-z\d])([A-Z])/g, '$1-$2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1-$2')
		.toLowerCase();
}

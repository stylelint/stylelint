'use strict';

const pkg = require('../package.json');
const replace = require('replace-in-file');
const { exec } = require('child_process');
const targets = pkg.targets;

Object.keys(targets).forEach((target) => {
	const srcName = decamelize(target);
	let src = `lib/${srcName}.js`;

	if (target.startsWith(`syntax`)) src = `lib/syntaxes/${srcName}.js`;

	run(`node_modules/.bin/parcel build ${src} --target ${target}`, pkg[target]);
});

function run(command, target) {
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
		if (code !== 0) console.log(`Bundle process exited with code ${code}`); // eslint-disable-line no-console

		console.log('target is: ', target); // eslint-disable-line no-console

		// References to require.cache don't get removed from the bundle
		// do a find and replace.
		// TODO: Remove after merging https://github.com/parcel-bundler/parcel/pull/4621
		try {
			console.log(`Replacing require.cache`); // eslint-disable-line no-console
			const results = replace.sync({
				files: target,
				from: /require.cache/g,
				to: '{}',
			});

			console.log('Replacement results:', results); // eslint-disable-line no-console
		} catch (error) {
			console.error('Error occurred during replacement:', error); // eslint-disable-line no-console
		}
	});
}

function decamelize(str) {
	return str
		.replace(/([a-z\d])([A-Z])/g, '$1-$2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1-$2')
		.toLowerCase();
}

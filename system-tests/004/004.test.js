'use strict';

const path = require('path');
const spawn = require('child_process').spawn;
const { replaceBackslashes } = require('../systemTestUtils');

// this test ensures that CLI returns exit code which is not 0
// when there is a runtime error in configuration javascript file
// https://github.com/stylelint/stylelint/issues/2115

it('004', () => {
	return new Promise((done) => {
		const localPath = replaceBackslashes(path.resolve(__dirname));
		const cliPath = path.join(localPath, '../../bin/stylelint.js');

		const cliProcess = spawn('node', [cliPath, `${localPath}/*.css`], {
			cwd: localPath,
		});

		cliProcess.on('error', (error) => {
			console.log('error running cli:', error); // eslint-disable-line no-console
		});

		let stdout = '';

		cliProcess.stdout.on('data', (data) => (stdout += data));

		cliProcess.on('close', (code) => {
			expect(stdout.includes('Cannot find module')).toBeTruthy();
			expect(code).not.toEqual(0);
			done();
		});
	});
});

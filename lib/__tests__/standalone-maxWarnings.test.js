'use strict';

const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));

it('standalone with input css and `maxWarnings`', () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		code: 'a {}',
		config,
		maxWarnings: 0,
	}).then((linted) => {
		const maxWarningsExceeded = linted.maxWarningsExceeded;

		expect(typeof maxWarningsExceeded).toBe('object');
		expect(maxWarningsExceeded.maxWarnings).toBe(0);
		expect(maxWarningsExceeded.foundWarnings).toBe(1);
	});
});

it('standalone with input file(s) and `maxWarnings`', () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		files: replaceBackslashes(path.join(fixturesPath, 'empty-block.css')),
		config,
		maxWarnings: 0,
	}).then((linted) => {
		const maxWarningsExceeded = linted.maxWarningsExceeded;

		expect(typeof maxWarningsExceeded).toBe('object');
		expect(maxWarningsExceeded.maxWarnings).toBe(0);
		expect(maxWarningsExceeded.foundWarnings).toBe(1);
	});
});

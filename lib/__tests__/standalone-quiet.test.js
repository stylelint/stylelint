'use strict';

const standalone = require('../standalone');

it('standalone with input css and quiet mode (in config)', () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': [true, { severity: 'warning' }],
		},
	};

	return standalone({ code: 'a {}', config }).then((linted) => {
		expect(linted.results[0].warnings).toEqual([]);
	});
});

it('standalone with input css and quiet mode (in option)', () => {
	const config = {
		rules: {
			'block-no-empty': [true, { severity: 'warning' }],
		},
	};

	return standalone({
		code: 'a {}',
		config,
		quiet: true,
	}).then((linted) => {
		expect(linted.results[0].warnings).toEqual([]);
	});
});

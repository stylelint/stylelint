'use strict';

const standalone = require('../standalone');

it('standalone with input css and quiet mode', () => {
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

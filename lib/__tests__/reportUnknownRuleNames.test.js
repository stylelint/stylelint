'use strict';

const standalone = require('../standalone');

it('test case (1)', () => {
	const config = {
		rules: {
			'color-hex-cas': ['upper'],
			'function-allowed-lst': ['scale'],
		},
	};

	return standalone({
		config,
		code: 'a {}',
	}).then((linted) => {
		expect(linted.results[0].warnings).toHaveLength(2);
		expect(linted.results[0].warnings).toContainEqual({
			line: 1,
			column: 1,
			severity: 'error',
			rule: 'color-hex-cas',
			text: 'Unknown rule color-hex-cas. Did you mean color-hex-case?',
		});
		expect(linted.results[0].warnings).toContainEqual({
			line: 1,
			column: 1,
			severity: 'error',
			rule: 'function-allowed-lst',
			text: 'Unknown rule function-allowed-lst. Did you mean function-allowed-list?',
		});
	});
});

it('test case (2)', () => {
	const config = {
		rules: {
			'color-hex-case': ['upper'],
			'function-allowed-lst': ['rgb'],
		},
	};

	return standalone({
		config,
		code: 'a { color: #fff; transform: scale(0.7); }',
	}).then((linted) => {
		expect(linted.results[0].warnings).toHaveLength(2);
		expect(linted.results[0].warnings).toContainEqual({
			line: 1,
			column: 1,
			severity: 'error',
			rule: 'function-allowed-lst',
			text: 'Unknown rule function-allowed-lst. Did you mean function-allowed-list?',
		});
		expect(linted.results[0].warnings).toContainEqual(
			expect.objectContaining({
				severity: 'error',
				rule: 'color-hex-case',
			}),
		);
	});
});

'use strict';

const standalone = require('../standalone');

it('test case (1)', async () => {
	const config = {
		rules: {
			'color-hex-cas': ['upper'],
			'function-allowed-lst': ['scale'],
		},
	};

	const { results } = await standalone({
		config,
		code: 'a {}',
	});

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(2);
	expect(results[0].warnings).toContainEqual({
		line: 1,
		column: 1,
		endLine: 1,
		endColumn: 2,
		severity: 'error',
		rule: 'color-hex-cas',
		text: 'Unknown rule color-hex-cas. Did you mean color-hex-case?',
	});
	expect(results[0].warnings).toContainEqual({
		line: 1,
		column: 1,
		endLine: 1,
		endColumn: 2,
		severity: 'error',
		rule: 'function-allowed-lst',
		text: 'Unknown rule function-allowed-lst. Did you mean function-allowed-list?',
	});
});

it('test case (2)', async () => {
	const config = {
		rules: {
			'color-hex-case': ['upper'],
			'function-allowed-lst': ['rgb'],
		},
	};

	const { results } = await standalone({
		config,
		code: 'a { color: #fff; transform: scale(0.7); }',
	});

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(2);
	expect(results[0].warnings).toContainEqual({
		line: 1,
		column: 1,
		endLine: 1,
		endColumn: 2,
		severity: 'error',
		rule: 'function-allowed-lst',
		text: 'Unknown rule function-allowed-lst. Did you mean function-allowed-list?',
	});
	expect(results[0].warnings).toContainEqual(
		expect.objectContaining({
			severity: 'error',
			rule: 'color-hex-case',
		}),
	);
});

'use strict';

const jsonFormatter = require('../jsonFormatter');

describe('jsonFormatter', () => {
	it('outputs corresponding json', () => {
		const resultClean = {
			source: 'path/to/file.css',
			errored: true,
			warnings: [
				{
					line: 1,
					column: 2,
					rule: 'bar',
					severity: 'error',
					text: 'Unexpected foo',
				},
			],
			deprecations: [],
			invalidOptionWarnings: [],
		};
		const results = [
			{
				...resultClean,
				_privateVaribale: [],
			},
		];

		expect(JSON.parse(jsonFormatter(results))).toEqual([resultClean]);
	});
});

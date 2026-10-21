import { describe, it } from 'node:test';

import jsonFormatter from '../jsonFormatter.mjs';

describe('jsonFormatter', () => {
	it('outputs corresponding json', (t) => {
		const resultClean = {
			source: 'path/to/file.css',
			errored: true,
			warnings: [
				{
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
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
				_privateVariable: [],
			},
		];

		t.assert.deepStrictEqual(JSON.parse(jsonFormatter(results)), [resultClean]);
	});
});

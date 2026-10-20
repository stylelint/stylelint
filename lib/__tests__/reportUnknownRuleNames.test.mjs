import assert from 'node:assert/strict';
import { it } from 'node:test';

import assertItemsPartialDeepStrictEqual from '../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import standalone from '../standalone.mjs';

it('test case (1)', async () => {
	const config = {
		rules: {
			'color-namd': ['always-where-possible'],
			'function-allowed-lst': ['scale'],
		},
	};

	const { results } = await standalone({
		config,
		code: 'a {}',
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(results[0].warnings, [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 2,
			severity: 'error',
			rule: 'color-namd',
			text: 'Unknown rule color-namd. Did you mean color-named?',
		},
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 2,
			severity: 'error',
			rule: 'function-allowed-lst',
			text: 'Unknown rule function-allowed-lst. Did you mean function-allowed-list?',
		},
	]);
});

it('test case (2)', async () => {
	const config = {
		rules: {
			'color-named': ['always-where-possible'],
			'function-allowed-lst': ['rgb'],
		},
	};

	const { results } = await standalone({
		config,
		code: 'a { color: #fff; transform: scale(0.7); }',
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].warnings.length, 2);
	assert.partialDeepStrictEqual(results[0].warnings[0], {
		line: 1,
		column: 1,
		endLine: 1,
		endColumn: 2,
		severity: 'error',
		rule: 'function-allowed-lst',
		text: 'Unknown rule function-allowed-lst. Did you mean function-allowed-list?',
	});
	assert.partialDeepStrictEqual(results[0].warnings[1], {
		severity: 'error',
		rule: 'color-named',
	});
	assert.match(results[0].warnings[1].text, /#fff/);
});

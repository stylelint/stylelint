import assert from 'node:assert/strict';
import { test } from 'node:test';

import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';

test('standalone with deprecations', async () => {
	const data = await standalone({
		code: 'a[=] {}',
		config: { rules: { 'selector-attribute-quotes': 'always' } },
	});

	assert.ok(data.report.includes('"stylelintType":"parseError"'));
	assert.equal(data.results.length, 1);
	assert.equal(data.results[0].parseErrors.length, 1);
	assert.equal(
		data.results[0].parseErrors[0].text,
		'Cannot parse selector (Error: Expected an attribute.)',
	);
});

test('file with correct syntax reported correctly', async () => {
	const data = await standalone({
		files: replaceBackslashes(
			new URL('./fixtures/broken-syntax/correct-syntax.css', import.meta.url),
		),
		config: { rules: {} },
	});

	assert.partialDeepStrictEqual(data.results[0], {
		parseErrors: [],
		errored: false,
		warnings: [],
	});
});

test('file with invalid syntax reported correctly', async () => {
	const data = await standalone({
		files: [
			replaceBackslashes(new URL('./fixtures/broken-syntax/broken-syntax.css', import.meta.url)),
		],
		config: { rules: {} },
	});

	assert.partialDeepStrictEqual(data.results[0], {
		parseErrors: [],
		errored: true,
		warnings: [
			{
				column: 1,
				line: 1,
				rule: 'CssSyntaxError',
				severity: 'error',
				text: 'Unexpected } (CssSyntaxError)',
			},
		],
	});
});

import { test } from 'node:test';

import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';

test('standalone with deprecations', async (t) => {
	const data = await standalone({
		code: 'a[=] {}',
		config: { rules: { 'selector-attribute-quotes': 'always' } },
	});

	t.assert.ok(data.report.includes('"stylelintType":"parseError"'));
	t.assert.strictEqual(data.results.length, 1);
	t.assert.strictEqual(data.results[0].parseErrors.length, 1);
	t.assert.strictEqual(
		data.results[0].parseErrors[0].text,
		'Cannot parse selector (Error: Expected an attribute.)',
	);
});

test('file with correct syntax reported correctly', async (t) => {
	const data = await standalone({
		files: replaceBackslashes(
			new URL('./fixtures/broken-syntax/correct-syntax.css', import.meta.url),
		),
		config: { rules: {} },
	});

	t.assert.partialDeepStrictEqual(data.results[0], {
		parseErrors: [],
		errored: false,
		warnings: [],
	});
});

test('file with invalid syntax reported correctly', async (t) => {
	const data = await standalone({
		files: [
			replaceBackslashes(new URL('./fixtures/broken-syntax/broken-syntax.css', import.meta.url)),
		],
		config: { rules: {} },
	});

	t.assert.partialDeepStrictEqual(data.results[0], {
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

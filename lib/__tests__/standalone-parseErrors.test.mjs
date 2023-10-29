import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';

test('standalone with deprecations', async () => {
	const data = await standalone({
		code: 'a[=] {}',
		config: { rules: { 'selector-attribute-quotes': 'always' } },
	});

	expect(data.report).toContain('"stylelintType":"parseError"');
	expect(data.results).toHaveLength(1);
	expect(data.results[0].parseErrors).toHaveLength(1);
	expect(data.results[0].parseErrors[0].text).toBe(
		'Cannot parse selector (Error: Expected an attribute.)',
	);
});

test('file with correct syntax reported correctly', async () => {
	const data = await standalone({
		files: replaceBackslashes(
			new URL('./fixtures/broken-syntax/correct-syntax.css', import.meta.url),
		),
	});

	expect(data.results[0]).toMatchObject({
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
	});

	expect(data.results[0]).toMatchObject({
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

import { createRequire } from 'node:module';
import { jest } from '@jest/globals'; // eslint-disable-line node/no-extraneous-import

import readJSONFile from '../testUtils/readJSONFile.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.js';
import standalone from '../standalone.js';

const configBlockNoEmpty = readJSONFile(
	new URL('./fixtures/config-block-no-empty.json', import.meta.url),
);

jest.mock('../rules/block-no-empty');

const require = createRequire(import.meta.url);
const blockNoEmpty = require('../rules/block-no-empty/index.js');

blockNoEmpty.mockImplementation(() => {
	return (root, result) => {
		result.warn('Some parseError', {
			stylelintType: 'parseError',
		});
	};
});

test('standalone with deprecations', async () => {
	const data = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
	});

	expect(data.output).toContain('Some parseError');
	expect(data.results).toHaveLength(1);
	expect(data.results[0].parseErrors).toHaveLength(1);
	expect(data.results[0].parseErrors[0].text).toBe('Some parseError');
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

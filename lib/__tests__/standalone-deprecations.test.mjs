import { createRequire } from 'node:module';
import readJSONFile from '../testUtils/readJSONFile.mjs';
import standalone from '../standalone.mjs';

import { jest } from '@jest/globals';

jest.mock('../rules/block-no-empty/index.cjs');

const require = createRequire(import.meta.url);
const blockNoEmpty = require('../rules/block-no-empty/index.cjs');

const configBlockNoEmpty = readJSONFile(
	new URL('./fixtures/config-block-no-empty.json', import.meta.url),
);

blockNoEmpty.mockImplementation(() => {
	return (root, result) => {
		result.warn('Some deprecation', {
			stylelintType: 'deprecation',
		});
	};
});

describe('standalone with deprecations', () => {
	it('works', async () => {
		const { output, results } = await standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
		});

		expect(output).toContain('Some deprecation');
		expect(results).toHaveLength(1);
		expect(results[0].deprecations).toHaveLength(1);
		expect(results[0].deprecations[0].text).toBe('Some deprecation');
	});

	it('never warns against a deprecated and disabled rule', async () => {
		const { results } = await standalone({
			code: 'a {}',
			config: { rules: { 'at-rule-name-newline-after': null } },
		});

		expect(results).toHaveLength(1);
		expect(results[0].deprecations).toHaveLength(0);
	});
});

describe('standalone with the `output` property deprecation', () => {
	beforeEach(() => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	it('warns when using the `output` property', async () => {
		const result = await standalone({
			code: 'a {}',
			config: { rules: {} },
		});

		// Use multiple times
		expect(result.output).toBeTruthy();
		expect(result.output).toBeTruthy();

		expect(console.warn).toHaveBeenCalledTimes(1);
		expect(console.warn).toHaveBeenCalledWith(
			'`output` is deprecated. Use `report` or `code` instead.',
		);
	});
});

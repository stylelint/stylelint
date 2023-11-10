import readJSONFile from '../testUtils/readJSONFile.mjs';
import standalone from '../standalone.mjs';

import { jest } from '@jest/globals';

jest.unstable_mockModule('../rules/block-no-empty/index.mjs', () => ({
	default() {
		return (root, result) => {
			result.warn('Some deprecation', { stylelintType: 'deprecation' });
		};
	},
}));

const configBlockNoEmpty = readJSONFile(
	new URL('./fixtures/config-block-no-empty.json', import.meta.url),
);

describe('standalone with deprecations', () => {
	it('works', async () => {
		const { report, results } = await standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
		});

		expect(report).toContain('Some deprecation');
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

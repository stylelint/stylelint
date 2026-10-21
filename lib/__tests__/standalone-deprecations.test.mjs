import { describe, it } from 'node:test';

import readJSONFile from '../testUtils/readJSONFile.mjs';
import redirectModule from '../testUtils/redirectModule.mjs';
import standalone from '../standalone.mjs';

redirectModule(
	new URL('../rules/block-no-empty/index.mjs', import.meta.url).href,
	new URL('./fixtures/rule-warn-deprecation.mjs', import.meta.url),
);

const configBlockNoEmpty = readJSONFile(
	new URL('./fixtures/config-block-no-empty.json', import.meta.url),
);

describe('standalone with deprecations', () => {
	it('works', async (t) => {
		const { report, results } = await standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
		});

		t.assert.ok(report.includes('Some deprecation'));
		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].deprecations.length, 1);
		t.assert.strictEqual(results[0].deprecations[0].text, 'Some deprecation');
	});

	it('never warns against a deprecated and disabled rule', async (t) => {
		const { results } = await standalone({
			code: 'a {}',
			config: { rules: { 'at-rule-name-newline-after': null } },
		});

		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].deprecations.length, 0);
	});
});

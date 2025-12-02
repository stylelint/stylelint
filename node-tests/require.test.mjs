import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test'; /* eslint-disable-line n/no-unsupported-features/node-builtins */

const require = createRequire(import.meta.url);

const stylelint = require('../lib/index.mjs').default;

test('require(ESM) in CommonJS plugin', async () => {
	const result = await stylelint.lint({
		code: '.foo {}',
		config: {
			plugins: [require('./fixtures/plugin-warn-about-foo.cjs')],
			rules: {
				'plugin/warn-about-foo': 'always',
				'block-no-empty': true,
			},
		},
	});
	const warnings = result.results[0].warnings;

	assert.strictEqual(warnings.length, 2);
	assert.strictEqual(warnings[0].text, 'found .foo (plugin/warn-about-foo)');
	assert.strictEqual(warnings[1].text, 'Unexpected empty block (block-no-empty)');
});

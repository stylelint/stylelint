import { expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const stylelint = require('../lib/index.mjs').default;

it('require(ESM) in CommonJS plugin', async () => {
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

	expect(warnings).toHaveLength(2);
	expect(warnings[0].text).toBe('found .foo (plugin/warn-about-foo)');
	expect(warnings[1].text).toBe('Unexpected empty block (block-no-empty)');
});

import { createRequire } from 'node:module';
import { jest } from '@jest/globals';
import report from '../utils/report.js';
import standalone from '../standalone.js';

jest.mock('../rules/block-no-empty');

const require = createRequire(import.meta.url);
const deprecatedRule = require('../rules/block-no-empty/index.js');

deprecatedRule.mockImplementation(() => {
	return (root, result) => {
		report({
			ruleName: 'block-no-empty',
			message: 'Foo bar',
			node: root,
			result,
		});
	};
});

deprecatedRule.meta = { deprecated: true };

it('standalone does not silence deprecation warnings by default', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	const { results } = await standalone({ code: 'a { color: #FFF }', config });

	expect(results[0].deprecations).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
});

it('standalone silences deprecation warnings when passed --quiet-deprecation-warnings', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	const { results } = await standalone({
		code: 'a { color: #FFF }',
		config,
		quietDeprecationWarnings: true,
	});

	expect(results[0].deprecations).toHaveLength(0);
	expect(results[0].warnings).toHaveLength(1);
});

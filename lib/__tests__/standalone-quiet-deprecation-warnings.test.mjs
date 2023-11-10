import { jest } from '@jest/globals';
import report from '../utils/report.mjs';
import standalone from '../standalone.mjs';

const deprecatedRule = () => {
	return (root, result) => {
		report({
			ruleName: 'block-no-empty',
			message: 'Foo bar',
			node: root,
			result,
		});
	};
};

deprecatedRule.meta = { deprecated: true };

jest.unstable_mockModule('../rules/block-no-empty/index.mjs', () => ({ default: deprecatedRule }));

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

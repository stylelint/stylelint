import process from 'node:process';

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

const { jest } = import.meta;

jest.unstable_mockModule('../rules/block-no-empty/index.mjs', () => ({ default: deprecatedRule }));

it('standalone does not silence deprecation warnings by default', async () => {
	const mock = jest.spyOn(process, 'emitWarning').mockImplementation(() => {});
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	const { results } = await standalone({ code: 'a { color: #FFF }', config });
	const text = 'The "block-no-empty" rule is deprecated.';

	expect(results[0].deprecations).toHaveLength(1);
	expect(results[0].deprecations[0].text).toBe(text);
	expect(results[0].warnings).toHaveLength(1);
	expect(mock).toHaveBeenCalledWith(text, {
		code: 'stylelint:006',
		detail:
			'Please be aware that the "block-no-empty" rule will soon be either removed or renamed.',
		type: 'DeprecationWarning',
	});

	mock.mockClear();
});

describe('flags', () => {
	let originalNoDeprecation;

	beforeEach(() => {
		originalNoDeprecation = process.noDeprecation;
	});

	afterEach(() => {
		process.noDeprecation = originalNoDeprecation;
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

	it('standalone silences deprecation warnings when passed --no-deprecation', async () => {
		jest.replaceProperty(process, 'noDeprecation', true);

		const config = {
			rules: {
				'block-no-empty': true,
			},
		};

		const { results } = await standalone({
			code: 'a { color: #FFF }',
			config,
		});

		expect(results[0].deprecations).toHaveLength(0);
		expect(results[0].warnings).toHaveLength(1);
	});
});

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

// TODO: This test fails only on Windows for some reason. Remove the test when CommonJS is unsupported.
const describeforCommonJS = process.platform === 'win32' ? describe.skip : describe;

describeforCommonJS('standalone CommonJS', () => {
	let standaloneCommonJS;
	let options;
	let emitWarning;

	beforeEach(async () => {
		standaloneCommonJS = (await import('../standalone.cjs')).default;
		options = {
			code: 'a {}',
			config: { rules: {} },
		};
		emitWarning = jest.spyOn(process, 'emitWarning').mockImplementation(() => {});
	});

	afterEach(() => {
		emitWarning.mockRestore();
	});

	it('warns about CommonJS API', async () => {
		await standaloneCommonJS({ ...options, quietDeprecationWarnings: false });

		expect(emitWarning).toHaveBeenCalledWith(
			'The CommonJS Node.js API is deprecated. See https://stylelint.io/migration-guide/to-16',
		);
	});

	it('suppresses the warning about CommonJS API', async () => {
		await standaloneCommonJS({ ...options, quietDeprecationWarnings: true });

		expect(emitWarning).not.toHaveBeenCalled();
	});
});

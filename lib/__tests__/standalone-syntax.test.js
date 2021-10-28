'use strict';

const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');
const stringFormatter = require('../formatters/stringFormatter');
const { promises: fs } = require('fs');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));

it('standalone with postcss-safe-parser', () => {
	// Hide “When linting something other than CSS...” warning from test
	jest.spyOn(console, 'warn').mockImplementation(() => {});

	return standalone({
		files: `${fixturesPath}/syntax_error.*`,
		config: {
			rules: {},
		},
		fix: true,
	}).then((data) => {
		const results = data.results;

		expect(results).toHaveLength(6);

		const safeParserExtensionsTest = /\.(?:css|pcss|postcss)$/i;
		const filteredResults = results.filter(
			(result) => !safeParserExtensionsTest.test(result.source),
		);

		for (const result of filteredResults) {
			expect(result.warnings).toHaveLength(1);

			const error = result.warnings[0];

			expect(error.line).toBe(1);
			expect(error.column).toBe(1);
			expect(error.rule).toBe('CssSyntaxError');
			expect(error.severity).toBe('error');
		}

		return Promise.all(
			results
				.filter((result) => safeParserExtensionsTest.test(result.source))
				.map((result) => {
					const root = result._postcssResult.root;

					expect(result.errored).toBeFalsy();
					expect(result.warnings).toHaveLength(0);
					expect(root.toString()).not.toBe(root.source.input.css);

					return fs.writeFile(root.source.input.file, root.source.input.css);
				}),
		).then(() => {
			jest.restoreAllMocks();
		});
	});
});

it('standalone with path to custom parser', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		customSyntax: `${fixturesPath}/custom-parser`,
		code: '.foo { width: 200px }\n.bar {',
		formatter: stringFormatter,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].line).toBe(2);
		expect(results[0].warnings[0].column).toBe(6);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('standalone with path to custom syntax', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		customSyntax: `${fixturesPath}/custom-syntax`,
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].line).toBe(2);
		expect(results[0].warnings[0].column).toBe(3);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('standalone with custom syntax as npm package name', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		customSyntax: 'postcss-scss',
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].line).toBe(2);
		expect(results[0].warnings[0].column).toBe(3);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('standalone with custom syntax as npm package', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		customSyntax: require('postcss-scss'),
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].line).toBe(2);
		expect(results[0].warnings[0].column).toBe(3);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('rejects on unknown custom syntax option', async () => {
	await expect(
		standalone({
			customSyntax: 'unknown-module',
			code: '',
			config: { rules: { 'block-no-empty': 'wahoo' } },
		}),
	).rejects.toThrow(
		'Cannot resolve custom syntax module "unknown-module". Check that module "unknown-module" is available and spelled correctly.',
	);
});

it('rejects on syntax option', async () => {
	await expect(
		standalone({
			syntax: 'scss',
			code: '',
			config: { rules: { 'block-no-empty': true } },
		}),
	).rejects.toThrow(
		'The "syntax" option is no longer available. You should install an appropriate syntax, e.g. postcss-scss, and use the "customSyntax" option',
	);
});

it('rejects when customSyntax and syntax are set', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	await expect(
		standalone({
			config,
			syntax: 'less',
			customSyntax: `${fixturesPath}/custom-syntax`,
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		}),
	).rejects.toThrow(
		'The "syntax" option is no longer available. You should install an appropriate syntax, e.g. postcss-scss, and use the "customSyntax" option',
	);
});

describe('customSyntax set in the config', () => {
	it('standalone with path to custom parser', () => {
		const config = {
			customSyntax: `${fixturesPath}/custom-parser`,
			rules: {
				'block-no-empty': true,
			},
		};

		return standalone({
			config,
			code: '.foo { width: 200px }\n.bar {',
			formatter: stringFormatter,
		}).then((linted) => {
			const results = linted.results;

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].line).toBe(2);
			expect(results[0].warnings[0].column).toBe(6);
			expect(results[0].warnings[0].rule).toBe('block-no-empty');
		});
	});

	it('standalone with custom syntax as npm package name', () => {
		const config = {
			customSyntax: 'postcss-scss',
			rules: {
				'block-no-empty': true,
			},
		};

		return standalone({
			config,
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		}).then((linted) => {
			const results = linted.results;

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].line).toBe(2);
			expect(results[0].warnings[0].column).toBe(3);
			expect(results[0].warnings[0].rule).toBe('block-no-empty');
		});
	});

	it('standalone with custom syntax as npm package', () => {
		const config = {
			customSyntax: require('postcss-scss'),
			rules: {
				'block-no-empty': true,
			},
		};

		return standalone({
			config,
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		}).then((linted) => {
			const results = linted.results;

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].line).toBe(2);
			expect(results[0].warnings[0].column).toBe(3);
			expect(results[0].warnings[0].rule).toBe('block-no-empty');
		});
	});

	it('standalone with path to custom syntax', () => {
		const config = {
			customSyntax: `${fixturesPath}/custom-syntax`,
			rules: {
				'block-no-empty': true,
			},
		};

		return standalone({
			config,
			code: '$foo: bar; // foo;\nb {}',
			formatter: stringFormatter,
		}).then((linted) => {
			const results = linted.results;

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].line).toBe(2);
			expect(results[0].warnings[0].column).toBe(3);
			expect(results[0].warnings[0].rule).toBe('block-no-empty');
		});
	});

	it('rejects on unknown custom syntax option', async () => {
		await expect(
			standalone({
				code: '',
				config: {
					customSyntax: 'unknown-module',
					rules: { 'block-no-empty': 'wahoo' },
				},
			}),
		).rejects.toThrow(
			'Cannot resolve custom syntax module "unknown-module". Check that module "unknown-module" is available and spelled correctly.',
		);
	});
});

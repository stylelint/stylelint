'use strict';

const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');
const stringFormatter = require('../formatters/stringFormatter');
const { promises: fs } = require('fs');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));

it('standalone with postcss-safe-parser', () => {
	return standalone({
		files: `${fixturesPath}/syntax_error.*`,
		config: {
			rules: {},
		},
		fix: true,
	}).then((data) => {
		const results = data.results;

		expect(results).toHaveLength(6);

		const safeParserExtensionsTest = /\.(css|pcss|postcss)$/i;

		results
			.filter((result) => !safeParserExtensionsTest.test(result.source))
			.forEach((result) => {
				expect(result.warnings).toHaveLength(1);

				const error = result.warnings[0];

				expect(error.line).toBe(1);
				expect(error.column).toBe(1);
				expect(error.rule).toBe('CssSyntaxError');
				expect(error.severity).toBe('error');
			});

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
		);
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

it('unknown custom syntax option', () => {
	return standalone({
		customSyntax: 'unknown-module',
		code: '',
		config: { rules: { 'block-no-empty': 'wahoo' } },
	})
		.then(() => {
			throw new Error('should not have succeeded');
		})
		.catch((err) => {
			expect(err.message).toBe(
				'Cannot resolve custom syntax module unknown-module. Check that module unknown-module is available and spelled correctly.',
			);
		});
});

it('throws on syntax option', () => {
	return standalone({
		syntax: 'scss',
		code: '',
		config: { rules: { 'block-no-empty': true } },
	})
		.then(() => {
			throw new Error('should not have succeeded');
		})
		.catch((err) => {
			expect(err.message).toBe(
				'The "syntax" (--syntax) option has been removed. Install the appropriate syntax and use the "customSyntax" (--custom-syntax) option instead',
			);
		});
});

it('throws when customSyntax and syntax are set', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		syntax: 'less',
		customSyntax: `${fixturesPath}/custom-syntax`,
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	})
		.then(() => {
			throw new Error('should not have succeeded');
		})
		.catch((err) => {
			expect(err.message).toBe(
				'The "syntax" (--syntax) option has been removed. Install the appropriate syntax and use the "customSyntax" (--custom-syntax) option instead',
			);
		});
});

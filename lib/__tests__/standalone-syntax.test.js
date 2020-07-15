'use strict';

const fs = require('fs');
const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');
const stringFormatter = require('../formatters/stringFormatter');
const stripAnsi = require('strip-ansi');
const { promisify } = require('util');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));

it('standalone with css syntax', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		code: 'a {}',
		syntax: 'css',
		formatter: stringFormatter,
	}).then((linted) => {
		const strippedOutput = stripAnsi(linted.output);

		expect(typeof linted.output).toBe('string');
		expect(strippedOutput).toContain('1:3');
		expect(strippedOutput).toContain('block-no-empty');
	});
});

it('standalone with scss syntax', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		code: '$foo: bar; // foo;\nb {}',
		syntax: 'scss',
		formatter: stringFormatter,
	}).then((linted) => {
		const strippedOutput = stripAnsi(linted.output);

		expect(typeof linted.output).toBe('string');
		expect(strippedOutput).toContain('2:3');
		expect(strippedOutput).toContain('block-no-empty');
	});
});

it('standalone with sugarss syntax', () => {
	const config = {
		rules: {
			'length-zero-no-unit': true,
		},
	};

	return standalone({
		config,
		code: '.one\n  color: black\n  top: 0px\n.two',
		syntax: 'sugarss',
		formatter: stringFormatter,
	}).then((linted) => {
		const strippedOutput = stripAnsi(linted.output);

		expect(typeof linted.output).toBe('string');
		expect(strippedOutput).toContain('3:9');
		expect(strippedOutput).toContain('length-zero-no-unit');
	});
});

it('standalone with Less syntax', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		code: '@foo: bar; // foo;\nb {}',
		syntax: 'less',
		formatter: stringFormatter,
	}).then((linted) => {
		const strippedOutput = stripAnsi(linted.output);

		expect(typeof linted.output).toBe('string');
		expect(strippedOutput).toContain('2:3');
		expect(strippedOutput).toContain('block-no-empty');
	});
});

it('standalone with postcss-html syntax', () => {
	const config = {
		rules: {
			'no-empty-source': true,
			'comment-empty-line-before': 'always',
			'rule-empty-line-before': [
				'always',
				{
					ignore: ['inside-block'],
				},
			],
			'at-rule-empty-line-before': [
				'always',
				{
					except: ['inside-block'],
				},
			],
		},
	};

	return standalone({
		config,
		customSyntax: 'postcss-html',
		files: [
			`${fixturesPath}/at-rule-empty-line-before.html`,
			`${fixturesPath}/comment-empty-line-before.html`,
			`${fixturesPath}/no-empty-source.html`,
			`${fixturesPath}/rule-empty-line-before.html`,
		],
		formatter: stringFormatter,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(4);

		const atRuleEmptyLineBeforeResult = results.find((r) =>
			/[/\\]at-rule-empty-line-before\.html$/.test(r.source),
		);

		expect(atRuleEmptyLineBeforeResult.errored).toBeFalsy();
		expect(atRuleEmptyLineBeforeResult.warnings).toHaveLength(0);

		const commentEmptyLineBeforeResult = results.find((r) =>
			/[/\\]comment-empty-line-before\.html$/.test(r.source),
		);

		expect(commentEmptyLineBeforeResult.errored).toBeFalsy();
		expect(commentEmptyLineBeforeResult.warnings).toHaveLength(0);

		const noEmptySourceResult = results.find((r) => /[/\\]no-empty-source\.html$/.test(r.source));

		expect(noEmptySourceResult.errored).toBeFalsy();
		expect(noEmptySourceResult.warnings).toHaveLength(0);

		const ruleEmptyLineBeforeResult = results.find((r) =>
			/[/\\]rule-empty-line-before\.html$/.test(r.source),
		);

		expect(ruleEmptyLineBeforeResult.errored).toBe(true);
		expect(ruleEmptyLineBeforeResult.warnings).toHaveLength(1);
		expect(ruleEmptyLineBeforeResult.warnings[0].line).toBe(8);
		expect(ruleEmptyLineBeforeResult.warnings[0].rule).toBe('rule-empty-line-before');
	});
});

describe('standalone with syntax set by extension', () => {
	it('By extension', () => {
		return standalone({
			files: `${fixturesPath}/extension-sensitive.*`,
			config: { rules: { 'color-no-invalid-hex': true } },
		}).then(({ results }) => {
			// correct number of files
			expect(results).toHaveLength(6);

			// parsed each according to its extension
			const sssResult = results.find((r) => path.extname(r.source) === '.sss');
			const lessResult = results.find((r) => path.extname(r.source) === '.less');
			const sassResult = results.find((r) => path.extname(r.source) === '.sass');
			const scssResult = results.find((r) => path.extname(r.source) === '.scss');
			const htmlResult = results.find((r) => path.extname(r.source) === '.html');
			const jsResult = results.find((r) => path.extname(r.source) === '.ts');

			expect(sssResult._postcssResult.root.source.lang).toBe('sugarss');
			expect(lessResult._postcssResult.root.source.lang).toBe('less');
			expect(sassResult._postcssResult.root.source.lang).toBe('sass');
			expect(scssResult._postcssResult.root.source.lang).toBe('scss');
			expect(htmlResult._postcssResult.root.source.lang).toBe('html');
			expect(jsResult._postcssResult.root.source.lang).toBe('jsx');

			results.forEach((result) => {
				expect(result.warnings).toHaveLength(1);
				expect(result.warnings[0].rule).toBe('color-no-invalid-hex');
			});
		});
	});

	it('By extension with config processors to a empty array', () => {
		return standalone({
			files: `${fixturesPath}/extension-sensitive.*`,
			config: {
				rules: { 'color-no-invalid-hex': true },
				processors: [],
			},
		}).then(({ results }) => {
			// parsed each according to its extension
			const sssResult = results.find((r) => path.extname(r.source) === '.sss');
			const lessResult = results.find((r) => path.extname(r.source) === '.less');
			const sassResult = results.find((r) => path.extname(r.source) === '.sass');
			const scssResult = results.find((r) => path.extname(r.source) === '.scss');

			expect(sssResult._postcssResult.root.source.lang).toBe('sugarss');
			expect(lessResult._postcssResult.root.source.lang).toBe('less');
			expect(sassResult._postcssResult.root.source.lang).toBe('sass');
			expect(scssResult._postcssResult.root.source.lang).toBe('scss');
		});
	});
});

it('standalone with automatic syntax inference', () => {
	return standalone({
		files: `${fixturesPath}/style-tag.*`,
		config: {
			rules: {
				'block-no-empty': true,
			},
		},
	}).then((data) => {
		const results = data.results;
		const htmlResult = results.find((r) => path.extname(r.source) === '.html');
		const vueResult = results.find((r) => path.extname(r.source) === '.vue');
		const mdResult = results.find((r) => path.extname(r.source) === '.markdown');

		expect(htmlResult.warnings[0].line).toBe(8);
		expect(vueResult.warnings[0].line).toBe(3);
		expect(mdResult.warnings[0].line).toBe(6);
		results.forEach((result) => {
			expect(result._postcssResult.css).toEqual(result._postcssResult.root.source.input.css);
			expect(result.warnings).toHaveLength(1);
			expect(result.warnings[0].rule).toBe('block-no-empty');
			expect(result.warnings[0].column).toBe(1);
		});
	});
});

it('standalone with js file contains html', () => {
	return standalone({
		files: `${fixturesPath}/html.js`,
		config: {
			rules: {
				'block-no-empty': true,
			},
		},
	}).then((data) => {
		expect(data.results[0].errored).toBe(false);
	});
});

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

					return promisify(fs.writeFile)(root.source.input.file, root.source.input.css);
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

it('standalone should use customSyntax when both customSyntax and syntax are set', () => {
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
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].line).toBe(2);
		expect(results[0].warnings[0].column).toBe(3);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

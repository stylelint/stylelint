'use strict';

const browser = require('../core-entrypoint');
const configBlockNoEmpty = require('./fixtures/config-block-no-empty');

const lint = browser.lint;

it('basic css input', async () => {
	const options = { code: 'a {}', config: configBlockNoEmpty };
	const linted = await lint(options);

	expect(typeof linted.output).toBe('string');
	expect(linted.results).toHaveLength(1);
	expect(linted.results[0].warnings).toHaveLength(1);
	expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
});

describe('invalid input', () => {
	it('throw on missing code', async () => {
		const options = { config: configBlockNoEmpty };
		const expectedError = new Error(
			`"options.code" is missing. You must provide a string value in "options.code".`,
		);

		await expect(lint(options)).rejects.toThrow(expectedError);
	});

	it('throw on missing config', async () => {
		const options = { code: 'a {}' };
		const expectedError = new Error(
			`"options.config" is missing. You must provide a config object in "options.config".`,
		);

		await expect(lint(options)).rejects.toThrow(expectedError);
	});

	it('throw on unsupported formatter option', async () => {
		const options = { code: 'a {}', config: configBlockNoEmpty, formatter: 'string' };
		const expectedError = new Error(
			`"options.formatter" is not supported for stylelint's browser bundle. Remove the formatter option or try the standalone version of stylelint. TODO: link here?`,
		);

		await expect(lint(options)).rejects.toThrow(expectedError);
	});

	it('throw on unsupported syntax option', async () => {
		const options = {
			code: 'a {}',
			config: configBlockNoEmpty,
			syntax: 'scss',
		};
		const expectedError = new Error(
			`"options.syntax" is not supported for stylelint's browser bundle. You must load a syntax and pass it in to "options.customSyntax". Refer to the stylelint browser bundle docs for more info. TODO: url here`,
		);

		await expect(lint(options)).rejects.toThrow(expectedError);
	});

	it('throw on unsupported config.plugins option', async () => {
		const options = {
			code: 'a {}',
			config: { ...configBlockNoEmpty, plugins: './fake-path-to-plugin' },
		};
		const expectedError = new Error(
			`"options.config.plugins" is not supported for stylelint's browser bundle. Remove the plugins from your config or try the standalone version of stylelint. TODO: url here`,
		);

		await expect(lint(options)).rejects.toThrow(expectedError);
	});

	it('throw on options.customSyntax string', async () => {
		const options = {
			code: 'a {}',
			config: configBlockNoEmpty,
			customSyntax: 'a-string',
		};
		const expectedError = new Error(
			`Provided customSyntax is invalid. You must provide an object containing 'parse' and 'stringify' methods. TODO docs link?`,
		);

		await expect(lint(options)).rejects.toThrow(expectedError);
	});

	it('throw on options.customSyntax missing expected keys', async () => {
		const options = {
			code: 'a {}',
			config: configBlockNoEmpty,
			customSyntax: { kitten: () => {}, puppy: () => {} },
		};
		const expectedError = new Error(
			`Provided customSyntax is invalid. You must provide an object containing 'parse' and 'stringify' methods. TODO docs link?`,
		);

		await expect(lint(options)).rejects.toThrow(expectedError);
	});

	it('"errored" field is set on configuration error', async () => {
		const options = {
			code: "a { color: 'red'; }",
			config: { rules: { 'block-no-empty': 'wahoo' } },
		};
		const result = await lint(options);

		expect(result.errored).toBe(true);
	});

	it('"errored" field is set on "Cannot parse selector" error', async () => {
		const options = {
			code: "data-something='true'] { }",
			config: { rules: { 'selector-type-no-unknown': true } },
		};
		const result = await lint(options);

		expect(result.errored).toBe(true);
	});
});

describe('code with syntax error', () => {
	let results;

	beforeEach(async () => {
		const res = await lint({
			code: "a { color: 'red; }",
			config: { rules: { 'block-no-empty': true } },
		});

		results = res.results;
	});

	it('<input css 1> as source', () => {
		expect(results[0].source).toBe('<input css 1>');
	});

	it('empty deprecations', () => {
		expect(results[0].deprecations).toHaveLength(0);
	});

	it('empty invalidOptionWarnings', () => {
		expect(results[0].invalidOptionWarnings).toHaveLength(0);
	});

	it('empty parseError', () => {
		expect(results[0].parseErrors).toHaveLength(0);
	});

	it('error registered', () => {
		expect(results[0].errored).toBeTruthy();
	});

	it('syntax error rule is CssSyntaxError', () => {
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].rule).toBe('CssSyntaxError');
	});

	it('syntax error severity is error', () => {
		expect(results[0].warnings[0].severity).toBe('error');
	});

	it('(CssSyntaxError) in warning text', () => {
		expect(results[0].warnings[0].text).toContain(' (CssSyntaxError)');
	});
});

it('outputs fixed code when input is code string', async () => {
	const options = {
		code: '  a { color: red; }',
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	};
	const result = await lint(options);

	expect(result.output).toBe('a { color: red; }');
});

it("doesn't fix with stylelint-disable commands", async () => {
	const code = `
	/* stylelint-disable */
	a {
		color: red;
	}
	`;

	const result = await lint({
		code,
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	});

	expect(result.output).toBe(code);
});

it('throw when parser throws', async () => {
	const options = {
		code: "a { color: 'red'; }",
		config: configBlockNoEmpty,
		customSyntax: {
			parse: () => {
				throw new Error('Custom syntax parse error');
			},
			stringify: () => {},
		},
	};
	const expectedError = new Error('Custom syntax parse error');

	await expect(lint(options)).rejects.toThrow(expectedError);
});

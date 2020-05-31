'use strict';

const configBlockNoEmpty = require('./fixtures/config-block-no-empty');
const NoFilesFoundError = require('../utils/noFilesFoundError');
const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));

describe('standalone with one input file', () => {
	let output;
	let results;

	beforeEach(() => {
		return standalone({
			files: `${fixturesPath}/empty-block.css`,
			// Path to config file
			configFile: path.join(__dirname, 'fixtures/config-block-no-empty.json'),
		}).then((data) => {
			output = data.output;
			results = data.results;
		});
	});

	it('triggers warning', () => {
		expect(output).toContain('block-no-empty');
		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

describe('standalone with two file-specific globs', () => {
	const twoCsses = [`${fixturesPath}/e*y-block.*`, `${fixturesPath}/invalid-h*.css`];

	let output;
	let results;

	beforeEach(() => {
		return standalone({
			files: twoCsses,
			config: {
				rules: { 'block-no-empty': true, 'color-no-invalid-hex': true },
			},
		}).then((data) => {
			output = data.output;
			results = data.results;
		});
	});

	it('triggers warnings', () => {
		expect(output).toContain('block-no-empty');
		expect(output).toContain('color-no-invalid-hex');
		expect(results).toHaveLength(2);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[1].warnings).toHaveLength(1);

		// Ordering of the files is non-deterministic, I believe
		if (results[0].source.includes('empty-block')) {
			expect(results[0].warnings[0].rule).toBe('block-no-empty');
			expect(results[1].warnings[0].rule).toBe('color-no-invalid-hex');
		} else {
			expect(results[1].warnings[0].rule).toBe('block-no-empty');
			expect(results[0].warnings[0].rule).toBe('color-no-invalid-hex');
		}
	});
});

describe('standalone with files and globbyOptions', () => {
	let output;
	let results;

	beforeEach(() => {
		return standalone({
			files: 'empty-block.css',
			globbyOptions: { cwd: fixturesPath },
			// Path to config file
			configFile: path.join(__dirname, 'fixtures/config-block-no-empty.json'),
		}).then((data) => {
			output = data.output;
			results = data.results;
		});
	});

	it('triggers warning', () => {
		expect(output).toContain('block-no-empty');
		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('standalone with input css', () => {
	return standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
	}).then((linted) => {
		expect(typeof linted.output).toBe('string');
		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('standalone without input css and file(s) should throw error', () => {
	const expectedError = new Error(
		'You must pass stylelint a `files` glob or a `code` string, though not both',
	);

	expect(() => standalone({ config: configBlockNoEmpty })).toThrow(expectedError);
});

it('standalone with non-existent-file throws an error', () => {
	const files = `${fixturesPath}/non-existent-file.css`;
	const expectedError = new NoFilesFoundError(files);

	return standalone({
		files,
		config: configBlockNoEmpty,
	}).catch((actualError) => {
		expect(actualError).toEqual(expectedError);
	});
});

it('standalone with non-existent-file and allowEmptyInput enabled quietly exits', () => {
	return standalone({
		files: `${fixturesPath}/non-existent-file.css`,
		config: configBlockNoEmpty,
		allowEmptyInput: true,
	}).then((linted) => {
		expect(typeof linted.output).toBe('string');
		expect(linted.results).toHaveLength(0);
		expect(linted.errored).toBe(false);
		expect(linted.output).toBe('[]');
	});
});

describe('standalone passing code with syntax error', () => {
	let results;

	beforeEach(() => {
		return standalone({
			code: "a { color: 'red; }",
			config: { rules: { 'block-no-empty': true } },
		}).then((data) => (results = data.results));
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

it('standalone passing file with syntax error', () => {
	return standalone({
		code: "a { color: 'red; }",
		codeFilename: path.join(__dirname, 'syntax-error.css'),
		config: { rules: { 'block-no-empty': true } },
	}).then((linted) => {
		expect(linted.results[0].source).toContain('syntax-error.css');
	});
});

it('syntax error sets errored to true', () => {
	return standalone({
		code: "a { color: 'red; }",
		config: { rules: { 'block-no-empty': true } },
	}).then((linted) => {
		expect(linted.errored).toBe(true);
	});
});

it('error `Cannot parse selector` sets errored to true', () => {
	return standalone({
		code: "data-something='true'] { }",
		config: { rules: { 'selector-type-no-unknown': true } },
	}).then((linted) => {
		expect(linted.errored).toBe(true);
	});
});

it('configuration error sets errored to true', () => {
	return standalone({
		code: "a { color: 'red'; }",
		config: { rules: { 'block-no-empty': 'wahoo' } },
	}).then((linted) => {
		expect(linted.errored).toBe(true);
	});
});

it('unknown syntax option', () => {
	return standalone({
		syntax: 'unknown',
		code: '',
		config: { rules: { 'block-no-empty': 'wahoo' } },
	})
		.then(() => {
			throw new Error('should not have succeeded');
		})
		.catch((err) => {
			expect(err.message).toBe(
				'You must use a valid syntax option, either: css, css-in-js, html, less, markdown, sass, scss or sugarss',
			);
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
			expect(err.message).toBe('Cannot resolve custom syntax module unknown-module');
		});
});

it('unknown formatter option', () => {
	return standalone({
		formatter: 'unknown',
		code: '',
		config: { rules: { 'block-no-empty': 'wahoo' } },
	})
		.then(() => {
			throw new Error('should not have succeeded');
		})
		.catch((err) => {
			expect(err.message.startsWith('You must use a valid formatter option')).toBe(true);
		});
});

describe('standalone with different configs per file', () => {
	let results;

	beforeEach(() => {
		return standalone({
			files: `${fixturesPath}/config-per-file/**/*.css`,
		}).then((data) => (results = data.results));
	});

	it('no warnings for A', () => {
		const resultA = results.find((result) => result.source.includes('a.css'));

		expect(resultA.warnings).toHaveLength(0);
	});

	it('one warning for B', () => {
		const resultB = results.find((result) => result.source.includes('b.css'));

		expect(resultB.warnings).toHaveLength(1);
	});

	it('correct warning for B', () => {
		const resultB = results.find((result) => result.source.includes('b.css'));

		expect(resultB.warnings[0].text).toContain('Unexpected empty block');
	});

	it('no warnings for C', () => {
		const resultC = results.find((result) => result.source.includes('c.css'));

		expect(resultC.warnings).toHaveLength(0);
	});

	it('no warnings for D', () => {
		const resultD = results.find((result) => result.source.includes('d.css'));

		expect(resultD.warnings).toHaveLength(0);
	});
});

describe('standalone with config locatable from process.cwd not file', () => {
	let actualCwd;
	let results;

	beforeAll(() => {
		actualCwd = process.cwd();
		process.chdir(path.join(__dirname, './fixtures/getConfigForFile/a/b'));
	});

	afterAll(() => {
		process.chdir(actualCwd);
	});

	beforeEach(() => {
		return standalone({
			files: [replaceBackslashes(path.join(__dirname, './fixtures/empty-block.css'))],
		}).then((data) => (results = data.results));
	});

	it('two warning', () => {
		expect(results[0].warnings).toHaveLength(2);
	});

	it("'block-no-empty' correct warning", () => {
		expect(results[0].warnings.find((warn) => warn.rule === 'block-no-empty')).toBeTruthy();
	});

	it("'plugin/warn-about-foo' correct warning", () => {
		expect(results[0].warnings.find((warn) => warn.rule === 'plugin/warn-about-foo')).toBeTruthy();
	});
});

describe('configOverrides', () => {
	it('Setting `plugins` inside `**/__tests__/**` object should override the ones set in `config` object', () => {
		return standalone({
			code: '.bar {}',
			configBasedir: __dirname,
			config: {
				plugins: [],
				rules: {
					'plugin/warn-about-bar': 'always',
				},
			},
			configOverrides: {
				plugins: ['./fixtures/plugin-warn-about-bar'],
			},
		}).then((linted) => {
			expect(linted.results[0].warnings).toHaveLength(1);
			expect(linted.results[0].warnings[0].text).toBe('found .bar (plugin/warn-about-bar)');
		});
	});

	it('Setting `extends` inside `configOverrides` object should override the ones set in `config` object', () => {
		return standalone({
			code: '.bar {}',
			configBasedir: __dirname,
			config: {
				extends: ['foo'],
			},
			configOverrides: {
				extends: ['./fixtures/config-block-no-empty'],
			},
		}).then((linted) => {
			expect(linted.results[0].warnings).toHaveLength(1);
			expect(linted.results[0].warnings[0].text).toContain('block-no-empty');
		});
	});
});

describe('nonexistent codeFilename with loaded config', () => {
	let actualCwd;

	beforeAll(() => {
		actualCwd = process.cwd();
		process.chdir(path.join(__dirname, './fixtures/getConfigForFile/a/b'));
	});

	afterAll(() => {
		process.chdir(actualCwd);
	});

	it('does not cause error', () => {
		return expect(() =>
			standalone({
				code: 'a {}',
				codeFilename: 'does-not-exist.css',
			}),
		).not.toThrow();
	});

	it('does load config from process.cwd', () => {
		return standalone({
			code: 'a {}',
			codeFilename: 'does-not-exist.css',
		}).then((linted) => {
			expect(linted.results[0].warnings).toHaveLength(1);
		});
	});
});

describe('existing codeFilename for nested config detection', () => {
	let actualCwd;

	beforeAll(() => {
		actualCwd = process.cwd();
		process.chdir(path.join(__dirname, './fixtures/getConfigForFile'));
	});

	afterAll(() => {
		process.chdir(actualCwd);
	});

	it('loads config from a nested directory', () => {
		return standalone({
			code: 'a {}',
			codeFilename: 'a/b/foo.css',
		}).then((linted) => {
			expect(linted.results[0].warnings).toHaveLength(1);
		});
	});
});

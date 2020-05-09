'use strict';

const _ = require('lodash');
const del = require('del');
const os = require('os');
const path = require('path');
const stripIndent = require('common-tags').stripIndent;
const { promises: fs } = require('fs'); // eslint-disable-line node/no-unsupported-features/node-builtins

const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));

it('outputs fixed code when input is code string', () => {
	return standalone({
		code: '  a { color: red; }',
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe('a { color: red; }');
	});
});

it('does not modify shorthand object syntax when autofixing', () => {
	const codeString = `const width = '100px'; const x = <div style={{width}}>Hi</div>`;

	return standalone({
		code: codeString,
		syntax: 'css-in-js',
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(codeString);
	});
});

it('apply indentation autofix at last', () => {
	return standalone({
		code:
			'a {\nbox-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.2), inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);\n}',
		config: {
			rules: {
				indentation: 2,
				'value-list-comma-newline-after': 'always',
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(
			'a {\n  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1),\n    0 0 0 1px rgba(0, 0, 0, 0.2),\n    inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);\n}',
		);
	});
});

it("doesn't fix with stylelint-disable commands", () => {
	const code = `
	/* stylelint-disable */
	a {
		color: red;
	}
	`;

	return standalone({
		code,
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(code);
	});
});

it("doesn't fix with scoped stylelint-disable commands", () => {
	const code = `
	/* stylelint-disable indentation */
	a {
		color: red;
	}
	`;

	return standalone({
		code,
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(code);
	});
});

it("doesn't fix with multiple scoped stylelint-disable commands", () => {
	const code = `
	/* stylelint-disable indentation, color-hex-length */
	a {
		color: #ffffff;
	}
	`;

	return standalone({
		code,
		config: {
			rules: {
				indentation: 2,
				'color-hex-length': 'short',
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(code);
	});
});

it("the color-hex-length rule doesn't fix with scoped stylelint-disable commands", () => {
	return standalone({
		code: stripIndent`
				/* stylelint-disable color-hex-length */
				a {
				color: #ffffff;
				}
				`,
		config: {
			rules: {
				indentation: 2,
				'color-hex-length': 'short',
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(stripIndent`
				/* stylelint-disable color-hex-length */
				a {
				  color: #ffffff;
				}
				`);
	});
});

it("the indentation rule doesn't fix with scoped stylelint-disable commands", () => {
	return standalone({
		code: stripIndent`
				/* stylelint-disable indentation */
				a {
				color: #ffffff;
				}
				`,
		config: {
			rules: {
				indentation: 2,
				'color-hex-length': 'short',
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(stripIndent`
				/* stylelint-disable indentation */
				a {
				color: #fff;
				}
				`);
	});
});

describe('writing fixes to files', () => {
	let tmpDir;
	let tempFile;

	beforeEach(() => {
		tmpDir = os.tmpdir();
		tempFile = replaceBackslashes(path.join(tmpDir, `stylesheet-${_.uniqueId()}.css`));

		return fs.copyFile(`${fixturesPath}/fix.css`, tempFile);
	});

	afterEach(() => {
		return del(tempFile, { force: true });
	});

	it('overwrites the original file', () => {
		return standalone({
			files: [tempFile],
			config: {
				rules: {
					'at-rule-name-case': 'lower',
					'comment-empty-line-before': 'always',
					'comment-no-empty': true,
				},
			},
			fix: true,
		}).then((output) => {
			const result = output.results[0]._postcssResult;

			return fs.readFile(tempFile, 'utf8').then((fileContent) => {
				expect(fileContent).toBe(result.root.toString(result.opts.syntax));
			});
		});
	});

	it("doesn't write to ignored file", () => {
		return standalone({
			files: [tempFile],
			config: {
				ignoreFiles: tempFile,
				rules: {
					'at-rule-name-case': 'lower',
					'comment-empty-line-before': 'always',
					'comment-no-empty': true,
				},
			},
			fix: true,
		}).then(() => {
			return fs.readFile(tempFile, 'utf8').then((newFile) => {
				return fs.readFile(`${fixturesPath}/fix.css`, 'utf8').then((oldFile) => {
					expect(newFile).toBe(oldFile);
				});
			});
		});
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip("doesn't strip BOM", () => {
		return standalone({
			files: [tempFile],
			config: {
				rules: {
					'at-rule-name-case': 'lower',
					'comment-empty-line-before': 'always',
					'comment-no-empty': true,
				},
			},
			fix: true,
		}).then(() => {
			return fs.readFile(tempFile, 'utf8').then((fileContent) => {
				expect(fileContent.startsWith('\uFEFF')).toBe(true);
			});
		});
	});
});

'use strict';

const _ = require('lodash');
const cpFile = require('cp-file');
const del = require('del');
const fs = require('fs');
const os = require('os');
const path = require('path');
const stylelint = require('../../lib');
const systemTestUtils = require('../systemTestUtils');
const { promisify } = require('util');
const { replaceBackslashes } = require("../systemTestUtils");
const readFileAsync = promisify(fs.readFile);

describe('fix', () => {
	let tmpDir;
	let stylesheetPath;

	beforeEach(() => {
		tmpDir = os.tmpdir();
		stylesheetPath = replaceBackslashes(
      path.join(tmpDir, `stylesheet-${_.uniqueId()}.css`)
    );

		return cpFile(path.join(__dirname, 'stylesheet.css'), stylesheetPath);
	});

	afterEach(() => {
		return del(stylesheetPath, { force: true });
	});

	it('expected stylelint results', () => {
		return stylelint
			.lint({
				files: [stylesheetPath],
				configFile: systemTestUtils.caseConfig('fix'),
				fix: true,
			})
			.then((output) => {
				// Remove the path to tmpDir
				const cleanedResults = output.results.map((r) =>
					Object.assign({}, r, { source: 'stylesheet.css' }),
				);

				expect(systemTestUtils.prepResults(cleanedResults)).toMatchSnapshot();
			});
	});

	it('expected fixes to PostCSS Result', () => {
		return stylelint
			.lint({
				files: [stylesheetPath],
				configFile: systemTestUtils.caseConfig('fix'),
				fix: true,
			})
			.then((output) => {
				const result = output.results[0]._postcssResult;

				expect(result.root.toString(result.opts.syntax)).toMatchSnapshot();
			});
	});

	it('overwrites the original file', () => {
		return stylelint
			.lint({
				files: [stylesheetPath],
				configFile: systemTestUtils.caseConfig('fix'),
				fix: true,
			})
			.then((output) => {
				const result = output.results[0]._postcssResult;

				return readFileAsync(stylesheetPath, 'utf8').then((fileContent) => {
					expect(fileContent).toBe(result.root.toString(result.opts.syntax));
				});
			});
	});

	it("doesn't write to ignored file", () => {
		return stylelint
			.lint({
				files: [stylesheetPath],
				config: {
					ignoreFiles: stylesheetPath,
					rules: {
						'at-rule-name-case': 'lower',
						'comment-empty-line-before': 'always',
						'comment-no-empty': true,
					},
				},
				fix: true,
			})
			.then(() => {
				return readFileAsync(stylesheetPath, 'utf8').then((newFile) => {
					return readFileAsync(path.join(__dirname, 'stylesheet.css'), 'utf8').then((oldFile) => {
						expect(newFile).toBe(oldFile);
					});
				});
			});
	});

	it('outputs fixed code when input is code string', () => {
		return stylelint
			.lint({
				code: '  a { color: red; }',
				config: {
					rules: {
						indentation: 2,
					},
				},
				fix: true,
			})
			.then((result) => {
				expect(result.output).toBe('a { color: red; }');
			});
	});

	it('apply indentation autofix at last', () => {
		return stylelint
			.lint({
				code:
					'a {\nbox-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.2), inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);\n}',
				config: {
					rules: {
						indentation: 2,
						'value-list-comma-newline-after': 'always',
					},
				},
				fix: true,
			})
			.then((result) => {
				expect(result.output).toBe(
					'a {\n  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1),\n    0 0 0 1px rgba(0, 0, 0, 0.2),\n    inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);\n}',
				);
			});
	});
});

describe('fix with BOM', () => {
	let tmpDir;
	let stylesheetPath;

	beforeEach(() => {
		tmpDir = os.tmpdir();
		stylesheetPath = replaceBackslashes(
      path.join(tmpDir, `stylesheet-with-bom.css`)
    );

		return cpFile(path.join(__dirname, 'stylesheet.css'), stylesheetPath);
	});

	afterEach(() => {
		return del(stylesheetPath, { force: true });
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip("doesn't strip BOM", () => {
		return stylelint
			.lint({
				files: [stylesheetPath],
				configFile: systemTestUtils.caseConfig('fix'),
				fix: true,
			})
			.then(() => {
				return readFileAsync(stylesheetPath, 'utf8').then((fileContent) => {
					expect(fileContent.startsWith('\uFEFF')).toBe(true);
				});
			});
	});
});

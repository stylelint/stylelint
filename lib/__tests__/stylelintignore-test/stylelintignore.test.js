'use strict';

const path = require('path');
const replaceBackslashes = require('../../testUtils/replaceBackslashes');
const standalone = require('../../standalone');

describe('stylelintignore', () => {
	let actualCwd;
	let results;
	const fixturesPath = path.join(__dirname, './fixtures');

	beforeEach(() => {
		actualCwd = process.cwd();
		process.chdir(__dirname);
	});

	afterEach(() => {
		process.chdir(actualCwd);
	});

	describe('standalone with .stylelintignore file ignoring one file', () => {
		beforeEach(() => {
			return standalone({
				files: [
					replaceBackslashes(`${fixturesPath}/empty-block.css`),
					replaceBackslashes(`${fixturesPath}/invalid-hex.css`),
				],
				config: {
					extends: [
						`${fixturesPath}/config-block-no-empty`,
						`${fixturesPath}/config-color-no-invalid-hex`,
					],
				},
			}).then((data) => (results = data.results));
		});

		it('one file read', () => {
			expect(results).toHaveLength(1);
		});

		it('empty-block.css not read', () => {
			expect(/empty-block\.css/.test(results[0].source)).toBe(false);
		});

		it('color-no-invalid-hex.css read', () => {
			expect(/invalid-hex\.css/.test(results[0].source)).toBe(true);
		});

		it('color-no-invalid-hex.css linted', () => {
			expect(results[0].warnings).toHaveLength(1);
		});
	});

	describe('standalone with .stylelintignore file ignoring codeFilename', () => {
		it('ignored file is ignored', () => {
			return standalone({
				code: '.bar {}',
				codeFilename: `${fixturesPath}/empty-block.css`,
				ignorePath: path.join(__dirname, '.stylelintignore'),
				config: {
					extends: `${fixturesPath}/config-block-no-empty`,
				},
			}).then((data) => {
				expect(data).toEqual({
					errored: false,
					output: '[]',
					results: [],
				});
			});
		});

		it('not ignored file is linted', () => {
			return standalone({
				code: '.bar {}',
				codeFilename: `${fixturesPath}/empty-block.css`,
				ignorePath: path.join(__dirname, '.stylelintignore-empty'),
				config: {
					extends: `${fixturesPath}/config-block-no-empty`,
				},
			}).then((data) => {
				expect(data).toMatchObject({
					errored: true,
					output: expect.stringContaining('Unexpected empty block (block-no-empty)'),
					results: expect.any(Array),
				});
			});
		});

		it('ignored file with syntax error is ignored', () => {
			return standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: path.join(__dirname, '.stylelintignore2'),
				config: {
					extends: `${fixturesPath}/config-block-no-empty`,
				},
			}).then((data) => {
				expect(data).toEqual({
					errored: false,
					output: '[]',
					results: [],
				});
			});
		});

		it('ignored file with syntax error is ignored and there is no config', () => {
			return standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: path.join(__dirname, '.stylelintignore2'),
			}).then((data) => {
				expect(data).toEqual({
					errored: false,
					output: '[]',
					results: [],
				});
			});
		});
	});
});

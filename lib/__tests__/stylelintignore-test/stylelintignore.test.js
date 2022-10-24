'use strict';

const path = require('path');
const replaceBackslashes = require('../../testUtils/replaceBackslashes');
const safeChdir = require('../../testUtils/safeChdir');
const standalone = require('../../standalone');

describe('stylelintignore', () => {
	safeChdir(__dirname);

	let results;
	const fixturesPath = path.join(__dirname, './fixtures');

	describe('standalone with .stylelintignore file ignoring one file', () => {
		beforeEach(async () => {
			const data = await standalone({
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
			});

			results = data.results;
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
		it('ignored file is ignored', async () => {
			const data = await standalone({
				code: '.bar {}',
				codeFilename: `${fixturesPath}/empty-block.css`,
				ignorePath: [path.join(__dirname, '.stylelintignore')],
				config: {
					extends: `${fixturesPath}/config-block-no-empty`,
				},
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				output: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});

		it('not ignored file is linted', async () => {
			const data = await standalone({
				code: '.bar {}',
				codeFilename: `${fixturesPath}/empty-block.css`,
				ignorePath: [path.join(__dirname, '.stylelintignore-empty')],
				config: {
					extends: `${fixturesPath}/config-block-no-empty`,
				},
			});

			expect(data).toMatchObject({
				errored: true,
				output: expect.stringContaining('Unexpected empty block (block-no-empty)'),
				results: expect.any(Array),
			});
		});

		it('ignored file with syntax error is ignored', async () => {
			const data = await standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: [path.join(__dirname, '.stylelintignore2')],
				config: {
					extends: `${fixturesPath}/config-block-no-empty`,
				},
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				output: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});

		it('ignored file with syntax error is ignored and there is no config', async () => {
			const data = await standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: [path.join(__dirname, '.stylelintignore2')],
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				output: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});
	});
});

describe('stylelintignore with options.cwd', () => {
	let results;
	const fixturesPath = path.join(__dirname, './fixtures');

	describe('standalone with .stylelintignore file ignoring one file', () => {
		beforeEach(async () => {
			const data = await standalone({
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
				cwd: __dirname,
			});

			results = data.results;
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
		it('ignored file is ignored', async () => {
			const data = await standalone({
				code: '.bar {}',
				codeFilename: `${fixturesPath}/empty-block.css`,
				ignorePath: [path.join(__dirname, '.stylelintignore')],
				config: {
					extends: `${fixturesPath}/config-block-no-empty`,
				},
				cwd: __dirname,
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				output: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});

		it('not ignored file is linted', async () => {
			const data = await standalone({
				code: '.bar {}',
				codeFilename: `${fixturesPath}/empty-block.css`,
				ignorePath: [path.join(__dirname, '.stylelintignore-empty')],
				config: {
					extends: `${fixturesPath}/config-block-no-empty`,
				},
				cwd: __dirname,
			});

			expect(data).toMatchObject({
				errored: true,
				output: expect.stringContaining('Unexpected empty block (block-no-empty)'),
				results: expect.any(Array),
			});
		});

		it('ignored file with syntax error is ignored', async () => {
			const data = await standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: [path.join(__dirname, '.stylelintignore2')],
				config: {
					extends: `${fixturesPath}/config-block-no-empty`,
				},
				cwd: __dirname,
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				output: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});

		it('ignored file with syntax error is ignored and there is no config', async () => {
			const data = await standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: [path.join(__dirname, '.stylelintignore2')],
				cwd: __dirname,
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				output: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});
	});
});

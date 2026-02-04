import path from 'node:path';

import replaceBackslashes from '../../testUtils/replaceBackslashes.mjs';
import safeChdir from '../../testUtils/safeChdir.mjs';
import standalone from '../../standalone.mjs';

const dirname = import.meta.dirname;

describe('stylelintignore', () => {
	safeChdir(dirname);

	let results;
	const fixturesPath = path.join(dirname, './fixtures');

	describe('standalone with .stylelintignore file ignoring one file', () => {
		beforeEach(async () => {
			const data = await standalone({
				files: [
					replaceBackslashes(`${fixturesPath}/empty-block.css`),
					replaceBackslashes(`${fixturesPath}/invalid-hex.css`),
				],
				config: {
					extends: [
						path.join(fixturesPath, 'config-block-no-empty.json'),
						path.join(fixturesPath, 'config-color-no-invalid-hex.json'),
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
				codeFilename: path.join(fixturesPath, 'empty-block.css'),
				ignorePath: [path.join(dirname, '.stylelintignore')],
				config: {
					extends: path.join(fixturesPath, 'config-block-no-empty.json'),
				},
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				report: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});

		it('not ignored file is linted', async () => {
			const data = await standalone({
				code: '.bar {}',
				codeFilename: path.join(fixturesPath, 'empty-block.css'),
				ignorePath: [path.join(dirname, '.stylelintignore-empty')],
				config: {
					extends: path.join(fixturesPath, 'config-block-no-empty.json'),
				},
			});

			expect(data).toMatchObject({
				errored: true,
				report: expect.stringContaining('Unexpected empty block (block-no-empty)'),
				results: expect.any(Array),
			});
		});

		it('ignored file with syntax error is ignored', async () => {
			const data = await standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: [path.join(dirname, '.stylelintignore2')],
				config: {
					extends: path.join(fixturesPath, 'config-block-no-empty.json'),
				},
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				report: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});

		it('ignored file with syntax error is ignored and there is no config', async () => {
			const data = await standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: [path.join(dirname, '.stylelintignore2')],
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				report: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});
	});
});

describe('stylelintignore with options.cwd', () => {
	let results;
	const fixturesPath = path.join(dirname, './fixtures');

	describe('standalone with .stylelintignore file ignoring one file', () => {
		beforeEach(async () => {
			const data = await standalone({
				files: [
					replaceBackslashes(path.join(fixturesPath, 'empty-block.css')),
					replaceBackslashes(path.join(fixturesPath, 'invalid-hex.css')),
				],
				config: {
					extends: [
						path.join(fixturesPath, 'config-block-no-empty.json'),
						path.join(fixturesPath, 'config-color-no-invalid-hex.json'),
					],
				},
				cwd: dirname,
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
				codeFilename: path.join(fixturesPath, 'empty-block.css'),
				ignorePath: [path.join(dirname, '.stylelintignore')],
				config: {
					extends: path.join(fixturesPath, 'config-block-no-empty.json'),
				},
				cwd: dirname,
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				report: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});

		it('not ignored file is linted', async () => {
			const data = await standalone({
				code: '.bar {}',
				codeFilename: path.join(fixturesPath, 'empty-block.css'),
				ignorePath: [path.join(dirname, '.stylelintignore-empty')],
				config: {
					extends: path.join(fixturesPath, 'config-block-no-empty.json'),
				},
				cwd: dirname,
			});

			expect(data).toMatchObject({
				errored: true,
				report: expect.stringContaining('Unexpected empty block (block-no-empty)'),
				results: expect.any(Array),
			});
		});

		it('ignored file with syntax error is ignored', async () => {
			const data = await standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: [path.join(dirname, '.stylelintignore2')],
				config: {
					extends: path.join(fixturesPath, 'config-block-no-empty.json'),
				},
				cwd: dirname,
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				report: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});

		it('ignored file with syntax error is ignored and there is no config', async () => {
			const data = await standalone({
				code: 'var a = {',
				codeFilename: `test.js`,
				ignorePath: [path.join(dirname, '.stylelintignore2')],
				cwd: dirname,
			});

			expect(data).toEqual({
				cwd: expect.any(String),
				errored: false,
				report: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});
	});
});

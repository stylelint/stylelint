import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
			assert.equal(results.length, 1);
		});

		it('empty-block.css not read', () => {
			assert.equal(/empty-block\.css/.test(results[0].source), false);
		});

		it('color-no-invalid-hex.css read', () => {
			assert.equal(/invalid-hex\.css/.test(results[0].source), true);
		});

		it('color-no-invalid-hex.css linted', () => {
			assert.equal(results[0].warnings.length, 1);
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

			assert.deepEqual(data, {
				cwd: dirname,
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

			assert.equal(data.errored, true);
			assert.ok(data.report.includes('Empty block (block-no-empty)'));
			assert.ok(Array.isArray(data.results));
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

			assert.deepEqual(data, {
				cwd: dirname,
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

			assert.deepEqual(data, {
				cwd: dirname,
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
			assert.equal(results.length, 1);
		});

		it('empty-block.css not read', () => {
			assert.equal(/empty-block\.css/.test(results[0].source), false);
		});

		it('color-no-invalid-hex.css read', () => {
			assert.equal(/invalid-hex\.css/.test(results[0].source), true);
		});

		it('color-no-invalid-hex.css linted', () => {
			assert.equal(results[0].warnings.length, 1);
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

			assert.deepEqual(data, {
				cwd: dirname,
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

			assert.equal(data.errored, true);
			assert.ok(data.report.includes('Empty block (block-no-empty)'));
			assert.ok(Array.isArray(data.results));
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

			assert.deepEqual(data, {
				cwd: dirname,
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

			assert.deepEqual(data, {
				cwd: dirname,
				errored: false,
				report: '[]',
				reportedDisables: [],
				results: [],
				ruleMetadata: {},
			});
		});
	});
});

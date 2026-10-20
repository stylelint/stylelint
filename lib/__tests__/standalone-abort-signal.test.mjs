import { afterEach, beforeEach, describe, it } from 'node:test';
import { readFile, rm, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import process from 'node:process';

import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';
import uniqueId from '../testUtils/uniqueId.mjs';

const fixturesPath = replaceBackslashes(new URL('./fixtures', import.meta.url));

describe('standalone with abortSignal', () => {
	describe('using code', () => {
		it('completes normally when signal is not aborted', async () => {
			const controller = new AbortController();

			const { results } = await standalone({
				code: 'a {}',
				config: { rules: { 'block-no-empty': true } },
				abortSignal: controller.signal,
			});

			assert.equal(results.length, 1);
			assert.equal(results[0].warnings.length, 1);
			assert.equal(results[0].warnings[0].rule, 'block-no-empty');
		});

		it('rejects when signal is already aborted', async () => {
			const controller = new AbortController();

			controller.abort();

			await assert.rejects(
				standalone({
					code: 'a {}',
					config: { rules: { 'block-no-empty': true } },
					abortSignal: controller.signal,
				}),
				{ message: 'This operation was aborted' },
			);
		});

		it('rejects with a custom abort reason', async () => {
			const controller = new AbortController();

			controller.abort(new Error('Lint cancelled'));

			await assert.rejects(
				standalone({
					code: 'a {}',
					config: { rules: { 'block-no-empty': true } },
					abortSignal: controller.signal,
				}),
				{ message: 'Lint cancelled' },
			);
		});
	});

	describe('using files', () => {
		it('completes normally when signal is not aborted', async () => {
			const controller = new AbortController();

			const { results } = await standalone({
				files: `${fixturesPath}/empty-block.css`,
				config: { rules: { 'block-no-empty': true } },
				abortSignal: controller.signal,
			});

			assert.equal(results.length, 1);
			assert.equal(results[0].warnings.length, 1);
			assert.equal(results[0].warnings[0].rule, 'block-no-empty');
		});

		it('rejects when signal is already aborted', async () => {
			const controller = new AbortController();

			controller.abort();

			await assert.rejects(
				standalone({
					files: `${fixturesPath}/empty-block.css`,
					config: { rules: { 'block-no-empty': true } },
					abortSignal: controller.signal,
				}),
				{ message: 'This operation was aborted' },
			);
		});

		it('rejects with a custom abort reason', async () => {
			const controller = new AbortController();

			controller.abort(new Error('Lint cancelled'));

			await assert.rejects(
				standalone({
					files: `${fixturesPath}/empty-block.css`,
					config: { rules: { 'block-no-empty': true } },
					abortSignal: controller.signal,
				}),
				{ message: 'Lint cancelled' },
			);
		});
	});

	describe('with fix and code', () => {
		it('completes normally when signal is not aborted', async () => {
			const controller = new AbortController();

			const { code } = await standalone({
				code: 'a { color: #ffffff; }',
				config: { rules: { 'color-hex-length': 'short' } },
				fix: true,
				abortSignal: controller.signal,
			});

			assert.notEqual(code, undefined);
		});

		it('rejects when signal is already aborted', async () => {
			const controller = new AbortController();

			controller.abort();

			await assert.rejects(
				standalone({
					code: 'a { color: #ffffff; }',
					config: { rules: { 'color-hex-length': 'short' } },
					fix: true,
					abortSignal: controller.signal,
				}),
				{ message: 'This operation was aborted' },
			);
		});
	});

	describe('with fix and files', () => {
		safeChdir(new URL(`./tmp/standalone-abort-signal-${uniqueId()}`, import.meta.url));

		let tempFile;

		beforeEach(async () => {
			tempFile = replaceBackslashes(path.join(process.cwd(), 'stylesheet.css'));
			await writeFile(tempFile, 'a { color: #ffffff; }');
		});

		afterEach(async () => {
			await rm(tempFile, { force: true });
		});

		it('rejects when signal is already aborted', async () => {
			const controller = new AbortController();

			controller.abort();

			const originalContent = await readFile(tempFile, 'utf8');

			await assert.rejects(
				standalone({
					files: tempFile,
					config: { rules: { 'color-hex-length': 'short' } },
					fix: true,
					abortSignal: controller.signal,
				}),
				{ message: 'This operation was aborted' },
			);

			const currentContent = await readFile(tempFile, 'utf8');

			assert.equal(currentContent, originalContent);
		});
	});

	it('rejects when signal is aborted while processing rules', async () => {
		const controller = new AbortController();

		const aborter = {
			ruleName: 'test/aborter',
			rule: () => async () => {
				controller.abort(new Error('mid-run'));
			},
		};

		await assert.rejects(
			standalone({
				code: 'a {}',
				config: { plugins: [aborter], rules: { 'test/aborter': true } },
				abortSignal: controller.signal,
			}),
			{ message: 'mid-run' },
		);
	});
});

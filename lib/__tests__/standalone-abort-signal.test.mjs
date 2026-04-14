import { readFileSync } from 'node:fs';

import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';

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

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].rule).toBe('block-no-empty');
		});

		it('rejects when signal is already aborted', async () => {
			const controller = new AbortController();

			controller.abort();

			await expect(
				standalone({
					code: 'a {}',
					config: { rules: { 'block-no-empty': true } },
					abortSignal: controller.signal,
				}),
			).rejects.toThrow('This operation was aborted');
		});

		it('rejects with a custom abort reason', async () => {
			const controller = new AbortController();

			controller.abort(new Error('Lint cancelled'));

			await expect(
				standalone({
					code: 'a {}',
					config: { rules: { 'block-no-empty': true } },
					abortSignal: controller.signal,
				}),
			).rejects.toThrow('Lint cancelled');
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

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].rule).toBe('block-no-empty');
		});

		it('rejects when signal is already aborted', async () => {
			const controller = new AbortController();

			controller.abort();

			await expect(
				standalone({
					files: `${fixturesPath}/empty-block.css`,
					config: { rules: { 'block-no-empty': true } },
					abortSignal: controller.signal,
				}),
			).rejects.toThrow('This operation was aborted');
		});

		it('rejects with a custom abort reason', async () => {
			const controller = new AbortController();

			controller.abort(new Error('Lint cancelled'));

			await expect(
				standalone({
					files: `${fixturesPath}/empty-block.css`,
					config: { rules: { 'block-no-empty': true } },
					abortSignal: controller.signal,
				}),
			).rejects.toThrow('Lint cancelled');
		});
	});

	describe('with fix and code', () => {
		it('completes normally when signal is not aborted', async () => {
			const controller = new AbortController();

			const { code } = await standalone({
				code: 'a {\ncolor:red;\n}',
				config: { rules: { indentation: [2] } },
				fix: true,
				abortSignal: controller.signal,
			});

			expect(code).toBeDefined();
		});

		it('rejects when signal is already aborted', async () => {
			const controller = new AbortController();

			controller.abort();

			await expect(
				standalone({
					code: 'a {\ncolor:red;\n}',
					config: { rules: { indentation: [2] } },
					fix: true,
					abortSignal: controller.signal,
				}),
			).rejects.toThrow('This operation was aborted');
		});
	});

	describe('with fix and files', () => {
		it('rejects when signal is already aborted', async () => {
			const controller = new AbortController();

			controller.abort();

			const filePath = `${fixturesPath}/fix.css`;
			const originalContent = readFileSync(new URL('./fixtures/fix.css', import.meta.url), 'utf8');

			await expect(
				standalone({
					files: filePath,
					config: { rules: { indentation: [2] } },
					fix: true,
					abortSignal: controller.signal,
				}),
			).rejects.toThrow('This operation was aborted');

			const currentContent = readFileSync(new URL('./fixtures/fix.css', import.meta.url), 'utf8');

			expect(currentContent).toBe(originalContent);
		});
	});
});

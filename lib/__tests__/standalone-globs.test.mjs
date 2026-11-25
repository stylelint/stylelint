import { after, before, describe, it } from 'node:test';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';

const fixturesPath = replaceBackslashes(new URL('./fixtures/globs', import.meta.url));
const isCaseSensitive = !existsSync(import.meta.filename.toUpperCase());

// Tests for https://github.com/stylelint/stylelint/issues/4521

describe('standalone globbing', () => {
	describe('paths with special characters', () => {
		// ref https://github.com/micromatch/picomatch#globbing-features
		const fixtureDirs = [
			`[digit]/not-digits`,
			`a(b)`,
			`with spaces`,
			`extglob!(s)`,
			`got!negate/negate`,
			// `extglob+(s)`, // Note: +'s cause errors. Ignoring until it becomes a problem
		];

		// https://github.com/stylelint/stylelint/issues/4193
		for (const fixtureDir of fixtureDirs) {
			it(`static path contains "${fixtureDir}"`, async (t) => {
				const cssPath = 'styles.css';

				const { results } = await standalone({
					files: cssPath,
					config: { rules: { 'block-no-empty': true } },
					cwd: path.join(fixturesPath, fixtureDir),
				});

				t.assert.strictEqual(results.length, 1);
				t.assert.strictEqual(results[0].errored, true);
				t.assert.partialDeepStrictEqual(results[0].warnings[0], {
					rule: 'block-no-empty',
					severity: 'error',
				});
			});
		}
	});

	describe('globbyOptions', () => {
		const dotFixturesPath = replaceBackslashes(
			new URL('./fixtures/globby-options', import.meta.url),
		);

		it('setting "dot" to true matches dot directories', async (t) => {
			const { results } = await standalone({
				files: '**/*.css',
				config: { rules: { 'block-no-empty': true } },
				cwd: dotFixturesPath,
				globbyOptions: { dot: true },
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.ok(results[0].source.includes('.dot'));
			t.assert.strictEqual(results[0].errored, true);
		});

		it('leaving "dot" unset ignores dot directories', async (t) => {
			const { results } = await standalone({
				files: '**/*.css',
				config: { rules: { 'block-no-empty': true } },
				cwd: dotFixturesPath,
				allowEmptyInput: true,
			});

			t.assert.strictEqual(results.length, 0);
		});

		it('throws for an unsupported option', async (t) => {
			await t.assert.rejects(
				standalone({
					files: '**/*.css',
					config: { rules: { 'block-no-empty': true } },
					cwd: dotFixturesPath,
					globbyOptions: { cwd: dotFixturesPath },
				}),
				{ message: /unknown option "cwd"/ },
			);
		});
	});

	// https://github.com/stylelint/stylelint/issues/4211
	it('glob has no + character, matched path does', async (t) => {
		const files = '**/glob-plus.css'; // file is in dir 'glob+chars'

		const { results } = await standalone({
			files,
			config: { rules: { 'block-no-empty': true } },
			cwd: fixturesPath,
		});

		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].errored, true);
		t.assert.partialDeepStrictEqual(results[0].warnings[0], {
			rule: 'block-no-empty',
			severity: 'error',
		});
	});

	// https://github.com/stylelint/stylelint/issues/4211
	it('glob contains + character, matched path does not', async (t) => {
		const files = '+(g)lob-contains-plus/*.css';

		const { results } = await standalone({
			files,
			config: { rules: { 'block-no-empty': true } },
			cwd: fixturesPath,
		});

		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].errored, true);
		t.assert.partialDeepStrictEqual(results[0].warnings[0], {
			rule: 'block-no-empty',
			severity: 'error',
		});
	});

	// https://github.com/stylelint/stylelint/issues/3272
	// should ignore 'negated-globs/ignore/styles.css'
	it('negated glob patterns', async (t) => {
		const files = ['negated-globs/**/*.css', '!negated-globs/ignore/**/*.css'];

		const { results } = await standalone({
			files,
			config: { rules: { 'block-no-empty': true } },
			cwd: fixturesPath,
		});

		// ensure that the only result is from the unignored file
		t.assert.ok(results[0].source.includes('lint-this-file.css'));

		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].errored, true);
		t.assert.partialDeepStrictEqual(results[0].warnings[0], {
			rule: 'block-no-empty',
			severity: 'error',
		});
	});

	describe('paths to files', () => {
		const tmpDir = replaceBackslashes(new URL('./tmp/standalone-globs-paths', import.meta.url));
		const files = ['a/one.css', 'a/two.css', 'b/three.css', 'b/ignored.css'];
		const lint = (options) =>
			standalone({ config: { rules: { 'block-no-empty': true } }, cwd: tmpDir, ...options });
		const sources = ({ results }) =>
			results.map((result) => path.relative(tmpDir, String(result.source))).sort();

		before(async () => {
			for (const file of files) {
				await mkdir(path.join(tmpDir, path.dirname(file)), { recursive: true });
				await writeFile(path.join(tmpDir, file), 'a {}');
			}
		});

		after(async () => {
			await rm(tmpDir, { recursive: true, force: true });
		});

		it('lints each file once when also matched by a glob', async (t) => {
			const linterResult = await lint({ files: ['a/one.css', 'b/three.css', 'a/*.css'] });

			t.assert.deepStrictEqual(sources(linterResult), [
				path.join('a', 'one.css'),
				path.join('a', 'two.css'),
				path.join('b', 'three.css'),
			]);
		});

		it('excludes the paths matched by a negated pattern', async (t) => {
			const linterResult = await lint({ files: ['a/one.css', 'b/ignored.css', '!**/ignored.css'] });

			t.assert.deepStrictEqual(sources(linterResult), [path.join('a', 'one.css')]);
		});

		it('excludes the paths ignored by "globbyOptions"', async (t) => {
			const linterResult = await lint({
				files: ['a/one.css', 'b/ignored.css'],
				globbyOptions: { ignore: ['b/ignored.css'] },
			});

			t.assert.deepStrictEqual(sources(linterResult), [path.join('a', 'one.css')]);
		});

		it(
			'lints each file once when a path to it differs in case',
			{ skip: isCaseSensitive },
			async (t) => {
				const linterResult = await lint({ files: ['A/one.css', 'a/*.css'] });

				t.assert.deepStrictEqual(sources(linterResult), [
					path.join('A', 'one.css'),
					path.join('a', 'two.css'),
				]);
			},
		);

		it(
			'lints both files when their paths differ only in case',
			{ skip: !isCaseSensitive },
			async (t) => {
				for (const directory of ['c', 'C']) {
					await mkdir(path.join(tmpDir, directory));
					await writeFile(path.join(tmpDir, directory, 'one.css'), 'a {}');
				}

				const linterResult = await lint({ files: ['c/one.css', 'C/one.css'] });

				t.assert.deepStrictEqual(sources(linterResult), [
					path.join('C', 'one.css'),
					path.join('c', 'one.css'),
				]);
			},
		);
	});

	describe('windows path style with backslash', () => {
		// The tests fail on non-windows environments.
		if (process.platform !== 'win32') {
			return;
		}

		it('should handle a backslash-separated file path', async (t) => {
			const cssGlob = path.win32.join('with spaces', 'styles.css');

			const { results } = await standalone({
				files: cssGlob,
				config: {
					rules: {
						'block-no-empty': true,
					},
				},
				cwd: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].errored, true);
			t.assert.partialDeepStrictEqual(results[0].warnings[0], {
				rule: 'block-no-empty',
				severity: 'error',
			});
		});
	});

	describe('mixed globs and paths with special chars', () => {
		it('manual escaping', async (t) => {
			const cssGlob = 'got\\[braces\\] and \\(spaces\\)/*.+(s|c)ss';

			const { results } = await standalone({
				files: cssGlob,
				config: {
					rules: {
						'block-no-empty': true,
					},
				},
				cwd: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].errored, true);
			t.assert.partialDeepStrictEqual(results[0].warnings[0], {
				rule: 'block-no-empty',
				severity: 'error',
			});
		});

		it('setting "cwd" in options', async (t) => {
			const cssGlob = `*.+(s|c)ss`;

			const { results } = await standalone({
				files: cssGlob,
				config: {
					rules: {
						'block-no-empty': true,
					},
				},
				cwd: `${fixturesPath}/got[braces] and (spaces)/`,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].errored, true);
			t.assert.partialDeepStrictEqual(results[0].warnings[0], {
				rule: 'block-no-empty',
				severity: 'error',
			});
		});

		// Failing case for reference. Documents behavior that doesn't work.

		// Note: This fails because there's no way to tell which parts of the glob are literal characters, and which are special globbing characters.
		//
		// 'got[braces] and (spaces)' is a literal directory path. `*.+(s|c)ss` is a glob.

		// https://github.com/stylelint/stylelint/issues/4855
		// it('glob and matched path contain different special chars, complex example', async (t) => {
		// 	const cssGlob = `${fixturesPath}/got[braces] and (spaces)/*.+(s|c)ss`;

		// 	const { results } = await standalone({
		// 		files: cssGlob,
		// 		config: {
		// 			rules: {
		// 				'block-no-empty': true,
		// 			},
		// 		},
		// 	});

		// 	t.assert.strictEqual(results.length, 1);
		// 	t.assert.strictEqual(results[0].errored, true);
		// 	t.assert.partialDeepStrictEqual(results[0].warnings[0], {
		// 		rule: 'block-no-empty',
		// 		severity: 'error',
		// 	});
		// });
	});
});

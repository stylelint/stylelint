'use strict';

/* eslint-disable node/no-extraneous-require */

const describe = require('@jest/globals').describe;
const expect = require('@jest/globals').expect;
const it = require('@jest/globals').it;

/* eslint-enable */

const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const standalone = require('../standalone');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures', 'globs'));

// Tests for https://github.com/stylelint/stylelint/issues/4521

describe('standalone globbing', () => {
	describe('paths with special characters', () => {
		// ref https://github.com/micromatch/micromatch#matching-features
		const fixtureDirs = [
			`[digit]/not-digits`,
			`a(b)`,
			`with spaces`,
			`extglob!(s)`,
			`got!negate/negate`,
			// `extglob+(s)`, // Note: +'s cause errors. Ignoring until it becomes a problem
		];

		// https://github.com/stylelint/stylelint/issues/4193
		it.each(fixtureDirs)(`static path contains "%s"`, async (fixtureDir) => {
			const cssPath = `${fixturesPath}/${fixtureDir}/styles.css`;

			const { results } = await standalone({
				files: cssPath,
				config: { rules: { 'block-no-empty': true } },
			});

			expect(results).toHaveLength(1);
			expect(results[0].errored).toEqual(true);
			expect(results[0].warnings[0]).toEqual(
				expect.objectContaining({
					rule: 'block-no-empty',
					severity: 'error',
				}),
			);
		});
	});

	// https://github.com/stylelint/stylelint/issues/4211
	it('glob has no + character, matched path does', async () => {
		const files = `${fixturesPath}/**/glob-plus.css`; // file is in dir 'glob+chars'

		const { results } = await standalone({
			files,
			config: { rules: { 'block-no-empty': true } },
		});

		expect(results).toHaveLength(1);
		expect(results[0].errored).toEqual(true);
		expect(results[0].warnings[0]).toEqual(
			expect.objectContaining({
				rule: 'block-no-empty',
				severity: 'error',
			}),
		);
	});

	// https://github.com/stylelint/stylelint/issues/4211
	it('glob contains + character, matched path does not', async () => {
		const files = `${fixturesPath}/+(g)lob-contains-plus/*.css`;

		const { results } = await standalone({
			files,
			config: { rules: { 'block-no-empty': true } },
		});

		expect(results).toHaveLength(1);
		expect(results[0].errored).toEqual(true);
		expect(results[0].warnings[0]).toEqual(
			expect.objectContaining({
				rule: 'block-no-empty',
				severity: 'error',
			}),
		);
	});

	// https://github.com/stylelint/stylelint/issues/3272
	// should ignore 'negated-globs/ignore/styles.css'
	it('negated glob patterns', async () => {
		const files = [
			`${fixturesPath}/negated-globs/**/*.css`,
			`!${fixturesPath}/negated-globs/ignore/**/*.css`,
		];

		const { results } = await standalone({
			files,
			config: { rules: { 'block-no-empty': true } },
		});

		// ensure that the only result is from the unignored file
		expect(results[0].source).toEqual(expect.stringContaining('lint-this-file.css'));

		expect(results).toHaveLength(1);
		expect(results[0].errored).toEqual(true);
		expect(results[0].warnings[0]).toEqual(
			expect.objectContaining({
				rule: 'block-no-empty',
				severity: 'error',
			}),
		);
	});

	describe('windows path style with backslash', () => {
		// The tests fail on non-windows environments.
		if (process.platform !== 'win32') {
			return;
		}

		it('should handle normal backslash in glob pattern', async () => {
			const cssGlob = path.win32.join(fixturesPath, 'with spaces', 'styles.css');

			const { results } = await standalone({
				files: cssGlob,
				config: {
					rules: {
						'block-no-empty': true,
					},
				},
			});

			expect(results).toHaveLength(1);
			expect(results[0].errored).toEqual(true);
			expect(results[0].warnings[0]).toEqual(
				expect.objectContaining({
					rule: 'block-no-empty',
					severity: 'error',
				}),
			);
		});
	});

	describe('mixed globs and paths with special chars', () => {
		it('manual escaping', async () => {
			const cssGlob = `${fixturesPath}/got\\[braces\\] and \\(spaces\\)/*.+(s|c)ss`;

			const { results } = await standalone({
				files: cssGlob,
				config: {
					rules: {
						'block-no-empty': true,
					},
				},
			});

			expect(results).toHaveLength(1);
			expect(results[0].errored).toEqual(true);
			expect(results[0].warnings[0]).toEqual(
				expect.objectContaining({
					rule: 'block-no-empty',
					severity: 'error',
				}),
			);
		});

		it('setting "cwd" in globbyOptions', async () => {
			const cssGlob = `*.+(s|c)ss`;

			const { results } = await standalone({
				files: cssGlob,
				config: {
					rules: {
						'block-no-empty': true,
					},
				},
				globbyOptions: {
					cwd: `${fixturesPath}/got[braces] and (spaces)/`,
				},
			});

			expect(results).toHaveLength(1);
			expect(results[0].errored).toEqual(true);
			expect(results[0].warnings[0]).toEqual(
				expect.objectContaining({
					rule: 'block-no-empty',
					severity: 'error',
				}),
			);
		});

		/* eslint-disable jest/no-commented-out-tests -- Failing case for reference. Documents behaviour that doesn't work. */

		// Note: This fails because there's no way to tell which parts of the glob are literal characters, and which are special globbing characters.
		//
		// 'got[braces] and (spaces)' is a literal directory path. `*.+(s|c)ss` is a glob.

		// https://github.com/stylelint/stylelint/issues/4855
		// it('glob and matched path contain different special chars, complex example', async () => {
		// 	const cssGlob = `${fixturesPath}/got[braces] and (spaces)/*.+(s|c)ss`;

		// 	const { results } = await standalone({
		// 		files: cssGlob,
		// 		config: {
		// 			rules: {
		// 				'block-no-empty': true,
		// 			},
		// 		},
		// 	});

		// 	expect(results).toHaveLength(1);
		// 	expect(results[0].errored).toEqual(true);
		// 	expect(results[0].warnings[0]).toEqual(
		// 		expect.objectContaining({
		// 			rule: 'block-no-empty',
		// 			severity: 'error',
		// 		}),
		// 	);
		// });

		/* eslint-enable */
	});
});

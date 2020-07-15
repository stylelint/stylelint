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

/**
 *

Failing tests for https://github.com/stylelint/stylelint/issues/4521

How to fix?

use fast-glob.escapePath() ? https://github.com/mrmlnc/fast-glob#escapepathpattern

try this:

if hasMagic
escapePath
is escapedPath an exact file match? if yes, use it
otherwise,
fall back to globbing

// see static vs dynamic paths https://github.com/mrmlnc/fast-glob#what-is-a-static-or-dynamic-pattern

 */

describe('standalone globbing', () => {
	// https://github.com/stylelint/stylelint/issues/4193
	it('static path contains "got(brackets)"', async () => {
		const cssPath = `${fixturesPath}/with(brackets)/styles.css`;

		const { results } = await standalone({
			files: cssPath,
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

	// https://github.com/stylelint/stylelint/issues/4193
	it('static path contains "got [many] (special) + !chars"', async () => {
		const cssPath = `${fixturesPath}/with [many] (special) + !characters/styles.css`;

		const { results } = await standalone({
			files: cssPath,
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

	// https://github.com/stylelint/stylelint/issues/4211
	it('glob has no + character, matched path does', async () => {
		const cssGlob = `${fixturesPath}/**/glob-plus.css`; // file is in dir 'glob+chars'

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
		expect(results[0].warnings[0]).objectContaining({
			rule: 'block-no-empty',
			severity: 'error',
		});
	});

	// https://github.com/stylelint/stylelint/issues/4211
	it('glob contains + character, matched path does not', async () => {
		const cssGlob = `${fixturesPath}/glob-contains-plus+/*.css`; // file is in dir 'glob+chars'

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

	// https://github.com/stylelint/stylelint/issues/3272
	// should ignore 'negated-globs/ignore/styles.css'
	it('negated glob patterns', async () => {
		const cssGlob = [
			`${fixturesPath}/negated-globs/**/*.css`,
			`!${fixturesPath}/negated-globs/ignore/**/*.css`,
		];

		const { results } = await standalone({
			files: cssGlob,
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
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

	// https://github.com/stylelint/stylelint/issues/4855
	it('glob with special chars matches path with special chars', async () => {
		const cssGlob = `${fixturesPath}/[glob-and-path]/sub-dir/*.css`;

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

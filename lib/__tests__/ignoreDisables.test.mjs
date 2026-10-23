import { beforeEach, describe, it } from 'node:test';

import postcss from 'postcss';
import postcssPlugin from '../postcssPlugin.mjs';
import standalone from '../standalone.mjs';

const config = {
	rules: { 'block-no-empty': true },
};

const css = `
/* stylelint-disable */
a {}
/* stylelint-enable */
a {
	b {} /* stylelint-disable-line block-no-empty */
}`;

describe('ignoreDisables with postcssPlugins', () => {
	let result;

	beforeEach(async () => {
		result = await postcss([
			postcssPlugin({
				config,
				ignoreDisables: true,
			}),
		]).process(css, { from: undefined });
	});

	it('expected number of warnings', (t) => {
		t.assert.strictEqual(result.warnings().length, 2);
	});

	it('expected rule 0', (t) => {
		t.assert.notStrictEqual(result.warnings()[0].text.indexOf('block-no-empty'), 1);
	});

	it('expected rule 1', (t) => {
		t.assert.notStrictEqual(result.warnings()[1].text.indexOf('block-no-empty'), 1);
	});
});

describe('ignoreDisables with standalone', () => {
	let results;

	beforeEach(async () => {
		results = (
			await standalone({
				config,
				code: css,
				ignoreDisables: true,
			})
		).results;
	});

	it('expected number of warnings', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 2);
	});

	it('expected rule 0', (t) => {
		t.assert.notStrictEqual(results[0].warnings[0].text.indexOf('block-no-empty'), 1);
	});

	it('expected rule 1', (t) => {
		t.assert.notStrictEqual(results[0].warnings[1].text.indexOf('block-no-empty'), 1);
	});
});

describe('ignoreDisables with config', () => {
	let results;

	beforeEach(async () => {
		results = (
			await standalone({
				config: { ignoreDisables: true, ...config },
				code: css,
			})
		).results;
	});

	it('expected number of warnings', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 2);
	});

	it('expected rule 0', (t) => {
		t.assert.notStrictEqual(results[0].warnings[0].text.indexOf('block-no-empty'), 1);
	});

	it('expected rule 1', (t) => {
		t.assert.notStrictEqual(results[0].warnings[1].text.indexOf('block-no-empty'), 1);
	});
});

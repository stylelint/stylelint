'use strict';

const postcssPlugin = require('../postcssPlugin');
const standalone = require('../standalone');

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
		result = await postcssPlugin.process(
			css,
			{ from: undefined },
			{
				config,
				ignoreDisables: true,
			},
		);
	});

	it('expected number of warnings', () => {
		expect(result.warnings()).toHaveLength(2);
	});

	it('expected rule 0', () => {
		expect(result.warnings()[0].text.indexOf('block-no-empty')).not.toBe(1);
	});

	it('expected rule 1', () => {
		expect(result.warnings()[1].text.indexOf('block-no-empty')).not.toBe(1);
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

	it('expected number of warnings', () => {
		expect(results[0].warnings).toHaveLength(2);
	});

	it('expected rule 0', () => {
		expect(results[0].warnings[0].text.indexOf('block-no-empty')).not.toBe(1);
	});

	it('expected rule 1', () => {
		expect(results[0].warnings[1].text.indexOf('block-no-empty')).not.toBe(1);
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

	it('expected number of warnings', () => {
		expect(results[0].warnings).toHaveLength(2);
	});

	it('expected rule 0', () => {
		expect(results[0].warnings[0].text.indexOf('block-no-empty')).not.toBe(1);
	});

	it('expected rule 1', () => {
		expect(results[0].warnings[1].text.indexOf('block-no-empty')).not.toBe(1);
	});
});

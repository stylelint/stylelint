'use strict';

const blurInterpolation = require('../blurInterpolation');

describe('blurInterpolation', () => {
	let css;
	let res;

	beforeEach(() => {
		css = '';
		res = '';
	});

	it('blurInterpolation', () => {
		expect(blurInterpolation('#{$selector}')).toBe(' $selector ');
		expect(blurInterpolation('#{$selector}', '`')).toBe('`$selector`');
		expect(blurInterpolation('#{$selector * 10px}')).toBe(' $selector * 10px ');

		css = '#{$font-size}/#{$line-height}';
		res = ' $font-size / $line-height ';
		expect(blurInterpolation(css)).toBe(res);

		css = 'url(#{$selector * 10px})';
		res = 'url( $selector * 10px )';
		expect(blurInterpolation(css)).toBe(res);

		css = 'calc(#{$selector} * 2)';
		res = 'calc( $selector  * 2)';
		expect(blurInterpolation(css)).toBe(res);

		css =
			"filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr='#{ie-hex-str($green)}', endColorstr='#{ie-hex-str($translucent-red)}');";
		res =
			"filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr=' ie-hex-str($green) ', endColorstr=' ie-hex-str($translucent-red) ');";
		expect(blurInterpolation(css)).toBe(res);

		css = '"I ate #{5 + 10} pies!"';
		res = '"I ate  5 + 10  pies!"';
		expect(blurInterpolation(css)).toBe(res);
		expect(blurInterpolation('@{variable}')).toBe(' variable ');
	});
});

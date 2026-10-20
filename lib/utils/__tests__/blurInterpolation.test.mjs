import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import blurInterpolation from '../blurInterpolation.mjs';

describe('blurInterpolation', () => {
	let css;
	let res;

	beforeEach(() => {
		css = '';
		res = '';
	});

	it('blurInterpolation', () => {
		assert.equal(blurInterpolation('#{$selector}'), ' $selector ');
		assert.equal(blurInterpolation('#{$selector}', '`'), '`$selector`');
		assert.equal(blurInterpolation('#{$selector * 10px}'), ' $selector * 10px ');

		css = '#{$font-size}/#{$line-height}';
		res = ' $font-size / $line-height ';
		assert.equal(blurInterpolation(css), res);

		css = 'url(#{$selector * 10px})';
		res = 'url( $selector * 10px )';
		assert.equal(blurInterpolation(css), res);

		css = 'calc(#{$selector} * 2)';
		res = 'calc( $selector  * 2)';
		assert.equal(blurInterpolation(css), res);

		css =
			"filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr='#{ie-hex-str($green)}', endColorstr='#{ie-hex-str($translucent-red)}');";
		res =
			"filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr=' ie-hex-str($green) ', endColorstr=' ie-hex-str($translucent-red) ');";
		assert.equal(blurInterpolation(css), res);

		css = '"I ate #{5 + 10} pies!"';
		res = '"I ate  5 + 10  pies!"';
		assert.equal(blurInterpolation(css), res);
		assert.equal(blurInterpolation('@{variable}'), ' variable ');
	});
});

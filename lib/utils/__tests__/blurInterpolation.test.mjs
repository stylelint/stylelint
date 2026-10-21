import { beforeEach, describe, it } from 'node:test';

import blurInterpolation from '../blurInterpolation.mjs';

describe('blurInterpolation', () => {
	let css;
	let res;

	beforeEach(() => {
		css = '';
		res = '';
	});

	it('blurInterpolation', (t) => {
		t.assert.strictEqual(blurInterpolation('#{$selector}'), ' $selector ');
		t.assert.strictEqual(blurInterpolation('#{$selector}', '`'), '`$selector`');
		t.assert.strictEqual(blurInterpolation('#{$selector * 10px}'), ' $selector * 10px ');

		css = '#{$font-size}/#{$line-height}';
		res = ' $font-size / $line-height ';
		t.assert.strictEqual(blurInterpolation(css), res);

		css = 'url(#{$selector * 10px})';
		res = 'url( $selector * 10px )';
		t.assert.strictEqual(blurInterpolation(css), res);

		css = 'calc(#{$selector} * 2)';
		res = 'calc( $selector  * 2)';
		t.assert.strictEqual(blurInterpolation(css), res);

		css =
			"filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr='#{ie-hex-str($green)}', endColorstr='#{ie-hex-str($translucent-red)}');";
		res =
			"filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr=' ie-hex-str($green) ', endColorstr=' ie-hex-str($translucent-red) ');";
		t.assert.strictEqual(blurInterpolation(css), res);

		css = '"I ate #{5 + 10} pies!"';
		res = '"I ate  5 + 10  pies!"';
		t.assert.strictEqual(blurInterpolation(css), res);
		t.assert.strictEqual(blurInterpolation('@{variable}'), ' variable ');
	});
});

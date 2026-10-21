import { describe, it } from 'node:test';

import isUrlFunction from '../isUrlFunction.mjs';
import valueParser from 'postcss-value-parser';

describe('isUrlFunction', () => {
	it('ignores other functions', (t) => {
		t.assert.strictEqual(isUrlFunction(valueParser('calc(10% + 10px)').nodes[0]), false);
		t.assert.strictEqual(isUrlFunction(valueParser('calc(10px * pow(2, 10)').nodes[0]), false);
		t.assert.strictEqual(isUrlFunction(valueParser('rem(10rem, 6rem)').nodes[0]), false);
		t.assert.strictEqual(isUrlFunction(valueParser('var(--width, 20px)').nodes[0]), false);
		t.assert.strictEqual(isUrlFunction(valueParser('round(var(--width), 50px)').nodes[0]), false);
	});

	it('matches url', (t) => {
		t.assert.strictEqual(isUrlFunction(valueParser('URL()').nodes[0]), true);
		t.assert.strictEqual(isUrlFunction(valueParser('url("photo.gif")').nodes[0]), true);
		t.assert.strictEqual(isUrlFunction(valueParser('url("../images/bullet.jpg")').nodes[0]), true);
	});
});

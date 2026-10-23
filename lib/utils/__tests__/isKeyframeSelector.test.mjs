import { it } from 'node:test';

import isKeyframeSelector from '../isKeyframeSelector.mjs';

it('isKeyframeSelector', (t) => {
	t.assert.ok(isKeyframeSelector('to'));
	t.assert.ok(isKeyframeSelector('from'));
	t.assert.ok(isKeyframeSelector('0%'));
	t.assert.ok(isKeyframeSelector('9%'));
	t.assert.ok(isKeyframeSelector('26%'));
	t.assert.ok(isKeyframeSelector('100%'));
	t.assert.ok(isKeyframeSelector('27.5%'));
	t.assert.ok(isKeyframeSelector('27.0009%'));
	t.assert.ok(isKeyframeSelector('.5%'));
	t.assert.ok(isKeyframeSelector('000.5%'));
	t.assert.ok(isKeyframeSelector('209%'));
	t.assert.ok(isKeyframeSelector('entry 209%'));
	t.assert.ok(isKeyframeSelector('entry-crossing\n1.2%'));

	t.assert.ok(!isKeyframeSelector('a'));
	t.assert.ok(!isKeyframeSelector('.foo'));
	t.assert.ok(!isKeyframeSelector('#something'));
	t.assert.ok(!isKeyframeSelector('100'));
	t.assert.ok(!isKeyframeSelector('0.1'));
	t.assert.ok(!isKeyframeSelector('1.0'));
	t.assert.ok(!isKeyframeSelector('1a%'));
	t.assert.ok(!isKeyframeSelector('entry 10'));
	t.assert.ok(!isKeyframeSelector('10% entry-crossing'));
});

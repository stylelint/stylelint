import assert from 'node:assert/strict';
import { it } from 'node:test';

import isKeyframeSelector from '../isKeyframeSelector.mjs';

it('isKeyframeSelector', () => {
	assert.ok(isKeyframeSelector('to'));
	assert.ok(isKeyframeSelector('from'));
	assert.ok(isKeyframeSelector('0%'));
	assert.ok(isKeyframeSelector('9%'));
	assert.ok(isKeyframeSelector('26%'));
	assert.ok(isKeyframeSelector('100%'));
	assert.ok(isKeyframeSelector('27.5%'));
	assert.ok(isKeyframeSelector('27.0009%'));
	assert.ok(isKeyframeSelector('.5%'));
	assert.ok(isKeyframeSelector('000.5%'));
	assert.ok(isKeyframeSelector('209%'));
	assert.ok(isKeyframeSelector('entry 209%'));
	assert.ok(isKeyframeSelector('entry-crossing\n1.2%'));

	assert.ok(!isKeyframeSelector('a'));
	assert.ok(!isKeyframeSelector('.foo'));
	assert.ok(!isKeyframeSelector('#something'));
	assert.ok(!isKeyframeSelector('100'));
	assert.ok(!isKeyframeSelector('0.1'));
	assert.ok(!isKeyframeSelector('1.0'));
	assert.ok(!isKeyframeSelector('1a%'));
	assert.ok(!isKeyframeSelector('entry 10'));
	assert.ok(!isKeyframeSelector('10% entry-crossing'));
});

import assert from 'node:assert/strict';
import { test } from 'node:test';

import isNumbery from '../isNumbery.mjs';

test('isNumbery', () => {
	assert.equal(isNumbery('1'), true);
	assert.equal(isNumbery('21 '), true);
	assert.equal(isNumbery(' 212'), true);
	assert.equal(isNumbery('232 '), true);
	assert.equal(isNumbery(''), false);
	assert.equal(isNumbery(' '), false);
	assert.equal(isNumbery('a'), false);
	assert.equal(isNumbery(0), true);
	assert.equal(isNumbery(1), true);
	assert.equal(isNumbery(-1), true);
	assert.equal(isNumbery(0.1), true);
	assert.equal(isNumbery(-0.1), true);
	assert.equal(isNumbery(NaN), false);
	assert.equal(isNumbery('NaN'), false);
});

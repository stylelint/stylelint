import assert from 'node:assert/strict';
import { it } from 'node:test';

import isSingleLineString from '../isSingleLineString.mjs';

const multiLineTemplate = `foo
bar`;

it('isSingleLineString', () => {
	assert.ok(isSingleLineString('foo'));
	assert.ok(isSingleLineString('foo bar'));
	assert.ok(!isSingleLineString('foo\nbar'));
	assert.ok(!isSingleLineString('foo\rbar'));
	assert.ok(!isSingleLineString(multiLineTemplate));
});

import { it } from 'node:test';

import isSingleLineString from '../isSingleLineString.mjs';

const multiLineTemplate = `foo
bar`;

it('isSingleLineString', (t) => {
	t.assert.ok(isSingleLineString('foo'));
	t.assert.ok(isSingleLineString('foo bar'));
	t.assert.ok(!isSingleLineString('foo\nbar'));
	t.assert.ok(!isSingleLineString('foo\rbar'));
	t.assert.ok(!isSingleLineString(multiLineTemplate));
});

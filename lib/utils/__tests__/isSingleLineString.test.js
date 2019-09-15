'use strict';

const isSingleLineString = require('../isSingleLineString');

const multiLineTemplate = `foo
bar`;

it('isSingleLineString', () => {
	expect(isSingleLineString('foo')).toBeTruthy();
	expect(isSingleLineString('foo bar')).toBeTruthy();
	expect(isSingleLineString('foo\nbar')).toBeFalsy();
	expect(isSingleLineString('foo\rbar')).toBeFalsy();
	expect(isSingleLineString(multiLineTemplate)).toBeFalsy();
});

'use strict';

const isValidIdentifier = require('../isValidIdentifier');

it('isValidIdentifier', () => {
	expect(isValidIdentifier('foo')).toBeTruthy();
	expect(isValidIdentifier('foo1')).toBeTruthy();
	expect(isValidIdentifier('1')).toBeFalsy();
	expect(isValidIdentifier('-1')).toBeFalsy();
	expect(isValidIdentifier('--foo')).toBeFalsy();
	expect(isValidIdentifier('has a space')).toBeFalsy();
	expect(isValidIdentifier(null)).toBeFalsy();
	expect(isValidIdentifier('')).toBeFalsy();
	expect(isValidIdentifier(' ')).toBeFalsy();
	expect(isValidIdentifier(' --foo')).toBeFalsy();
	expect(isValidIdentifier('foö')).toBeFalsy();
	expect(isValidIdentifier('\\26 B')).toBeTruthy(); // ISO 10646 character
	expect(isValidIdentifier('\\000026B')).toBeTruthy(); // ISO 10646 character
	expect(isValidIdentifier("te'st")).toBeFalsy(); // unescaped quotation mark
	expect(isValidIdentifier('te"st')).toBeFalsy(); // unescaped quotation mark
	expect(isValidIdentifier("te\\'st")).toBeTruthy(); // escaped (in CSS) quotation mark
	expect(isValidIdentifier('te\\"st')).toBeTruthy(); // escaped (in CSS) quotation mark
	expect(isValidIdentifier("te\\'s\\'t")).toBeTruthy(); // escaped (in CSS) quotation mark
	expect(isValidIdentifier('te\\"s\\"t')).toBeTruthy(); // escaped (in CSS) quotation mark
});

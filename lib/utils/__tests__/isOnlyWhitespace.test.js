'use strict';

const isOnlyWhitespace = require('../isOnlyWhitespace');

it('isOnlyWhitespace', () => {
	expect(isOnlyWhitespace('\r\n \t \n   ')).toBeTruthy();
	expect(isOnlyWhitespace('   s')).toBeFalsy();
	expect(isOnlyWhitespace('s\t')).toBeFalsy();
	expect(isOnlyWhitespace('\n  .\t')).toBeFalsy();
});

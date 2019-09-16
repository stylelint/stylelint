'use strict';

const hasEmptyLine = require('../hasEmptyLine');

it('hasEmptyLine', () => {
	expect(hasEmptyLine('\n\n')).toBeTruthy();
	expect(hasEmptyLine('\r\n\r\n')).toBeTruthy();
	expect(hasEmptyLine('\n\n\n\n')).toBeTruthy();
	expect(hasEmptyLine('\r\n\r\n\r\n\r\n')).toBeTruthy();
	expect(hasEmptyLine('   \n\n')).toBeTruthy();
	expect(hasEmptyLine('\n\n   \n\n')).toBeTruthy();
	expect(hasEmptyLine('\n \n')).toBeTruthy();
	expect(hasEmptyLine('\r\n \r\n')).toBeTruthy();
	expect(hasEmptyLine('\n \n \n \n')).toBeTruthy();
	expect(hasEmptyLine('\r \n\n r\n\r\n\r\n')).toBeTruthy();
	expect(hasEmptyLine('   \n \n')).toBeTruthy();
	expect(hasEmptyLine('\n \n   \n \n')).toBeTruthy();
	expect(hasEmptyLine('\n\t\n')).toBeTruthy();
	expect(hasEmptyLine('\n\t \n')).toBeTruthy();
	expect(hasEmptyLine('\r\n\t\r\n')).toBeTruthy();
	expect(hasEmptyLine('\n\t\n\n \t\n')).toBeTruthy();
	expect(hasEmptyLine('\r\n\t\r\n\t\r\n\r\n')).toBeTruthy();
	expect(hasEmptyLine('   \n\t\n')).toBeTruthy();
	expect(hasEmptyLine('\n\t\n  \t  \n\n')).toBeTruthy();
	expect(hasEmptyLine('')).toBeFalsy();
	expect(hasEmptyLine(' ')).toBeFalsy();
	expect(hasEmptyLine('\t')).toBeFalsy();
	expect(hasEmptyLine('\n')).toBeFalsy();
	expect(hasEmptyLine('\r\n')).toBeFalsy();
});

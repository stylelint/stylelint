import isNumbery from '../isNumbery.js';

test('isNumbery', () => {
	expect(isNumbery('1')).toBe(true);
	expect(isNumbery('21 ')).toBe(true);
	expect(isNumbery(' 212')).toBe(true);
	expect(isNumbery('232 ')).toBe(true);
	expect(isNumbery('')).toBe(false);
	expect(isNumbery(' ')).toBe(false);
	expect(isNumbery('a')).toBe(false);
	expect(isNumbery(0)).toBe(true);
	expect(isNumbery(1)).toBe(true);
	expect(isNumbery(-1)).toBe(true);
	expect(isNumbery(0.1)).toBe(true);
	expect(isNumbery(-0.1)).toBe(true);
	expect(isNumbery(NaN)).toBe(false);
	expect(isNumbery('NaN')).toBe(false);
});

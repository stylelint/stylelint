'use strict';

const isVariable = require('../isVariable');

it('isVariable', () => {
	expect(isVariable('var(--something)')).toBeTruthy();
	expect(isVariable('vAr(--something)')).toBeTruthy();
	expect(isVariable('VAR(--something)')).toBeTruthy();
	expect(isVariable('var(  --something  )')).toBeTruthy();
	expect(isVariable('initial')).toBeFalsy();
	expect(isVariable('currentColor')).toBeFalsy();
	expect(isVariable('-webkit-appearance')).toBeFalsy();
	expect(isVariable('--custom-property')).toBeFalsy();
	expect(isVariable('$sass-variable')).toBeFalsy();
	expect(isVariable('@less-variable')).toBeFalsy();
});

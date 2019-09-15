'use strict';

const isCounterResetCustomIdentValue = require('../isCounterResetCustomIdentValue');

it('isCustomIdents', () => {
	expect(isCounterResetCustomIdentValue('counter')).toBeTruthy();
	expect(isCounterResetCustomIdentValue('cOuNtEr')).toBeTruthy();
	expect(isCounterResetCustomIdentValue('COUNTER')).toBeTruthy();
	expect(isCounterResetCustomIdentValue('counter-name')).toBeTruthy();
	expect(isCounterResetCustomIdentValue('counter1')).toBeTruthy();
	expect(isCounterResetCustomIdentValue('counter2')).toBeTruthy();
	expect(isCounterResetCustomIdentValue('none')).toBeFalsy();
	expect(isCounterResetCustomIdentValue('inherit')).toBeFalsy();
	expect(isCounterResetCustomIdentValue('initial')).toBeFalsy();
	expect(isCounterResetCustomIdentValue('unset')).toBeFalsy();
	expect(isCounterResetCustomIdentValue('-1')).toBeFalsy();
	expect(isCounterResetCustomIdentValue('1')).toBeFalsy();
});

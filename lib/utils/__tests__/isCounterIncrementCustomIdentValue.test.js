'use strict';

const isCounterIncrementCustomIdentValue = require('../isCounterIncrementCustomIdentValue');

it('isCustomIdents', () => {
	expect(isCounterIncrementCustomIdentValue('counter')).toBeTruthy();
	expect(isCounterIncrementCustomIdentValue('cOuNtEr')).toBeTruthy();
	expect(isCounterIncrementCustomIdentValue('COUNTER')).toBeTruthy();
	expect(isCounterIncrementCustomIdentValue('counter-name')).toBeTruthy();
	expect(isCounterIncrementCustomIdentValue('counter1')).toBeTruthy();
	expect(isCounterIncrementCustomIdentValue('counter2')).toBeTruthy();
	expect(isCounterIncrementCustomIdentValue('none')).toBeFalsy();
	expect(isCounterIncrementCustomIdentValue('inherit')).toBeFalsy();
	expect(isCounterIncrementCustomIdentValue('initial')).toBeFalsy();
	expect(isCounterIncrementCustomIdentValue('unset')).toBeFalsy();
	expect(isCounterIncrementCustomIdentValue('-1')).toBeFalsy();
	expect(isCounterIncrementCustomIdentValue('1')).toBeFalsy();
});

'use strict';

const isCustomSelector = require('../isCustomSelector');

it('isCustomSelector', () => {
	expect(isCustomSelector(':--custom-selector')).toBeTruthy();
	expect(isCustomSelector('a')).toBeFalsy();
	expect(isCustomSelector('#div')).toBeFalsy();
	expect(isCustomSelector(':hover')).toBeFalsy();
	expect(isCustomSelector(':before')).toBeFalsy();
	expect(isCustomSelector('::before')).toBeFalsy();
});

'use strict';

const isCustomMediaQuery = require('../isCustomMediaQuery');

it('isCustomMediaQuery', () => {
	expect(isCustomMediaQuery('--custom-media-query')).toBeTruthy();
	expect(isCustomMediaQuery('border-top-left-radius')).toBeFalsy();
	expect(isCustomMediaQuery('-webkit-appearance')).toBeFalsy();
	expect(isCustomMediaQuery('$sass-variable')).toBeFalsy();
	expect(isCustomMediaQuery('@less-variable')).toBeFalsy();
	expect(isCustomMediaQuery('var(--something)')).toBeFalsy();
	expect(isCustomMediaQuery('var(  --something  )')).toBeFalsy();
});

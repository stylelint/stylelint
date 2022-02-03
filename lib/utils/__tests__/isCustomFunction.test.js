'use strict';

const isCustomFunction = require('../isCustomFunction');

it('isCustomMediaQuery', () => {
	expect(isCustomFunction('--custom-function')).toBeTruthy();
	expect(isCustomFunction('calc')).toBeFalsy();
	expect(isCustomFunction('$sass-variable')).toBeFalsy();
	expect(isCustomFunction('@less-variable')).toBeFalsy();
	expect(isCustomFunction('var(--something)')).toBeFalsy();
	expect(isCustomFunction('var(  --something  )')).toBeFalsy();
});

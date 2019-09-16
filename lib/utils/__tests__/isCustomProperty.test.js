'use strict';

const isCustomProperty = require('../isCustomProperty');

it('isCustomProperty', () => {
	expect(isCustomProperty('--custom-property')).toBeTruthy();
	expect(isCustomProperty('border-top-left-radius')).toBeFalsy();
	expect(isCustomProperty('-webkit-appearance')).toBeFalsy();
	expect(isCustomProperty('$sass-variable')).toBeFalsy();
	expect(isCustomProperty('@less-variable')).toBeFalsy();
	expect(isCustomProperty('var(--something)')).toBeFalsy();
	expect(isCustomProperty('var(  --something  )')).toBeFalsy();
});

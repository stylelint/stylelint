'use strict';

const hasInterpolation = require('../hasInterpolation');

it('hasInterpolation', () => {
	expect(hasInterpolation('(min-width#{$value}: 10px)')).toBeTruthy();
	expect(hasInterpolation('(@{value}min-width : 10px)')).toBeTruthy();
	expect(hasInterpolation('#{$Attr}-color')).toBeTruthy();
	expect(hasInterpolation('@{Attr}-color')).toBeTruthy();
	expect(hasInterpolation('#{50% - $n}')).toBeTruthy();
	expect(hasInterpolation('.n-#{$n}')).toBeTruthy();
	expect(hasInterpolation(':n-#{$n}')).toBeTruthy();
	expect(hasInterpolation('.n-@{n}')).toBeTruthy();
	expect(hasInterpolation('(min-width: 10px)')).toBeFalsy();
	expect(hasInterpolation('.a{}')).toBeFalsy();
	expect(hasInterpolation("$sass-variable + 'foo'")).toBeFalsy();
	expect(hasInterpolation('10px')).toBeFalsy();
	expect(hasInterpolation("@less-variable + 'foo'")).toBeFalsy();
});

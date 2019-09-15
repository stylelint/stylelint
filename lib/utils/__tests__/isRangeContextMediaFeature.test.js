'use strict';

const isRangeContextMediaFeature = require('../isRangeContextMediaFeature');

it('isRangeContextMediaFeature', () => {
	expect(isRangeContextMediaFeature('(width = 10px)')).toBeTruthy();
	expect(isRangeContextMediaFeature('(width > 10px)')).toBeTruthy();
	expect(isRangeContextMediaFeature('(width < 10px)')).toBeTruthy();
	expect(isRangeContextMediaFeature('(HEIGHT >= 10px)')).toBeTruthy();
	expect(isRangeContextMediaFeature('(HEIGHT <= 10px)')).toBeTruthy();
	expect(isRangeContextMediaFeature('(5px > width < 10px)')).toBeTruthy();
	expect(isRangeContextMediaFeature('(5px => HEIGHT <= 10px)')).toBeTruthy();
	expect(isRangeContextMediaFeature('(5px > HEIGHT <= 10px)')).toBeTruthy();
	expect(isRangeContextMediaFeature('(color)')).toBeFalsy();
	expect(isRangeContextMediaFeature('(MONOCHROME)')).toBeFalsy();
	expect(isRangeContextMediaFeature('(min-width: 10px)')).toBeFalsy();
});

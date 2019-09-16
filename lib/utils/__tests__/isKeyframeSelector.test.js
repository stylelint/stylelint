'use strict';

const isKeyframeSelector = require('../isKeyframeSelector');

it('isKeyframeSelector', () => {
	expect(isKeyframeSelector('to')).toBeTruthy();
	expect(isKeyframeSelector('from')).toBeTruthy();
	expect(isKeyframeSelector('0%')).toBeTruthy();
	expect(isKeyframeSelector('9%')).toBeTruthy();
	expect(isKeyframeSelector('26%')).toBeTruthy();
	expect(isKeyframeSelector('100%')).toBeTruthy();
	expect(isKeyframeSelector('27.5%')).toBeTruthy();
	expect(isKeyframeSelector('27.0009%')).toBeTruthy();
	expect(isKeyframeSelector('.5%')).toBeTruthy();
	expect(isKeyframeSelector('000.5%')).toBeTruthy();
	expect(isKeyframeSelector('209%')).toBeTruthy();

	expect(isKeyframeSelector('a')).toBeFalsy();
	expect(isKeyframeSelector('.foo')).toBeFalsy();
	expect(isKeyframeSelector('#something')).toBeFalsy();
	expect(isKeyframeSelector('100')).toBeFalsy();
	expect(isKeyframeSelector('0.1')).toBeFalsy();
	expect(isKeyframeSelector('1.0')).toBeFalsy();
	expect(isKeyframeSelector('1a%')).toBeFalsy();
});

'use strict';

const blurComments = require('../blurComments');

it('blurComments', () => {
	expect(blurComments('abc')).toBe('abc');
	expect(blurComments('/* abc */')).toBe('`');
	expect(blurComments('a { b:c } /*abc*/', '#')).toBe('a { b:c } #');
});

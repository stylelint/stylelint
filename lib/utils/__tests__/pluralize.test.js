'use strict';

const pluralize = require('../pluralize');

test('pluralize()', () => {
	expect(pluralize('word', 0)).toBe('words');
	expect(pluralize('word', 1)).toBe('word');
	expect(pluralize('word', 2)).toBe('words');
});

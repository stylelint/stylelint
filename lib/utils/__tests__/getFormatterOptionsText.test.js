'use strict';

const getFormatterOptionsText = require('../getFormatterOptionsText');

it('getFormatterOptionsText', () => {
	expect(getFormatterOptionsText()).toBe('"compact", "json", "string", "unix", "verbose"');
	expect(getFormatterOptionsText({ useOr: true })).toBe(
		'"compact", "json", "string", "unix" or "verbose"',
	);
});

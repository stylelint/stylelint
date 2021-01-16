'use strict';

const getFormatterOptionsText = require('../getFormatterOptionsText');

it('getFormatterOptionsText', () => {
	expect(getFormatterOptionsText()).toBe('"compact", "json", "string", "tap", "unix", "verbose"');
	expect(getFormatterOptionsText({ useOr: true })).toBe(
		'"compact", "json", "string", "tap", "unix" or "verbose"',
	);
});

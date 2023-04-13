'use strict';

const getFormatterOptionsText = require('../getFormatterOptionsText');

it('getFormatterOptionsText', () => {
	expect(getFormatterOptionsText(', ')).toBe('compact, github, json, string, tap, unix, verbose');
	expect(getFormatterOptionsText(', ', '"')).toBe(
		'"compact", "github", "json", "string", "tap", "unix", "verbose"',
	);
});

import getFormatterOptionsText from '../getFormatterOptionsText.mjs';

it('getFormatterOptionsText', () => {
	expect(getFormatterOptionsText(', ')).toBe(
		'compact, github, gitlab, json, string, tap, unix, verbose',
	);
	expect(getFormatterOptionsText(', ', '"')).toBe(
		'"compact", "github", "gitlab", "json", "string", "tap", "unix", "verbose"',
	);
});

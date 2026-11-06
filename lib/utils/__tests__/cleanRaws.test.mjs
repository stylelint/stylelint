import { describe, it } from 'node:test';

import postcss from 'postcss';

import cleanRaws from '../cleanRaws.mjs';

const cases = [
	['', ''],
	['red', 'red'],
	['red   ', 'red'],
	['red\n', 'red'],
	['red /* x */ blue', 'red  blue'],
	['red/**/blue', 'red/**/blue'],
	['/* x */red', 'red'],
	['red/* x */', 'red'],
	['a,/* x */b', 'a,b'],
	['a/* x */,b', 'a/* x */,b'],
	['a,/* x */,/* y */b', 'a,,b'],
	['"/* x */"', '"/* x */"'],
	['url(a/* x */b)', 'url(a/* x */b)'],
	['1px  solid', '1px  solid'],
];

describe('cleanRaws', () => {
	it('matches the value PostCSS parses', (t) => {
		for (const [raw, expected] of cases) {
			t.assert.strictEqual(cleanRaws(raw), expected);

			const decl = postcss.parse(`a{color:${raw};}`).first.first;

			t.assert.strictEqual(cleanRaws(raw), decl.value);
		}
	});

	it('only removes trailing whitespace', (t) => {
		t.assert.strictEqual(cleanRaws('  red  '), '  red');
	});

	it('keeps trailing whitespace in custom property values', (t) => {
		t.assert.strictEqual(cleanRaws('red   ', true), 'red   ');
		t.assert.strictEqual(cleanRaws('red /* x */   ', true), 'red    ');
	});
});

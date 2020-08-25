'use strict';

const standalone = require('../../../standalone');
const { messages, ruleName } = require('..');

it('warns that the rule is deprecated', () => {
	const config = {
		rules: {
			[ruleName]: [],
		},
	};

	const code = '';

	return standalone({ code, config }).then((output) => {
		const result = output.results[0];

		expect(result.deprecations).toHaveLength(1);
		expect(result.deprecations[0].text).toEqual(
			`'${ruleName}' has been deprecated. Instead use 'property-allowed-list'.`,
		);
		expect(result.deprecations[0].reference).toEqual(
			`https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
		);
	});
});

testRule({
	ruleName,

	config: [''],

	reject: [
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,

	config: [[]],

	reject: [
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,

	config: ['transform', 'background-size'],

	accept: [
		{
			code: 'a { background-size: cover; }',
		},
		{
			code: 'a { transform: scale(1); }',
		},
		{
			code: 'a { -webkit-transform: scale(1); }',
		},
		{
			code: 'a { transform: scale(1); background-size: cover; }',
		},
		{
			code: 'a { transform: scale(1); -webkit-transform: scale(1); background-size: cover; }',
		},
		{
			code: 'a { $scss: 0; }',
		},
		{
			code: 'a { @less: 0; }',
		},
		{
			code: 'a { --custom-property: 0; }',
		},
	],

	reject: [
		{
			code: 'a { background: pink; }',
			message: messages.rejected('background'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { overflow: hidden; background-size: cover; }',
			message: messages.rejected('overflow'),
			line: 1,
			column: 5,
		},
		{
			code: 'a { color: orange; -webkit-transform: scale(1); }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,

	config: [['/^background/']],

	accept: [
		{
			code: 'a { background: pink; }',
		},
		{
			code: 'a { background-color: pink; }',
		},
		{
			code: 'a { background-image: none; }',
		},
		{
			code: 'a { $scss: 0; }',
		},
		{
			code: 'a { @less: 0; }',
		},
		{
			code: 'a { --custom-property: 0; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,

	config: [[/^background/]],

	accept: [
		{
			code: 'a { background-image: none; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			message: messages.rejected('color'),
			line: 1,
			column: 5,
		},
	],
});

testRule({
	ruleName,

	config: ['/margin/'],

	accept: [
		{
			code: 'a { $padding: 0; }',
		},
		{
			code: 'a { @padding: 0; }',
		},
		{
			code: 'a { --padding: 0; }',
		},
	],
});

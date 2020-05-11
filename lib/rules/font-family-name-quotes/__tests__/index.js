'use strict';

const { messages, ruleName } = require('..');

const variablePositiveTests = [
	{
		code: 'a { font-family: $sassy-font-family; }',
		description: 'ignores Sass variables',
	},
	{
		code: 'a { font-family: @less-666; }',
		description: 'ignores Less variables',
	},
	{
		code: 'a { font-family: var(--ff1); }',
		description: 'ignores custom properties',
	},
	{
		code: '$font-family: map-get($font-stacks, default); $default-font-family: pink',
		description: 'ignores Sass variable containing font-family in name',
	},
	{
		code: '@font-family: map-get(@font-stacks, default); @default-font-family: pink',
		description: 'ignores Less variable containing font-family in name',
	},
];

testRule({
	ruleName,
	config: ['always-unless-keyword'],

	accept: variablePositiveTests.concat([
		{
			code: 'a { font-family: "Lucida Grande", "Arial", sans-serif; }',
		},
		{
			code: 'a { font: 1em "Lucida Grande", "Arial", sans-serif; }',
		},
		{
			code: 'a { fOnT: 1em "Lucida Grande", "Arial", sans-serif; }',
		},
		{
			code:
				'a { font: italic small-caps bolder condensed 16px/3 "Lucida Grande", "Arial", sans-serif; }',
		},
		{
			code: 'a { fOnT-fAmIlY: "Lucida Grande", "Arial", sans-serif; }',
		},
		{
			code: 'a { FONT-FAMILY: "Lucida Grande", "Arial", sans-serif; }',
		},
		{
			code: 'a { font-family: \'Hawaii 5-0\', "Arial", cursive; }',
		},
		{
			code: 'a { font-family: "Times", \'Arial\', serif; }',
		},
		{
			code: 'a { font-family: "Times", "Arial", fantasy; }',
		},
		{
			code: 'a { font-family: \'Times\', "Arial", cursive; }',
		},
		{
			code: 'a { font-family: inherit; }',
		},
		{
			code: 'a { font-family: \'Lucida Grande\', "Arial", sans-serif; }',
		},
		{
			code: 'a { font-family: "Lucida Grande", \'Arial\', sans-serif; }',
		},
		{
			code:
				"a { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
		},
		{
			code: 'a { fonts: "Arial", sans-serif; }',
		},
		{
			code: 'a { font: italic 300 16px/30px "Arial", serif; }',
		},
		{
			code: 'a { font-family: "\u1100"; }',
		},
		{
			code: 'a { font-family: "ሀ"; }',
		},
	]),

	reject: [
		{
			code: 'a { font-family: "Lucida Grande", "Arial", "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 45,
		},
		{
			code: 'a { font: 1em "Lucida Grande", "Arial", "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 42,
		},
		{
			code: 'a { fOnT-fAmIlY: "Lucida Grande", "Arial", "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 45,
		},
		{
			code: 'a { font-family: Lucida Grande, "Arial", sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 18,
		},
		{
			code: "a { font-family: 'Lucida Grande', Arial, sans-serif; }",
			message: messages.expected('Arial'),
			line: 1,
			column: 35,
		},
		{
			code: 'a { font-family: "inherit"; }',
			message: messages.rejected('inherit'),
		},
		{
			code:
				"a { font-family: 'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
			message: messages.rejected('system-ui'),
		},
		{
			code:
				"a { font-family: system-ui, '-apple-system', BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
			message: messages.rejected('-apple-system'),
		},
		{
			code:
				"a { font-family: system-ui, -apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif; }",
			message: messages.rejected('BlinkMacSystemFont'),
		},
		{
			code: 'a { font: italic 300 16px/30px Arial, serif; }',
			message: messages.expected('Arial'),
			line: 1,
			column: 32,
		},
		{
			code: 'a { font: italic 1000 16px/30px Arial, serif; }',
			message: messages.expected('Arial'),
			line: 1,
			column: 33,
		},
		{
			code: 'a { font: italic 892 16px/30px Arial, serif; }',
			message: messages.expected('Arial'),
			line: 1,
			column: 32,
		},
		{
			code: 'a { font-family: \u1100; }',
			message: messages.expected('\u1100'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font-family: ሀ; }',
			message: messages.expected('ሀ'),
			line: 1,
			column: 18,
		},
	],
});

testRule({
	ruleName,
	config: ['always-where-recommended'],

	accept: variablePositiveTests.concat([
		{
			code: 'a { font: 1em "Lucida Grande", Arial, sans-serif; }',
		},
		{
			code: 'a { font-family: "Lucida Grande", Arial, sans-serif; }',
		},
		{
			code: 'a { fOnT-fAmIlY: "Lucida Grande", Arial, sans-serif; }',
		},
		{
			code: 'a { FONT-FAMILY: "Lucida Grande", Arial, sans-serif; }',
		},
		{
			code: 'a { font-family: Times, "Times New Roman", serif; }',
		},
		{
			code: 'a { font-family: "Something6"; }',
		},
		{
			code: 'a { font-family: "snake_case"; }',
		},
		{
			code: 'a { font-family: "Red/Black", Arial, sans-serif; }',
		},
		{
			code: 'a { font-family: Arial, "Ahem!", sans-serif; }',
		},
		{
			code: 'a { font-family: "Hawaii 5-0", Arial, sans-serif; }',
		},
		{
			code: "a { font-family: 'Red/Black', Arial, sans-serif; }",
		},
		{
			code: "a { font-family: Arial, 'Ahem!', sans-serif; }",
		},
		{
			code: "a { font-family: 'Hawaii 5-0', Arial, sans-serif; }",
		},
		{
			code: "a { font-family: Times, 'Times New Roman', serif; }",
		},
		{
			code: "a { font-family: 'Something6'; }",
		},
		{
			code: "a { font-family: 'snake_case'; }",
		},
		{
			code: "a { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
		},
	]),

	reject: [
		{
			code: 'a { font: 1em Lucida Grande, Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 15,
		},
		{
			code: 'a { font-family: Lucida Grande, Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { fOnT-fAmIlY: Lucida Grande, Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { FONT-FAMILY: Lucida Grande, Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font-family: "Lucida Grande", Arial, "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 43,
		},
		{
			code: 'a { font-family: Red/Black, Arial, sans-serif; }',
			message: messages.expected('Red/Black'),
		},
		{
			code: 'a { font-family: Arial, Ahem!, sans-serif; }',
			message: messages.expected('Ahem!'),
		},
		{
			code: 'a { font-family: Hawaii 5-0, Arial, sans-serif; }',
			message: messages.expected('Hawaii 5-0'),
		},
		{
			code: 'a { font-family: Times, Times New Roman, serif; }',
			message: messages.expected('Times New Roman'),
		},
		{
			code: 'a { font-family: Something6; }',
			message: messages.expected('Something6'),
		},
		{
			code: 'a { font-family: snake_case; }',
			message: messages.expected('snake_case'),
		},
		{
			code: 'a { font-family: "Arial"; }',
			message: messages.rejected('Arial'),
		},
		{
			code:
				"a { font-family: '-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
			message: messages.rejected('-apple-system'),
		},
		{
			code:
				"a { font-family: -apple-system, 'BlinkMacSystemFont', 'Segoe UI', Roboto, sans-serif; }",
			message: messages.rejected('BlinkMacSystemFont'),
		},
	],
});

testRule({
	ruleName,
	config: ['always-where-required'],

	accept: variablePositiveTests.concat([
		{
			code: 'a { font: 1em Lucida Grande, Arial, sans-serif; }',
		},
		{
			code: 'a { font-family: Lucida Grande, Arial, sans-serif; }',
		},
		{
			code: 'a { fOnT-fAmIlY: Lucida Grande, Arial, sans-serif; }',
		},
		{
			code: 'a { FONT-FAMILY: Lucida Grande, Arial, sans-serif; }',
		},
		{
			code: 'a { font-family: "Red/Black", Arial, sans-serif; }',
		},
		{
			code: 'a { font-family: Arial, "Ahem!", sans-serif; }',
		},
		{
			code: 'a { font-family: "Hawaii 5-0", Arial, sans-serif; }',
		},
		{
			code: "a { font-family: 'Red/Black', Arial, sans-serif; }",
		},
		{
			code: "a { font-family: Arial, 'Ahem!', sans-serif; }",
		},
		{
			code: "a { font-family: 'Hawaii 5-0', Arial, sans-serif; }",
		},
		{
			code: 'a { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }',
		},
	]),

	reject: [
		{
			code: 'a { font: 1em "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { font-family: "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { fOnT-fAmIlY: "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { FONT-FAMILY: "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
			line: 1,
			column: 19,
		},
		{
			code: 'a { font-family: Lucida Grande, Arial, "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 41,
		},
		{
			code: 'a { font-family: Red/Black, Arial, sans-serif; }',
			message: messages.expected('Red/Black'),
		},
		{
			code: 'a { font-family: Arial, Ahem!, sans-serif; }',
			message: messages.expected('Ahem!'),
		},
		{
			code: 'a { font-family: Hawaii 5-0, Arial, sans-serif; }',
			message: messages.expected('Hawaii 5-0'),
		},
		{
			code: "a { font-family: '-apple-system', BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }",
			message: messages.rejected('-apple-system'),
		},
		{
			code: "a { font-family: -apple-system, 'BlinkMacSystemFont', Segoe UI, Roboto, sans-serif; }",
			message: messages.rejected('BlinkMacSystemFont'),
		},
	],
});

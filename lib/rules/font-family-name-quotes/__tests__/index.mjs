import rule from '../index.js';
const { messages, ruleName } = rule;

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

const scssPositiveTests = [
	{
		code: 'a { font: #{customFunc($some-length)} "Times", "Arial"; }',
		description: 'ignores Sass function with interpolation',
	},
];

testRule({
	ruleName,
	config: ['always-unless-keyword'],

	accept: [
		...variablePositiveTests,
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
			code: 'a { font: italic small-caps bolder condensed 16px/3 "Lucida Grande", "Arial", sans-serif; }',
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
			code: "a { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
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
	],

	reject: [
		{
			code: 'a { font-family: "Lucida Grande", "Arial", "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 56,
		},
		{
			code: 'a { font: 1em "Lucida Grande", "Arial", "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 41,
			endLine: 1,
			endColumn: 53,
		},
		{
			code: 'a { fOnT-fAmIlY: "Lucida Grande", "Arial", "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 56,
		},
		{
			code: 'a { font-family: Lucida Grande, "Arial", sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: "a { font-family: 'Lucida Grande', Arial, sans-serif; }",
			message: messages.expected('Arial'),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: 'a { font-family: "inherit"; }',
			message: messages.rejected('inherit'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: "a { font-family: 'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
			message: messages.rejected('system-ui'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: "a { font-family: system-ui, '-apple-system', BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
			message: messages.rejected('-apple-system'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 44,
		},
		{
			code: "a { font-family: system-ui, -apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif; }",
			message: messages.rejected('BlinkMacSystemFont'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 64,
		},
		{
			code: 'a { font: italic 300 16px/30px Arial, serif; }',
			message: messages.expected('Arial'),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: 'a { font: italic 1000 16px/30px Arial, serif; }',
			message: messages.expected('Arial'),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 38,
		},
		{
			code: 'a { font: italic 892 16px/30px Arial, serif; }',
			message: messages.expected('Arial'),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: 'a { font-family: \u1100; }',
			message: messages.expected('\u1100'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a { font-family: ሀ; }',
			message: messages.expected('ሀ'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 19,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['always-unless-keyword'],

	accept: [...scssPositiveTests],
});

testRule({
	ruleName,
	config: ['always-where-recommended'],

	accept: [
		...variablePositiveTests,
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
	],

	reject: [
		{
			code: 'a { font: 1em Lucida Grande, Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { font-family: Lucida Grande, Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { fOnT-fAmIlY: Lucida Grande, Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { FONT-FAMILY: Lucida Grande, Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { font-family: "Lucida Grande", Arial, "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 54,
		},
		{
			code: 'a { font-family: Red/Black, Arial, sans-serif; }',
			message: messages.expected('Red/Black'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { font-family: Arial, Ahem!, sans-serif; }',
			message: messages.expected('Ahem!'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { font-family: Hawaii 5-0, Arial, sans-serif; }',
			message: messages.expected('Hawaii 5-0'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { font-family: Times, Times New Roman, serif; }',
			message: messages.expected('Times New Roman'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: 'a { font-family: Something6; }',
			message: messages.expected('Something6'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { font-family: snake_case; }',
			message: messages.expected('snake_case'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { font-family: "Arial"; }',
			message: messages.rejected('Arial'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: "a { font-family: '-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
			message: messages.rejected('-apple-system'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: "a { font-family: -apple-system, 'BlinkMacSystemFont', 'Segoe UI', Roboto, sans-serif; }",
			message: messages.rejected('BlinkMacSystemFont'),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 53,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['always-where-recommended'],

	accept: [...scssPositiveTests],
});

testRule({
	ruleName,
	config: ['always-where-required'],

	accept: [
		...variablePositiveTests,
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
	],

	reject: [
		{
			code: 'a { font: 1em "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { font-family: "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a { fOnT-fAmIlY: "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a { FONT-FAMILY: "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a { font-family: Lucida Grande, Arial, "sans-serif"; }',
			message: messages.rejected('sans-serif'),
			line: 1,
			column: 40,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: 'a { font-family: Red/Black, Arial, sans-serif; }',
			message: messages.expected('Red/Black'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: 'a { font-family: Arial, Ahem!, sans-serif; }',
			message: messages.expected('Ahem!'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { font-family: Hawaii 5-0, Arial, sans-serif; }',
			message: messages.expected('Hawaii 5-0'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: "a { font-family: '-apple-system', BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }",
			message: messages.rejected('-apple-system'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: "a { font-family: -apple-system, 'BlinkMacSystemFont', Segoe UI, Roboto, sans-serif; }",
			message: messages.rejected('BlinkMacSystemFont'),
			line: 1,
			column: 33,
			endLine: 1,
			endColumn: 53,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
	config: ['always-where-required'],

	accept: [...scssPositiveTests],
});

testRule({
	ruleName,
	config: ['always-unless-keyword'],
	fix: true,
	reject: [
		{
			code: 'a { font-family: "Lucida Grande", "Arial", "sans-serif"; }',
			fixed: 'a { font-family: "Lucida Grande", "Arial", sans-serif; }',
			message: messages.rejected('sans-serif'),
		},
		{
			code: 'a { font: 1em "Lucida Grande", "Arial", "sans-serif"; }',
			fixed: 'a { font: 1em "Lucida Grande", "Arial", sans-serif; }',
			message: messages.rejected('sans-serif'),
		},
		{
			code: 'a { fOnT-fAmIlY: "Lucida Grande", "Arial", "sans-serif"; }',
			fixed: 'a { fOnT-fAmIlY: "Lucida Grande", "Arial", sans-serif; }',
			message: messages.rejected('sans-serif'),
		},
		{
			code: 'a { font-family: Lucida Grande, "Arial", sans-serif; }',
			fixed: 'a { font-family: "Lucida Grande", "Arial", sans-serif; }',
			message: messages.expected('Lucida Grande'),
		},
		{
			code: "a { font-family: 'Lucida Grande', Arial, sans-serif; }",
			fixed: 'a { font-family: \'Lucida Grande\', "Arial", sans-serif; }',
			message: messages.expected('Arial'),
		},
		{
			code: 'a { font-family: "inherit"; }',
			fixed: 'a { font-family: inherit; }',
			message: messages.rejected('inherit'),
		},
		{
			code: "a { font-family: 'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
			fixed:
				"a { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
			message: messages.rejected('system-ui'),
		},
		{
			code: "a { font-family: system-ui, '-apple-system', BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
			fixed:
				"a { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
			message: messages.rejected('-apple-system'),
		},
		{
			code: "a { font-family: system-ui, -apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif; }",
			fixed:
				"a { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }",
			message: messages.rejected('BlinkMacSystemFont'),
		},
		{
			code: 'a { font: italic 300 16px/30px Arial, serif; }',
			fixed: 'a { font: italic 300 16px/30px "Arial", serif; }',
			message: messages.expected('Arial'),
		},
		{
			code: 'a { font: italic 1000 16px/30px Arial, serif; }',
			fixed: 'a { font: italic 1000 16px/30px "Arial", serif; }',
			message: messages.expected('Arial'),
		},
		{
			code: 'a { font: italic 892 16px/30px Arial, serif; }',
			fixed: 'a { font: italic 892 16px/30px "Arial", serif; }',
			message: messages.expected('Arial'),
		},
		{
			code: 'a { font-family: \u1100; }',
			fixed: 'a { font-family: "\u1100"; }',
			message: messages.expected('\u1100'),
		},
		{
			code: 'a { font-family: ሀ; }',
			fixed: 'a { font-family: "ሀ"; }',
			message: messages.expected('ሀ'),
		},
		{
			code: "a { font-family: -apple-system, Hawaii 5-0, 'BlinkMacSystemFont', Segoe UI, 'Roboto', 'sans-serif'; }",
			fixed:
				'a { font-family: -apple-system, "Hawaii 5-0", BlinkMacSystemFont, "Segoe UI", \'Roboto\', sans-serif; }',
			description: 'multiple fixes on one declaration',
			warnings: [
				{ message: messages.expected('Hawaii 5-0') },
				{ message: messages.rejected('BlinkMacSystemFont') },
				{ message: messages.expected('Segoe UI') },
				{ message: messages.rejected('sans-serif') },
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always-where-recommended'],
	fix: true,

	reject: [
		{
			code: 'a { font: 1em Lucida Grande, Arial, sans-serif; }',
			fixed: 'a { font: 1em "Lucida Grande", Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
		},
		{
			code: 'a { font-family: Lucida Grande, Arial, sans-serif; }',
			fixed: 'a { font-family: "Lucida Grande", Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
		},
		{
			code: 'a { fOnT-fAmIlY: Lucida Grande, Arial, sans-serif; }',
			fixed: 'a { fOnT-fAmIlY: "Lucida Grande", Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
		},
		{
			code: 'a { FONT-FAMILY: Lucida Grande, Arial, sans-serif; }',
			fixed: 'a { FONT-FAMILY: "Lucida Grande", Arial, sans-serif; }',
			message: messages.expected('Lucida Grande'),
		},
		{
			code: 'a { font-family: "Lucida Grande", Arial, "sans-serif"; }',
			fixed: 'a { font-family: "Lucida Grande", Arial, sans-serif; }',
			message: messages.rejected('sans-serif'),
		},
		{
			code: 'a { font-family: Red/Black, Arial, sans-serif; }',
			fixed: 'a { font-family: "Red/Black", Arial, sans-serif; }',
			message: messages.expected('Red/Black'),
		},
		{
			code: 'a { font-family: Arial, Ahem!, sans-serif; }',
			fixed: 'a { font-family: Arial, "Ahem!", sans-serif; }',
			message: messages.expected('Ahem!'),
		},
		{
			code: 'a { font-family: Hawaii 5-0, Arial, sans-serif; }',
			fixed: 'a { font-family: "Hawaii 5-0", Arial, sans-serif; }',
			message: messages.expected('Hawaii 5-0'),
		},
		{
			code: 'a { font-family: Times, Times New Roman, serif; }',
			fixed: 'a { font-family: Times, "Times New Roman", serif; }',
			message: messages.expected('Times New Roman'),
		},
		{
			code: 'a { font-family: Something6; }',
			fixed: 'a { font-family: "Something6"; }',
			message: messages.expected('Something6'),
		},
		{
			code: 'a { font-family: snake_case; }',
			fixed: 'a { font-family: "snake_case"; }',
			message: messages.expected('snake_case'),
		},
		{
			code: 'a { font-family: "Arial"; }',
			fixed: 'a { font-family: Arial; }',
			message: messages.rejected('Arial'),
		},
		{
			code: "a { font-family: '-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
			fixed:
				"a { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
			message: messages.rejected('-apple-system'),
		},
		{
			code: "a { font-family: -apple-system, 'BlinkMacSystemFont', 'Segoe UI', Roboto, sans-serif; }",
			fixed:
				"a { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
			message: messages.rejected('BlinkMacSystemFont'),
		},
		{
			code: "a { font-family: -apple-system, Hawaii 5-0, 'BlinkMacSystemFont', Segoe UI, 'Roboto', 'sans-serif'; }",
			fixed:
				'a { font-family: -apple-system, "Hawaii 5-0", BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }',
			description: 'multiple fixes on one declaration',
			warnings: [
				{ message: messages.expected('Hawaii 5-0') },
				{ message: messages.rejected('BlinkMacSystemFont') },
				{ message: messages.expected('Segoe UI') },
				{ message: messages.rejected('Roboto') },
				{ message: messages.rejected('sans-serif') },
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always-where-required'],
	fix: true,

	reject: [
		{
			code: 'a { font: 1em "Lucida Grande", Arial, sans-serif; }',
			fixed: 'a { font: 1em Lucida Grande, Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
		},
		{
			code: 'a { font-family: "Lucida Grande", Arial, sans-serif; }',
			fixed: 'a { font-family: Lucida Grande, Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
		},
		{
			code: 'a { fOnT-fAmIlY: "Lucida Grande", Arial, sans-serif; }',
			fixed: 'a { fOnT-fAmIlY: Lucida Grande, Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
		},
		{
			code: 'a { FONT-FAMILY: "Lucida Grande", Arial, sans-serif; }',
			fixed: 'a { FONT-FAMILY: Lucida Grande, Arial, sans-serif; }',
			message: messages.rejected('Lucida Grande'),
		},
		{
			code: 'a { font-family: Lucida Grande, Arial, "sans-serif"; }',
			fixed: 'a { font-family: Lucida Grande, Arial, sans-serif; }',
			message: messages.rejected('sans-serif'),
		},
		{
			code: 'a { font-family: Red/Black, Arial, sans-serif; }',
			fixed: 'a { font-family: "Red/Black", Arial, sans-serif; }',
			message: messages.expected('Red/Black'),
		},
		{
			code: 'a { font-family: Arial, Ahem!, sans-serif; }',
			fixed: 'a { font-family: Arial, "Ahem!", sans-serif; }',
			message: messages.expected('Ahem!'),
		},
		{
			code: 'a { font-family: Hawaii 5-0, Arial, sans-serif; }',
			fixed: 'a { font-family: "Hawaii 5-0", Arial, sans-serif; }',
			message: messages.expected('Hawaii 5-0'),
		},
		{
			code: "a { font-family: '-apple-system', BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }",
			fixed: 'a { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }',
			message: messages.rejected('-apple-system'),
		},
		{
			code: "a { font-family: -apple-system, 'BlinkMacSystemFont', Segoe UI, Roboto, sans-serif; }",
			fixed: 'a { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }',
			message: messages.rejected('BlinkMacSystemFont'),
		},
		{
			code: "a { font-family: -apple-system, Hawaii 5-0, 'BlinkMacSystemFont', Segoe UI, 'Roboto', 'sans-serif'; }",
			fixed:
				'a { font-family: -apple-system, "Hawaii 5-0", BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }',
			description: 'multiple fixes on one declaration',
			warnings: [
				{ message: messages.expected('Hawaii 5-0') },
				{ message: messages.rejected('BlinkMacSystemFont') },
				{ message: messages.rejected('Roboto') },
				{ message: messages.rejected('sans-serif') },
			],
		},
	],
});

import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['hover', 'nth-child', 'root', 'placeholder', 'has'],

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a:hover {}',
		},
		{
			code: 'a:nth-child(5) {}',
		},
		{
			code: ':root {}',
		},
		{
			code: 'a:has(#id) {}',
		},
		{
			code: 'a:hover, a:nth-child(5) {}',
		},
		{
			code: 'a::before {}',
		},
		{
			code: 'a:nth-child(5)::before {}',
		},
		{
			code: 'a:-moz-placeholder {}',
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
	],

	reject: [
		{
			code: 'a:HOVER {}',
			message: messages.rejected(':HOVER'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a:-MOZ-PLACEholder {}',
			message: messages.rejected(':-MOZ-PLACEholder'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a:focus {}',
			message: messages.rejected(':focus'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'div:nth-LAST-child {}',
			message: messages.rejected(':nth-LAST-child'),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a,\n:global {}',
			message: messages.rejected(':global'),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 8,
		},
		{
			code: 'input:-ms-input-placeholder {}',
			message: messages.rejected(':-ms-input-placeholder'),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'input:-Ms-INPUT-placeholder {}',
			message: messages.rejected(':-Ms-INPUT-placeholder'),
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a:not(::selection) {}',
			message: messages.rejected(':not'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 6,
		},
	],
});

testRule({
	ruleName,
	config: '/^nth/',

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a:nth-child(5) {}',
		},
		{
			code: 'a:nth-LAST-child {}',
		},
	],

	reject: [
		{
			code: 'a:hover {}',
			message: messages.rejected(':hover'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 8,
		},
	],
});

testRule({
	ruleName,
	config: /^nth/,

	accept: [
		{
			code: 'a {}',
		},
	],

	reject: [
		{
			code: 'a:hover {}',
			message: messages.rejected(':hover'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 8,
		},
	],
});

testRule({
	ruleName,
	config: ['hover'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: ':#{$variable} {}',
		},
		{
			code: ':#{$VARIABLE} {}',
		},
		{
			code: 'a:#{$variable} {}',
		},
	],
});

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a { transform: translate(1px); }',
		},
		{
			code: 'a { transform: TRANSLATE(1px); }',
		},
		{
			code: 'a { transform: --custom-function(1px); }',
		},
		{
			code: 'a { transform: scale(0.5) translate(-100%, -100%); }',
		},
		{
			code: 'a { animation-timeline: scroll(); }',
		},
		{
			code: 'a { background: -webkit-gradient(linear, 0 50%, 0 100%, from(white), color-stop(0.5, yellow), to(red)); }',
		},
		{
			code: 'a { height: calc(10px*(5*(10 - 5))); }',
		},
		{
			code: 'a { transform: color.adjust(1px); transform: rgb(color.adjust(1px)); }',
			description: 'ignore scss namespaced functions',
		},
		{
			code: 'a { color: light-dark(#777, #000); }',
			description: 'explicit light-dark check (ref: #7226)',
		},
		{
			code: 'a { offset-path: xywh(20px 30% 150% 200%); }',
			description: 'explicit xywh check',
		},
		{
			code: 'a { animation-timing-function: linear(0, 0.25, 1); }',
			description: 'explicit linear check',
		},
	],

	reject: [
		{
			code: 'a { transform: unknown(4); }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { transform: UNKNOWN(4); }',
			message: messages.rejected('UNKNOWN'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: 'a { width: calc(10% * unknown(1)); }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 30,
		},
	],
});

testRule({
	ruleName,
	config: true,
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: 'a { $list: (list) }',
		},
		{
			code: 'a { --primary-color: #{theme(1px)}; }',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreFunctions: ['theme', '/^foo-/', /^bar$/i] }],

	accept: [
		{
			code: 'a { transform: translate(1px); }',
		},
		{
			code: 'a { transform: theme(1px); }',
		},
		{
			code: 'a { transform: foo-func(1px); }',
		},
		{
			code: 'a { transform: bar(1px); }',
		},
		{
			code: 'a { transform: BAR(1px); }',
		},
	],

	reject: [
		{
			code: 'a { transform: unknown(1px); }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 16,
		},
		{
			code: 'a { transform: theme-custom(1px); }',
			message: messages.rejected('theme-custom'),
			line: 1,
			column: 16,
		},
	],
});

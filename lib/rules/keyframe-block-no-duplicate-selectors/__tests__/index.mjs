import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@keyframes foo { 0% {} 100% {} }',
		},
		{
			code: '@keyframes foo { from {} to {} }',
		},
	],

	reject: [
		{
			code: '@keyframes foo { from {} from {} }',
			message: messages.rejected('from'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: '@keyframes foo { 0% {} 0% {} }',
			message: messages.rejected('0%'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '@keyframes foo { from {} FROM {} }',
			message: messages.rejected('FROM'),
		},
		{
			code: '@keyframes foo { from {} to {} to {} }',
			message: messages.rejected('to'),
		},
		{
			code: '@keyframes foo { 0% {} 0% {} 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: '@-webkit-keyframes foo { 0% {} 0% {} 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: '@-moz-keyframes foo { 0% {} 0% {} 100% {} }',
			message: messages.rejected('0%'),
		},
		{
			code: '@keyframes foo { 0% {} 0%, 100% {} }',
			message: messages.rejected('0%'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '@keyframes foo { #{$bar} {} #{$bar} {} }',
			description: 'SCSS interpolation in selector',
		},
	],
});

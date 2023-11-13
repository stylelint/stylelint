import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { color: pink !important; }',
		},
		{
			code: '@keyframes important { from { margin: 1px; } }',
		},
		{
			code: '@-webkit-keyframes important { from { margin: 1px; } }',
		},
		{
			code: '@-WEBKIT-KEYFRAMES important { from { margin: 1px; } }',
		},
		{
			code: '@non-keyframes important { from { margin: 1px !important; } }',
		},
		{
			code: '@keyframes-non important { from { margin: 1px !important; } }',
		},
	],

	reject: [
		{
			code: '@keyframes important { from { margin: 1px !important; } }',
			description: 'with !important',
			message: messages.rejected,
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 53,
		},
		{
			code: '@-webkit-keyframes important { from { margin: 1px !important; } }',
			description: 'with !important',
			message: messages.rejected,
			line: 1,
			column: 51,
			endLine: 1,
			endColumn: 61,
		},
		{
			code: '@-WEBKIT-KEYFRAMES important { from { margin: 1px !important; } }',
			description: 'with !important',
			message: messages.rejected,
			line: 1,
			column: 51,
			endLine: 1,
			endColumn: 61,
		},
		{
			code: '@keyframes important { from { margin: 1px!important; } }',
			description: 'with !important',
			message: messages.rejected,
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: '@keyframes important { from { margin: 1px ! important; } }',
			description: 'with !important',
			message: messages.rejected,
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 54,
		},
		{
			code: '@kEyFrAmEs important { from { margin: 1px !important; } }',
			description: 'with !important',
			message: messages.rejected,
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 53,
		},
		{
			code: '@KEYFRAMES important { from { margin: 1px !important; } }',
			description: 'with !important',
			message: messages.rejected,
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 53,
		},
	],
});

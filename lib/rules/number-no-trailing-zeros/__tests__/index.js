'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	fix: true,
	accept: [
		{
			code: 'a { padding: 1px; }',
		},
		{
			code: 'a { padding: 10px; }',
		},
		{
			code: 'a { padding: 10.01px; }',
		},
		{
			code: 'a { padding: 10px 1px 1.05px 3.00003em; }',
		},
		{
			code: 'a { padding: 0.01px; }',
		},
		{
			code: 'a { padding: .01px; }',
		},
		{
			code: '@media (min-width: 100px) {}',
		},
		{
			code: '@import "0.10.css";',
		},
		{
			code: '@iMpOrT "0.10.css";',
		},
		{
			code: '@IMPORT "0.10.css";',
		},
		{
			code: '@import url(0.10.css);',
		},
		{
			code: 'a { background: url(data:image/svg+xml;...1.0); }',
			description: 'data URI containing trailing zero',
		},
		{
			code: 'a { background: uRl(data:image/svg+xml;...1.0); }',
			description: 'data URI containing trailing zero',
		},
		{
			code: 'a { background: URL(data:image/svg+xml;...1.0); }',
			description: 'data URI containing trailing zero',
		},
		{
			code: 'a { margin: 0.5em /* 1.600em */ 0.7em; }',
			description: 'should ignore comments',
		},
		{
			code: 'a::before { content: ".90em"; }',
			description: 'should ignore strings',
		},
		{
			code: 'a { my-string: "1.00"; }',
			description: "ignore all strings rather than only in 'content'",
		},
	],

	reject: [
		{
			code: 'a { padding: 1.0px; }',
			fixed: 'a { padding: 1px; }',
			message: messages.rejected,
			line: 1,
			column: 16,
		},
		{
			code: 'a { padding: 1.000px; }',
			fixed: 'a { padding: 1px; }',
			message: messages.rejected,
			line: 1,
			column: 16,
		},
		{
			code: 'a { padding: 10.0px; }',
			fixed: 'a { padding: 10px; }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { padding: 10.010px; }',
			fixed: 'a { padding: 10.01px; }',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { padding: 0.010px; }',
			fixed: 'a { padding: 0.01px; }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { padding: .010px; }',
			fixed: 'a { padding: .01px; }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { transform: translate(2px, 0.40px); }',
			fixed: 'a { transform: translate(2px, 0.4px); }',
			message: messages.rejected,
			line: 1,
			column: 34,
		},
		{
			code: 'a { transform: translate(2.0px, 0.40px); }',
			fixed: 'a { transform: translate(2px, 0.4px); }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 28,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 36,
				},
			],
		},
		{
			code: 'a { padding: 10px 1px 10.010px 3.00003em; }',
			fixed: 'a { padding: 10px 1px 10.01px 3.00003em; }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 28,
				},
			],
		},
		{
			code: 'a { padding: 10px 1px 10.01px 3.000030em; }',
			fixed: 'a { padding: 10px 1px 10.01px 3.00003em; }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 38,
				},
			],
		},
		{
			code: 'a { padding: 10px 1px 10.010px 3.000030em; }',
			fixed: 'a { padding: 10px 1px 10.01px 3.00003em; }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 28,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 39,
				},
			],
		},
		{
			code: '@media (min-width: 100.0px) {}',
			fixed: '@media (min-width: 100px) {}',
			message: messages.rejected,
			line: 1,
			column: 24,
		},
	],
});

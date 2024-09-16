import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: 'a:nth-child(1) {}',
		},
		{
			code: 'a:nth-child(0n+1) {}',
		},
		{
			code: 'a:nth-child(0n-1) {}',
		},
		{
			code: 'a:nth-child(2n+0) {}',
		},
		{
			code: 'a:nth-child(2n+2) {}',
		},
		{
			code: 'a:nth-child(2n-0) {}',
		},
		{
			code: 'a:nth-child(1 of a) {}',
		},
		{
			code: 'a:nth-last-child(1) {}',
		},
		{
			code: 'a:nth-of-type(1) {}',
		},
		{
			code: 'a:nth-last-of-type(1) {}',
		},
		{
			code: 'a:nth-child(even) {}',
		},
		{
			code: 'a:nth-child(3n + - 6) {}',
			description: 'CSSTree parse error not flagged',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-anb-no-unmatchable */
				a:nth-child(0), /* stylelint-disable-next-line selector-anb-no-unmatchable */
				b:nth-child(0),
				/* stylelint-disable-next-line selector-anb-no-unmatchable */
				c:nth-child(0)
				{}
			`,
		},
	],

	reject: [
		{
			code: 'a:nth-child(0) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a:nth-child(0n) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'a:nth-child(+0n) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a:nth-child(-0n) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a:nth-child(0n+0) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a:nth-child(0n + 0) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a:nth-child(0n-0) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'a:nth-child(-0n-0) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a:nth-child(0 of a) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a:nth-child(0), a:nth-child(1) {}',
			message: messages.rejected(':nth-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a:nth-last-child(0) {}',
			message: messages.rejected(':nth-last-child'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a:nth-of-type(0) {}',
			message: messages.rejected(':nth-of-type'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 17,
		},
		{
			code: 'a:nth-last-of-type(0) {}',
			message: messages.rejected(':nth-last-of-type'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: stripIndent`
				/* a comment */
				a:nth-child(0), /* a comment */
				b:nth-child(0),
				/* a comment */
				c:nth-child(0),
				/* a comment */ d:nth-child(0)
				{}
			`,
			warnings: [
				{
					message: messages.rejected(':nth-child'),
					line: 2,
					column: 2,
					endLine: 2,
					endColumn: 15,
				},
				{
					message: messages.rejected(':nth-child'),
					line: 3,
					column: 2,
					endLine: 3,
					endColumn: 15,
				},
				{
					message: messages.rejected(':nth-child'),
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 15,
				},
				{
					message: messages.rejected(':nth-child'),
					line: 6,
					column: 18,
					endLine: 6,
					endColumn: 31,
				},
			],
		},
	],
});

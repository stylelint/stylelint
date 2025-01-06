import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@custom-media --foo (max-width: 30em); @media (--foo) {};',
		},
		{
			code: '@CUSTOM-MEDIA --foo (max-width: 30em); @media (--foo) {};',
		},
		{
			code: '@cUStOM-mEDiA --foo (max-width: 30em); @media (--foo) {};',
		},
		{
			code: stripIndent`
				@custom-media --modern (color), (hover);
				@media (--modern) and (width > 1024px) {}
			`,
		},
		{
			code: stripIndent`
				@custom-media --narrow-window (max-width: 30em);
				@media (--narrow-window) {}
				@media (--narrow-window) and (script) {}
			`,
		},
		{
			code: '@keyframes foo {} a { animation-name: foo; }',
			description: 'at-rule other than media and custom-media',
		},
		{
			code: '@media screen and (--bar) {}; @custom-media --bar (max-width: 30em);',
			description: 'custom-media can be used before its declaration',
		},
	],

	reject: [
		{
			code: '@custom-media --foo (max-width: 30em); @media screen and (--bar) {};',
			message: messages.rejected('--bar'),
			line: 1,
			column: 59,
			endLine: 1,
			endColumn: 64,
		},
		{
			code: '@custom-media --foo (max-width: 30em); @media (--bar) {};',
			message: messages.rejected('--bar'),
			line: 1,
			column: 48,
			endLine: 1,
			endColumn: 53,
		},
		{
			code: '@media (--bar) {};',
			message: messages.rejected('--bar'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: '@media (--bar), (--baz) {};',
			warnings: [
				{ message: messages.rejected('--bar'), line: 1, column: 9, endLine: 1, endColumn: 14 },
				{ message: messages.rejected('--baz'), line: 1, column: 18, endLine: 1, endColumn: 23 },
			],
		},
		{
			code: '@media (--bar), (min-width: 40rem) {};',
			message: messages.rejected('--bar'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: stripIndent`
				@custom-media --narrow-window (max-width: 30em);
				@media (--narrow-windows) {}
				@media (--narrow-window) and (script) {}
			`,
			message: messages.rejected('--narrow-windows'),
			line: 2,
			column: 9,
			endLine: 2,
			endColumn: 25,
		},
	],
});

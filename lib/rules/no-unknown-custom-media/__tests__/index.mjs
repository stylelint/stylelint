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
				@media (--modern) and (width > 1024px) {
					.a { color: green; }
				}`,
		},
		{
			code: stripIndent`
				@custom-media --narrow-window (max-width: 30em);

				@media (--narrow-window) {
				/* narrow window styles */
				}
				@media (--narrow-window) and (script) {
				/* special styles for when script is allowed */
				}
				/* etc */
			`,
		},
		{
			code: '@keyframes foo {} a { animation-name: foo; }',
			description: 'at-rule other than media and custom-media',
		},
	],

	reject: [
		{
			code: '@custom-media --foo (max-width: 30em); @media screen and (--bar) {};',
			message: messages.expected('--bar'),
			line: 1,
			column: 47,
			endColumn: 53,
			endLine: 1,
		},
		{
			code: '@custom-media --foo (max-width: 30em); @media (--bar) {};',
			message: messages.expected('--bar'),
			line: 1,
			column: 47,
			endColumn: 53,
			endLine: 1,
		},
		{
			code: '@media (--bar) {};',
			message: messages.expected('--bar'),
			line: 1,
			column: 8,
			endColumn: 14,
			endLine: 1,
		},
		{
			code: '@media (--bar), (min-width: 40rem) {};',
			message: messages.expected('--bar'),
			line: 1,
			column: 8,
			endColumn: 14,
			endLine: 1,
		},
		{
			code: stripIndent`
				@custom-media --narrow-window (max-width: 30em);

				@media (--narrow-windows) {
				/* narrow window styles */
				}
				@media (--narrow-window) and (script) {
				/* special styles for when script is allowed */
				}
				/* etc */
			`,
			message: messages.expected('--narrow-windows'),
			line: 3,
			column: 8,
			endColumn: 25,
			endLine: 3,
		},
	],
});

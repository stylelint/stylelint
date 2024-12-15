import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: '@counter-style foo { system: cyclic; symbols: url(bar.svg); suffix: " "; }',
		},
		{
			code: '@property --foo { syntax: "<integer>"; inherits: false; initial-value: 0; }',
		},
		// TODO: The following test can be supported once mdn/data, is updated and the css-tree is updated.
		// see: https://github.com/mdn/data/blob/6b4cae7c0aa96c199a982f2b6efeda7ce67eb515/css/at-rules.json
		{
		  code: '@view-transition { navigation: auto; }',
		  skip: true
		},
		// {
		code: '@media (width > 400px) { a { color: red; } }',
	],

	reject: [
		{
			code: '@counter-style foo { bar: 0; }',
			message: messages.rejected('@counter-style', 'bar'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: '@property --foo { bar: 0; }',
			message: messages.rejected('@property', 'bar'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 26,
		},
		// TODO: The following test can be supported once mdn/data, is updated and the css-tree is updated.
		// see: https://github.com/mdn/data/blob/6b4cae7c0aa96c199a982f2b6efeda7ce67eb515/css/at-rules.json
		// {
		// 	code: stripIndent`
		// 		@container (width > 400px) and (height > 400px) {
		// 			a {
		// 				foo: 0;
		// 			}
		// 		}
		// 	`,
		// 	message: messages.rejected('@container', 'foo'),
		// 	line: 3,
		// 	column: 3,
		// 	endLine: 3,
		// 	endColumn: 10,
		// },
		// {
		// 	code: stripIndent`
		// 		@container not (width > 400px) {
		// 			a {
		// 				foo: 0;
		// 			}
		// 		}
		// 	`,
		// 	message: messages.rejected('@container', 'foo'),
		// 	line: 3,
		// 	column: 3,
		// 	endLine: 3,
		// 	endColumn: 10,
		// },
		// {
		// 	code: stripIndent`
		// 		@container summary (min-width > 400px) {
		// 			@container (min-width: 800px) {
		// 				a {
		// 					foo: 0;
		// 				}
		// 			}
		// 		}
		// 	`,
		// 	warnings: [
		// 		{
		// 			message: messages.rejected('@container', 'foo'),
		// 			line: 4,
		// 			column: 4,
		// 			endLine: 4,
		// 			endColumn: 11,
		// 		},
		// 		{
		// 			message: messages.rejected('@container', 'foo'),
		// 			line: 4,
		// 			column: 4,
		// 			endLine: 4,
		// 			endColumn: 11,
		// 		},
		// 	],
		// },
	],
});

import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: true,

	accept: [
		{
			code: '@property {}',
			description: 'No syntax definition',
		},
		{
			code: '@foo { syntax: "<bar>"; }',
			description: 'Non @property at-rule, should be ignored',
		},
		{
			code: '@property { syntax: "<color>"; }',
			description: 'Single known syntax',
		},
		{
			code: '@property { syntax: "<length> | <percentage>"; }',
			description: 'Multiple data types with "|"',
		},
		{
			code: '@property { syntax: "<color>+"; }',
			description: 'Space-separated list with "+"',
		},
		{
			code: '@property { syntax: "<length>#"; }',
			description: 'Comma-separated list with "#"',
		},
		{
			code: '@property { syntax: "<length> | <color># | <percentage>"; }',
			description: 'Multiple data types with "|"',
		},
		{
			code: '@property { syntax: "small | medium | large"; }',
			description: 'Keywords',
		},
		{
			code: '@property { syntax: "<length> | auto"; }',
			description: 'Combination of data type and keyword',
		},
		{
			code: '@property { syntax: "foo | <color>"; }',
			description: 'Multiple data types with "|": custom ident "foo" or <color>',
		},
		{
			code: '@property { syntax: "<length> | <color>#"; }',
			description: 'Multiple data types with "|": <length> or comma-separated <color>',
		},
		{
			code: '@property { syntax: "*"; }',
			description: 'Universal syntax value',
		},
	],

	reject: [
		{
			code: '@property { syntax: "<alpha-value>" }',
			description: 'Using <alpha-value> (exists, not allowed)',
			message: messages.rejected('"<alpha-value>"'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: '@property { syntax: "<foo>" }',
			description: 'Unknown syntax name <foo>',
			message: messages.rejected('"<foo>"'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: '@property { syntax: "<length> | <foo>" }',
			description: 'One known syntax plus an unknown syntax',
			message: messages.rejected('"<length> | <foo>"'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: '@property { syntax: "<alpha-value>+" }',
			description: 'Uses <alpha-value> but with a plus sign, still not allowed',
			message: messages.rejected('"<alpha-value>+"'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: '@property { syntax: "<foo> | <bar>" }',
			description: 'Two unknown syntax names)',
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 36,
			message: messages.rejected('"<foo> | <bar>"'),
		},
		{
			code: '@property { syntax: "<length> || <color>"; }',
			description: 'Use "||" as combinator, not allowed',
			message: messages.rejected('"<length> || <color>"'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: '@property { syntax: "<length>*"; }',
			description: 'Use "*" as multiplier, not allowed',
			message: messages.rejected('"<length>*"'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 32,
		},
	],
});

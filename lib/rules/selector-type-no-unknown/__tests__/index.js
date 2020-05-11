'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'input {}',
		},
		{
			code: 'acronym {}',
		},
		{
			code: 'HGrOuP {}',
		},
		{
			code: 'iNpUt {}',
		},
		{
			code: 'INPUT {}',
		},
		{
			code: 'ul li {}',
		},
		{
			code: 'ul > li {}',
		},
		{
			code: 'ul + li {}',
		},
		{
			code: 'ul ~ li {}',
		},
		{
			code: '@media only screen and (min-width: 35em) { a {} }',
		},
		{
			code: 'a.class {}',
		},
		{
			code: 'a#id {}',
		},
		{
			code: 'a:hover {}',
		},
		{
			code: 'a::before {}',
		},
		{
			code: 'a[target] {}',
		},
		{
			code: ':lang(en) {}',
		},
		{
			code: 'a:nth-of-type(n) {}',
		},
		{
			code: 'a:nth-child(n) {}',
		},
		{
			code: 'input:not(*) {}',
		},
		{
			code: 'input:not(:checked) {}',
		},
		{
			code: 'input:first-child:not(:checked) {}',
		},
		{
			code: 'input:not(:nth-child(2n+1)) {}',
		},
		{
			code: ':not(::first-line) {}',
		},
		{
			code: 'circle {}',
			description: 'svg tags',
		},
		{
			code: 'foreignObject {}',
			description: 'case-sensitive svg tags',
		},
		{
			code: '@media keyframes { 0.0% {} 49.1% {} 100% {} }',
			description: 'standard usage of keyframe selectors',
		},
		{
			code: '@media keyframes { 0%, 50.001%, 100% {} }',
			description: 'standard usage of complex keyframe selectors',
		},
		{
			code: '@include keyframes(identifier) { 0% {} 100% {} }',
			description: 'non-standard usage of keyframe selectors',
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
		{
			code: 'abs {}',
			description: 'MathML tags',
		},
		{
			code: '.foo /deep/ .bar {}',
			description: 'shadow-piercing descendant combinator',
		},
		{
			code: '.foo /dEeP/ .bar {}',
			description: 'shadow-piercing descendant combinator',
		},
		{
			code: '.foo /DEEP/ .bar {}',
			description: 'shadow-piercing descendant combinator',
		},
		{
			code: '.foo /for/ .bar {}',
			description: 'reference combinators',
		},
	],

	reject: [
		{
			code: 'unknown {}',
			message: messages.rejected('unknown'),
			line: 1,
			column: 1,
		},
		{
			code: 'uNkNoWn {}',
			message: messages.rejected('uNkNoWn'),
			line: 1,
			column: 1,
		},
		{
			code: 'UNKNOWN {}',
			message: messages.rejected('UNKNOWN'),
			line: 1,
			column: 1,
		},
		{
			code: 'ul unknown {}',
			message: messages.rejected('unknown'),
			line: 1,
			column: 4,
		},
		{
			code: 'unknown[target] {}',
			message: messages.rejected('unknown'),
			line: 1,
			column: 1,
		},
		{
			code: 'unknown:nth-child(even) {}',
			message: messages.rejected('unknown'),
			line: 1,
			column: 1,
		},
		{
			code: '@media only screen and (min-width: 35em) { unknown {} }',
			message: messages.rejected('unknown'),
			line: 1,
			column: 44,
		},
		{
			code: 'input:not(unknown) {}',
			message: messages.rejected('unknown'),
			line: 1,
			column: 11,
		},
		{
			code: 'x-Foo {}',
			description: 'invalid custom element',
			message: messages.rejected('x-Foo'),
			line: 1,
			column: 1,
		},
		{
			code: 'X-foo {}',
			description: 'invalid custom element',
			message: messages.rejected('X-foo'),
			line: 1,
			column: 1,
		},
		{
			code: 'X-FOO {}',
			description: 'invalid custom element',
			message: messages.rejected('X-FOO'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'scss',

	accept: [
		{
			code: '.foo { &-bar {} }',
		},
		{
			code: '#{$variable} {}',
		},
		{
			code: '%foo {}',
			description: 'ignore placeholder selector',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'less',

	accept: [
		{
			code: '@foo: {};',
			description: 'less detached rulesets',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreTypes: ['unknown', '/^my-/', '/^your-/i'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: 'unknown {}',
		},
		{
			code: 'my-type {}',
		},
		{
			code: 'my-other-type {}',
		},
		{
			code: 'your-type {}',
		},
		{
			code: 'YOUR-TYPE {}',
		},
	],

	reject: [
		{
			code: 'tag {}',
			message: messages.rejected('tag'),
			line: 1,
			column: 1,
		},
		{
			code: 'uNkNoWn {}',
			message: messages.rejected('uNkNoWn'),
			line: 1,
			column: 1,
		},
		{
			code: 'UNKNOWN {}',
			message: messages.rejected('UNKNOWN'),
			line: 1,
			column: 1,
		},
		{
			code: 'notmytype {}',
			message: messages.rejected('notmytype'),
			line: 1,
			column: 1,
		},
		{
			code: 'notyour-type {}',
			message: messages.rejected('notyour-type'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreTypes: [/^my-/] }],
	skipBasicChecks: true,

	accept: [
		{
			code: 'my-type {}',
		},
	],

	reject: [
		{
			code: 'tag {}',
			message: messages.rejected('tag'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreNamespaces: ['unknown', '/^my-/'] }],

	accept: [
		{
			code: 'unknown|tag {}',
		},
		{
			code: 'my-namespace|tag {}',
		},
		{
			code: 'my-other-namespace|tag {}',
		},
	],

	reject: [
		{
			code: 'tag {}',
			message: messages.rejected('tag'),
			line: 1,
			column: 1,
		},
		{
			code: 'uNkNoWn|tag {}',
			message: messages.rejected('tag'),
			line: 1,
			column: 9,
		},
		{
			code: 'UNKNOWN|tag {}',
			message: messages.rejected('tag'),
			line: 1,
			column: 9,
		},
		{
			code: 'namespace|tag {}',
			message: messages.rejected('tag'),
			line: 1,
			column: 11,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreNamespaces: [/^my-/] }],

	accept: [
		{
			code: 'my-namespace|tag {}',
		},
	],

	reject: [
		{
			code: 'namespace|tag {}',
			message: messages.rejected('tag'),
			line: 1,
			column: 11,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['default-namespace'] }],

	accept: [
		{
			code: 'unknown {}',
		},
		{
			code: 'namespaced|a {}',
		},
	],

	reject: [
		{
			code: 'namespace|unknown {}',
			message: messages.rejected('unknown'),
			line: 1,
			column: 11,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['custom-elements'] }],

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'x-foo {}',
			description: 'custom element',
		},
	],

	reject: [
		{
			code: 'unknown {}',
			message: messages.rejected('unknown'),
			line: 1,
			column: 1,
		},
		{
			code: 'x-Foo {}',
			description: 'invalid custom element',
			message: messages.rejected('x-Foo'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'css-in-js',

	accept: [
		{
			code:
				"import styled from 'styled-components';\nexport default styled.div` ${/* sc-selector */ Button} {} `;",
		},
	],

	reject: [
		{
			code: "import styled from 'styled-components';\nexport default styled.div` unknown {} `;",
			message: messages.rejected('unknown'),
			line: 2,
			column: 28,
		},
	],
});

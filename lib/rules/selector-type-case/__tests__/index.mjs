import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['lower'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a {}',
		},
		{
			code: 'a::before {}',
		},
		{
			code: '&a {}',
		},
		{
			code: '.foo {}',
		},
		{
			code: '#bar {}',
		},
		{
			code: '.FOO {}',
		},
		{
			code: '#BAR {}',
		},
		{
			code: 'a.FOO {}',
		},
		{
			code: 'a b {}',
		},
		{
			code: 'a { & b {}}',
		},
		{
			code: 'a, b, * {}',
		},
		{
			code: 'a:nth-child(3n + 1) {}',
		},
		{
			code: 'a:nth-child(n) {}',
		},
		{
			code: 'a:nth-child(odd) {}',
		},
		{
			code: 'a:nth-child(even) {}',
		},
		{
			code: 'a:nth-child(-n) {}',
		},
		{
			code: 'a { &:nth-child(3n + 1) {} }',
		},
		{
			code: '@keyframes spin { 0% {} }',
		},
		{
			code: '@keyframes spin { to {} from {} }',
		},
		{
			code: '@include keyframes(identifier) { TO, 50.0% {} 50.01% {} 100% {} }',
			description: 'non-standard usage of keyframe selectors',
		},
		{
			code: '@keyframes a { ENTRY 0%, EXIT 48.59% {} }',
			message: 'Keyframes with named timeline ranges',
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
			code: 'a, /*comments */\n b {}',
			description: 'comments in the selector',
		},
		{
			code: 'a /*comments */\n b {}',
			description: 'comments in the selector',
		},
		{
			code: 'foreignObject {}',
			description: 'valid mixed-case svg elements',
		},
		{
			code: 'html textPath { fill: red; }',
			description: 'valid mixed-case svg elements',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-type-case */
				A, /* stylelint-disable-next-line selector-type-case */
				A,
				/* stylelint-disable-next-line selector-type-case */
				A
				{}
			`,
		},
	],

	reject: [
		{
			code: 'A {}',
			fixed: 'a {}',
			fix: {
				range: [0, 1],
				text: 'a',
			},
			message: messages.expected('A', 'a'),
		},
		{
			code: 'DIV::before {}',
			fixed: 'div::before {}',
			fix: {
				range: [0, 3],
				text: 'div',
			},
			message: messages.expected('DIV', 'div'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a B {}',
			fixed: 'a b {}',
			fix: {
				range: [2, 3],
				text: 'b',
			},
			message: messages.expected('B', 'b'),
		},
		{
			code: 'a { & B {}}',
			fixed: 'a { & b {}}',
			fix: {
				range: [6, 7],
				text: 'b',
			},
			message: messages.expected('B', 'b'),
		},
		{
			code: 'A:nth-child(even) {}',
			fixed: 'a:nth-child(even) {}',
			fix: {
				range: [0, 1],
				text: 'a',
			},
			message: messages.expected('A', 'a'),
		},
		{
			code: 'A:nth-child(-n) {}',
			fixed: 'a:nth-child(-n) {}',
			fix: {
				range: [0, 1],
				text: 'a',
			},
			message: messages.expected('A', 'a'),
		},
		{
			code: 'A { &:nth-child(3n + 1) {} }',
			fixed: 'a { &:nth-child(3n + 1) {} }',
			fix: {
				range: [0, 1],
				text: 'a',
			},
			message: messages.expected('A', 'a'),
		},
		{
			code: 'a /*comments */\n B {}',
			fixed: 'a /*comments */\n b {}',
			fix: {
				range: [17, 18],
				text: 'b',
			},
			message: messages.expected('B', 'b'),
		},
		{
			code: stripIndent`
				/* a comment */
				A, /* a comment */
				A,
				/* a comment */
				A
				{}
			`,
			fixed: stripIndent`
				/* a comment */
				a, /* a comment */
				a,
				/* a comment */
				a
				{}
			`,
			warnings: [
				{
					message: messages.expected('A', 'a'),
					fix: {
						range: [16, 17],
						text: 'a',
					},
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 2,
				},
				{
					message: messages.expected('A', 'a'),
					fix: undefined,
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 2,
				},
				{
					message: messages.expected('A', 'a'),
					fix: undefined,
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 2,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'A {}',
		},
		{
			code: 'A::before {}',
		},
		{
			code: '&A {}',
		},
		{
			code: '&LI {}',
		},
		{
			code: '.foo {}',
		},
		{
			code: '#bar {}',
		},
		{
			code: '.FOO {}',
		},
		{
			code: '#BAR {}',
		},
		{
			code: 'A.FOO {}',
		},
		{
			code: 'A B {}',
		},
		{
			code: 'A { & B {}}',
		},
		{
			code: 'A, B, * {}',
		},
		{
			code: 'A:nth-child(3n + 1) {}',
		},
		{
			code: 'A:nth-child(n) {}',
		},
		{
			code: 'A:nth-child(odd) {}',
		},
		{
			code: 'A:nth-child(even) {}',
		},
		{
			code: 'A:nth-child(-n) {}',
		},
		{
			code: 'A { &:nth-child(3n + 1) {} }',
		},
		{
			code: '@keyframes spin { 0% {} }',
		},
		{
			code: '@keyframes spin { to {} from {} }',
		},
		{
			code: ':root { --custom-property-set: {} }',
		},
		{
			code: 'A, /*comments */\n B {}',
			description: 'comments in the selector',
		},
		{
			code: 'A /*comments */\n B {}',
			description: 'comments in the selector',
		},
	],

	reject: [
		{
			code: 'a {}',
			fixed: 'A {}',
			fix: {
				range: [0, 1],
				text: 'A',
			},
			message: messages.expected('a', 'A'),
		},
		{
			code: 'div::before {}',
			fixed: 'DIV::before {}',
			fix: {
				range: [0, 3],
				text: 'DIV',
			},
			message: messages.expected('div', 'DIV'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 4,
		},
		{
			code: 'a B {}',
			fixed: 'A B {}',
			fix: {
				range: [0, 1],
				text: 'A',
			},
			message: messages.expected('a', 'A'),
		},
		{
			code: 'a { & B {}}',
			fixed: 'A { & B {}}',
			fix: {
				range: [0, 1],
				text: 'A',
			},
			message: messages.expected('a', 'A'),
		},
		{
			code: 'a:nth-child(even) {}',
			fixed: 'A:nth-child(even) {}',
			fix: {
				range: [0, 1],
				text: 'A',
			},
			message: messages.expected('a', 'A'),
		},
		{
			code: 'a:nth-child(-n) {}',
			fixed: 'A:nth-child(-n) {}',
			fix: {
				range: [0, 1],
				text: 'A',
			},
			message: messages.expected('a', 'A'),
		},
		{
			code: 'a { &:nth-child(3n + 1) {} }',
			fixed: 'A { &:nth-child(3n + 1) {} }',
			fix: {
				range: [0, 1],
				text: 'A',
			},
			message: messages.expected('a', 'A'),
		},
		{
			code: 'A, /*comments */\n b {}',
			fixed: 'A, /*comments */\n B {}',
			fix: {
				range: [18, 19],
				text: 'B',
			},
			message: messages.expected('b', 'B'),
		},
		{
			code: 'A /*comments */\n b {}',
			fixed: 'A /*comments */\n B {}',
			fix: {
				range: [17, 18],
				text: 'B',
			},
			message: messages.expected('b', 'B'),
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	customSyntax: 'postcss-scss',
	fix: true,

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
		{
			code: '.foo, %foo {}',
		},
	],
});

testRule({
	ruleName,
	config: ['lower', { ignoreTypes: ['$childClass', '/(p|P)arent.*/', /foo$/i] }],
	computeEditInfo: true,

	accept: [
		{
			code: 'myParentClass { color: pink; }',
		},
		{
			code: '$childClass { color: pink; }',
		},
		{
			code: 'myFoo { color: pink; }',
		},
	],

	reject: [
		{
			code: 'DIV::before {}',
			fixed: 'div::before {}',
			fix: {
				range: [0, 3],
				text: 'div',
			},
			message: messages.expected('DIV', 'div'),
		},
	],
});

import { stripIndent } from 'common-tags';

import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [1],

	accept: [
		{
			code: 'a { b { top: 0; }}',
		},
		{
			code: '@media print { a { b { top: 0; }}}',
		},
		{
			code: 'a { top: 0; b { top: 0; }}',
		},
		{
			code: 'a { @nest b { top: 0; }}',
		},
		{
			code: 'a { b { @include foo; } }',
			description: 'at-rule without block',
		},
	],

	reject: [
		{
			code: 'a { b { c { top: 0; }}}',
			message: messages.expected(1),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@media print { a { b { c { top: 0; }}}}',
			message: messages.expected(1),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: 'a { top: 0; b { top: 0; c { top: 0; }}}',
			message: messages.expected(1),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 38,
		},
		{
			code: 'a { b { top: 0; c { top: 0; }} top: 0; }',
			message: messages.expected(1),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { @nest b { c { top: 0; }}}',
			message: messages.expected(1),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 28,
		},
	],
});

testRule({
	ruleName,
	config: [3],

	accept: [
		{
			code: 'a { b { c { d { top: 0; }}}}',
		},
		{
			code: '@media print { a { b { c { d { top: 0; }}}}}',
		},
		{
			code: 'a { & > b { @media print { color: pink; }}}',
		},
		{
			code: 'a { & > b { & > c { @media print { color: pink; }}}}',
			description: messages.expected(3),
		},
	],

	reject: [
		{
			code: 'a { b { c { d { e { top: 0; }}}}}',
			message: messages.expected(3),
		},
	],
});

testRule({
	ruleName,
	config: [1, { ignore: ['blockless-at-rules'] }],

	accept: [
		{
			code: 'a { b { top: 0; }}',
		},
		{
			code: 'a { @media print { b { top: 0; }}}',
		},
		{
			code: 'a { @nest b { c { top: 0; }}}',
		},
	],

	reject: [
		{
			code: 'a { b { c { top: 0; }}}',
			message: messages.expected(1),
		},
		{
			code: 'a { @media print { b { c { top: 0; }}}}',
			message: messages.expected(1),
		},
		{
			code: 'a { @nest b { @nest c { top: 0; @nest d { bottom: 0; }}}}',
			message: messages.expected(1),
		},
	],
});

testRule({
	ruleName,
	config: [1, { ignore: ['pseudo-classes'] }],

	accept: [
		{
			code: 'a { b { top: 0; }}',
		},
		{
			code: 'a { b { &:hover { top: 0; }}}',
		},
		{
			code: 'a { b { &:nest { &:nest-lvl2 { top: 0; }}}}',
		},
		{
			code: 'a { &:hover { b { top: 0; }}}',
		},
		{
			code: 'a { b { &:hover { &:focus { &:otherone { top: 0; }}}}}',
		},
		{
			code: 'a { &:nest { &:nest-lvl2 { top: 0; b { bottom: 0; }}}}',
		},
		{
			code: 'a { b { &:hover c { top: 0; }}}',
		},
		{
			code: 'a { b { &:hover, &:focus { top: 0; }}}',
		},
	],

	reject: [
		{
			code: 'a { b { c { top: 0; }}}',
			message: messages.expected(1),
		},
		{
			code: 'a { &:hover { b { c { top: 0; }}}}',
			message: messages.expected(1),
		},
		{
			code: 'a { b { &:hover { &:focus { &:otherone { c { top: 0; }}}}}}',
			message: messages.expected(1),
		},
		{
			code: 'a { b { &::selection { color: #64FFDA; }}}',
			message: messages.expected(1),
		},
		{
			code: 'a { b { &:hover, c { top: 0; }}}',
			message: messages.expected(1),
		},
	],
});

testRule({
	ruleName,
	config: [1, { ignorePseudoClasses: ['hover', '/^--custom-.*$/'] }],

	accept: [
		{
			code: 'a { &:hover { b { top: 0; } } }',
		},
		{
			code: 'a { &:hover, &:--custom-pseudo { b { top: 0; } } }',
		},
	],

	reject: [
		{
			code: 'a { &:visited { b { top: 0; } } }',
			message: messages.expected(1),
			description: 'pseudo-class not ignored',
		},
		{
			code: 'a { &:--custom-pseudo, &:visited { b { top: 0; } } }',
			message: messages.expected(1),
			description: 'ignored pseudo-class alongside pseudo-class',
		},
		{
			code: 'a { &:hover, b { c { top: 0; } } }',
			message: messages.expected(1),
			description: 'pseudo-class alongside class',
		},
	],
});

testRule({
	ruleName,
	config: [1, { ignoreAtRules: ['media', '/^my-/'] }],

	accept: [
		{
			code: 'a { @media print { b { c { top: 0; }}}}',
		},
		{
			code: 'a { b { @media print { c { top: 0; }}}}',
		},
		{
			code: 'a { @my-at-rule print { b { c { top: 0; }}}}',
		},
		{
			code: 'a { @my-other-at-rule print { b { c { top: 0; }}}}',
		},
	],

	reject: [
		{
			code: 'a { @import print { b { top: 0; }}}',
			message: messages.expected(1),
		},
		{
			code: 'a { @my_at_rule print { b { top: 0; }}}',
			message: messages.expected(1),
		},
		{
			code: 'a { b { c { top: 0; }}}',
			message: messages.expected(1),
		},
	],
});

testRule({
	ruleName,
	config: [1, { ignoreAtRules: [/^my-/] }],

	accept: [
		{
			code: 'a { @my-at-rule print { b { c { top: 0; }}}}',
		},
	],

	reject: [
		{
			code: 'a { @my_at_rule print { b { top: 0; }}}',
			message: messages.expected(1),
		},
	],
});

testRule({
	ruleName,
	config: [1],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '.foo { .bar { margin: { bottom: 0; } } }',
			description: 'SCSS nested properties',
		},
	],
});

testRule({
	ruleName,
	config: [1],
	customSyntax: 'postcss-sass',

	accept: [
		{
			code: stripIndent`
				@media print
					color: white
			`,
		},
	],
});

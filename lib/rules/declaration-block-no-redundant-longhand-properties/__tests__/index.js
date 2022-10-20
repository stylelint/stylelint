'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { margin-right: 10px; margin-top: 20px; }',
		},
		{
			code: 'a { margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }',
		},
		{
			code: 'a { margin-left: inherit; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }',
		},
		{
			code: 'a { padding-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }',
		},
		{
			code: 'a { padding-top: 1px; padding-bottom: 1px; } b { padding-left: 1px; padding-right: 1px; }',
		},
		{
			code: 'a { transition-delay: 0.5s; -webkit-transition-duration: 2s; -webkit-transition-property: top; -webkit-transition-timing-function: ease; }',
			description: 'one of properties is unprefixed',
		},
		{
			code: 'a { -webkit-transition-delay: 0.5s; transition-duration: 2s; transition-property: top; transition-timing-function: ease; }',
			description: 'one of properties is prefixed',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }',
			message: messages.expected('margin'),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 75,
		},
		{
			code: 'a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; margin-top: 20px; margin-bottom: 30px; }',
			message: messages.expected('margin'),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 75,
		},
		{
			code: 'a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; MARGIN-TOP: 20px; MARGIN-BOTTOM: 30px; }',
			message: messages.expected('margin'),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 75,
		},
		{
			code: 'a { padding-left: 10px; padding-right: 10px; padding-top: 20px; padding-bottom: 30px; }',
			message: messages.expected('padding'),
			line: 1,
			column: 65,
			endLine: 1,
			endColumn: 79,
		},
		{
			code: 'a { font-style: italic; font-variant: normal; font-weight: bold; font-size: .8em; font-family: Arial; line-height: 1.2; font-stretch: normal; }',
			message: messages.expected('font'),
			line: 1,
			column: 121,
			endLine: 1,
			endColumn: 133,
		},
		{
			code: 'a { border-top-width: 7px; border-top-style: double; border-top-color: green; }',
			message: messages.expected('border-top'),
			line: 1,
			column: 54,
			endLine: 1,
			endColumn: 70,
		},
		{
			code: 'a { -webkit-transition-delay: 0.5s; -webkit-transition-duration: 2s; -webkit-transition-property: top; -webkit-transition-timing-function: ease; }',
			message: messages.expected('-webkit-transition'),
			line: 1,
			column: 104,
			endLine: 1,
			endColumn: 138,
		},
		{
			code: 'a { -WEBKIT-transition-delay: 0.5s; -webKIT-transition-duration: 2s; -webkit-TRANSITION-property: top; -webkit-transition-timing-function: ease; }',
			message: messages.expected('-webkit-transition'),
			line: 1,
			column: 104,
			endLine: 1,
			endColumn: 138,
		},
		{
			code: 'a { border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; }',
			message: messages.expected('border-width'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreShorthands: ['/border/', 'padding'] }],

	accept: [
		{
			code: 'a { border-top-width: 7px; border-top-style: double; border-top-color: green; }',
		},
		{
			code: 'a { padding-left: 10px; padding-right: 10px; padding-top: 20px; padding-bottom: 30px; }',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }',
			message: messages.expected('margin'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreShorthands: [/border/] }],

	accept: [
		{
			code: 'a { border-top-width: 7px; border-top-style: double; border-top-color: green; }',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }',
			message: messages.expected('margin'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-html',

	accept: [
		{
			code: '<style>a { margin-right: 10px; margin-top: 20px; }</style>',
		},
		{
			code: '<a style="margin-right: 10px; margin-top: 20px;"></a>',
		},
		{
			code: '<a style="margin-left: 10px; margin-right: 10px;"></a><a style="margin-top: 20px; margin-bottom: 30px;"></a>',
		},
	],

	reject: [
		{
			code: '<style>p { margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }</style>',
			message: messages.expected('margin'),
		},
		{
			code: '<a style="margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px;"></a>',
			message: messages.expected('margin'),
		},
	],
});

testRule({
	skip: true,
	ruleName,
	config: [true],
	customSyntax: 'postcss-css-in-js',

	accept: [
		{
			code: "import styled from 'react-emotion'\nexport default styled.div` margin-right: 10px; margin-top: 20px; `;",
		},
	],

	reject: [
		{
			code: "import styled from 'styled-components';\nexport default styled.div` margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; `;",
			message: messages.expected('margin'),
		},
		{
			code: "import styled from 'react-emotion'\nexport default styled.div` margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; `;",
			message: messages.expected('margin'),
		},
	],
});

'use strict';

const naiveCssInJs = require('../../../__tests__/fixtures/postcss-naive-css-in-js');

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	fix: true,

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
		{
			code: 'a { inset: 0; }',
		},
		{
			code: 'a { inset: 1px 2px; }',
		},
		{
			code: 'a { inset: 1px 2px 3px; }',
		},
		{
			code: 'a { inset: 1px 2px 3px 4px; }',
		},
		{
			code: 'a { top: 0; right: 0; bottom: 0; }',
		},
		{
			code: 'a { top: 0; right: 0; bottom: initial; left: 0; }',
			description: 'contains basic keyword (initial)',
		},
		{
			code: 'a { margin-top: 0; margin-right: 0; margin-bottom: unset; margin-left: 0; }',
			description: 'contains basic keyword (unset)',
		},
		{
			code: 'a { transition-delay: 500ms, 1s; transition-duration: 250ms,2s; transition-timing-function: ease-in-out; transition-property: inherit; }',
			description: 'transition property contains basic keyword (inherit)',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }',
			fixed: 'a { margin: 20px 10px 30px 10px; }',
			message: messages.expected('margin'),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 75,
		},
		{
			code: 'a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; margin-top: 20px; margin-bottom: 30px; }',
			fixed: 'a { margin: 20px 10px 30px 10px; }',
			message: messages.expected('margin'),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 75,
		},
		{
			code: 'a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; MARGIN-TOP: 20px; MARGIN-BOTTOM: 30px; }',
			fixed: 'a { margin: 20px 10px 30px 10px; }',
			message: messages.expected('margin'),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 75,
		},
		{
			code: 'a { padding-left: 10px; padding-right: 10px; padding-top: 20px; padding-bottom: 30px; }',
			fixed: 'a { padding: 20px 10px 30px 10px; }',
			message: messages.expected('padding'),
			line: 1,
			column: 65,
			endLine: 1,
			endColumn: 79,
		},
		{
			code: 'a { font-style: italic; font-variant: normal; font-weight: bold; font-size: .8em; font-family: Arial; line-height: 1.2; font-stretch: normal; }',
			fixed: 'a { font: italic normal bold normal .8em 1.2 Arial; }',
			message: messages.expected('font'),
			line: 1,
			column: 121,
			endLine: 1,
			endColumn: 133,
		},
		{
			code: 'a { border-top-width: 7px; border-top-style: double; border-top-color: green; }',
			fixed: 'a { border-top: 7px double green; }',
			message: messages.expected('border-top'),
			line: 1,
			column: 54,
			endLine: 1,
			endColumn: 70,
		},
		{
			code: 'a { -webkit-transition-delay: 0.5s; -webkit-transition-duration: 2s; -webkit-transition-property: top; -webkit-transition-timing-function: ease; }',
			fixed: 'a { -webkit-transition: top 2s ease 0.5s; }',
			message: messages.expected('-webkit-transition'),
			line: 1,
			column: 104,
			endLine: 1,
			endColumn: 138,
		},
		{
			code: 'a { -WEBKIT-transition-delay: 0.5s; -webKIT-transition-duration: 2s; -webkit-TRANSITION-property: top; -webkit-transition-timing-function: ease; }',
			fixed: 'a { -webkit-transition: top 2s ease 0.5s; }',
			message: messages.expected('-webkit-transition'),
			line: 1,
			column: 104,
			endLine: 1,
			endColumn: 138,
		},
		{
			code: 'a { border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; }',
			fixed: 'a { border-width: 1px 1px 1px 1px; }',
			message: messages.expected('border-width'),
		},
		{
			code: 'a { top: 1px; right: 2px; bottom: 3px; left: 4px; }',
			fixed: 'a { inset: 1px 2px 3px 4px; }',
			message: messages.expected('inset'),
		},
		{
			code: 'a { top: 0; right: 0; bottom: 0; left: 0; }',
			fixed: 'a { inset: 0 0 0 0; }',
			message: messages.expected('inset'),
		},
		{
			code: 'a { grid-template-rows: var(--header-h) 1fr var(--footer-h); grid-template-columns: var(--toolbar-w) 1fr; grid-template-areas: "header header" "toolbar main" "footer footer"; }',
			fixed:
				'a { grid-template: "header header" var(--header-h) "toolbar main" 1fr "footer footer" var(--footer-h) / var(--toolbar-w) 1fr; }',
			description: 'custom resolver for grid-template',
			message: messages.expected('grid-template'),
		},
		{
			code: 'a { transition-delay: 500ms,    1s; transition-duration: 250ms,2s; transition-timing-function: ease-in-out; transition-property: transform, visibility; }',
			fixed: 'a { transition: transform 250ms ease-in-out 500ms, visibility 2s ease-in-out 1s; }',
			description:
				'custom resolver for transition - multiple properties, delays, durations, timing-functions',
			message: messages.expected('transition'),
		},
		{
			code: 'a { transition-delay: 500ms; transition-duration: 250ms; transition-timing-function: ease-in-out; transition-property: transform, visibility; }',
			fixed:
				'a { transition: transform 250ms ease-in-out 500ms, visibility 250ms ease-in-out 500ms; }',
			description:
				'custom resolver for transition - multiple properties, single delay/duration/timing-function',
			message: messages.expected('transition'),
		},
		{
			code: 'a { transition-delay: 500ms, 1s, 1.5s; transition-duration: 250ms, 0.5s; transition-timing-function: ease-in-out; transition-property: transform, visibility, padding; }',
			fixed:
				'a { transition: transform 250ms ease-in-out 500ms, visibility 0.5s ease-in-out 1s, padding 250ms ease-in-out 1.5s; }',
			description:
				'custom resolver for transition - multiple properties, multiple delays/duration/timing-functions with different periods',
			message: messages.expected('transition'),
		},
		{
			code: 'a { transition-delay: 500ms, 1s; transition-duration: 250ms,2s; transition-timing-function: ease-in-out; transition-property: none; }',
			fixed: 'a { transition: none 250ms ease-in-out 500ms; }',
			description:
				'custom resolver for transition - transition property contains property-specific basic keyword (none), but list is of size 1',
			message: messages.expected('transition'),
		},
		{
			code: 'a { transition-delay: ; transition-duration: 1s; transition-timing-function: ease; transition-property: top; }',
			unfixable: true,
			description: 'custom resolver for transition - missing transition-delay',
			message: messages.expected('transition'),
		},
		{
			code: '.class-name { transition-delay: 25ms; transition-duration: 10ms; transition-property: margin; transition-timing-function: cubic-bezier(0, 1, 1, 1); }',
			fixed: '.class-name { transition: margin 10ms cubic-bezier(0, 1, 1, 1) 25ms; }',
			description: 'autofixer should not mangle css functions with comma separated values',
			message: messages.expected('transition'),
		},
		{
			code: '.class-name { transition-delay: 25ms, 50ms; transition-duration: 10ms, 20ms; transition-property: margin, padding; transition-timing-function: cubic-bezier(0, 1, 1, 1), cubic-bezier(1, 0, 0, 1); }',
			fixed:
				'.class-name { transition: margin 10ms cubic-bezier(0, 1, 1, 1) 25ms, padding 20ms cubic-bezier(1, 0, 0, 1) 50ms; }',
			description: 'autofixer should not mangle css functions with comma separated values',
			message: messages.expected('transition'),
		},
		{
			code: 'a { border-top-width: 0px; border-right-width: 1px; border-bottom-width: 2px; border-left-width: 3px; }',
			fixed: 'a { border-width: 0px 1px 2px 3px; }',
			description: 'explicit border-width test',
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
	ruleName,
	config: [true],
	customSyntax: naiveCssInJs,

	accept: [
		{
			code: 'css` margin-right: 10px; margin-top: 20px; `;',
		},
	],

	reject: [
		{
			code: 'css` margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; `;',
			message: messages.expected('margin'),
		},
		{
			code: 'css` margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; `;',
			message: messages.expected('margin'),
		},
	],
});

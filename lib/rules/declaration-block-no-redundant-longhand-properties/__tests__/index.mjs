import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.cjs';
import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,
	computeEditInfo: true,

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
		{
			code: 'a { text-decoration-line: underline; text-decoration-style: solid; text-decoration-color: purple; }',
			description: 'missing text-decoration-thickness',
		},
		{
			code: 'a { background-repeat: repeat; background-attachment: scroll; background-position: 0% 0%; background-color: transparent; background-image: none; background-origin: border-box; background-clip: text; }',
			description: 'missing background-size',
		},
		{
			code: stripIndent`
				a {
					font-variant: foo1 foo2 foo3 foo4 foo5 foo6 foo7;
				}
			`,
		},
		{
			code: 'a { top: 0; right: 0; bottom: 0 !important; left: 0; }',
			description: 'contains important declaration',
		},
		{
			code: 'a { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0; }',
			description: 'number of important declarations is less than number of properties',
		},
	],

	reject: [
		{
			code: 'a { margin-left: 40px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }',
			fixed: 'a { margin: 20px 10px 30px 40px; }',
			message: messages.expected('margin'),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 75,
			fix: {
				range: [10, 77],
				text: ': 20px 10px 30px 4',
			},
		},
		{
			code: 'a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; margin-top: 20px; margin-bottom: 30px; }',
			fixed: 'a { margin: 20px 10px 30px 10px; }',
			message: messages.expected('margin'),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 75,
			fix: {
				range: [4, 77],
				text: 'margin: 20px 10px 30px 1',
			},
		},
		{
			code: 'a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; MARGIN-TOP: 20px; MARGIN-BOTTOM: 30px; }',
			fixed: 'a { margin: 20px 10px 30px 10px; }',
			message: messages.expected('margin'),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 75,
			fix: {
				range: [4, 77],
				text: 'margin: 20px 10px 30px 1',
			},
		},
		{
			code: 'a { padding-left: 10px; padding-right: 10px; padding-top: 20px; padding-bottom: 30px; }',
			fixed: 'a { padding: 20px 10px 30px 10px; }',
			message: messages.expected('padding'),
			line: 1,
			column: 65,
			endLine: 1,
			endColumn: 79,
			fix: {
				range: [11, 81],
				text: ': 20px 10px 30px 1',
			},
		},
		{
			code: 'a { font-style: italic; font-variant: normal; font-weight: bold; font-size: .8em; font-family: Arial; line-height: 1.2; font-stretch: normal; }',
			fixed: 'a { font: italic normal bold normal .8em 1.2 Arial; }',
			message: messages.expected('font'),
			line: 1,
			column: 121,
			endLine: 1,
			endColumn: 133,
			fix: {
				range: [8, 138],
				text: ': italic normal bold normal .8em 1.2 Ari',
			},
		},
		{
			code: 'a { border-top-width: 7px; border-top-style: double; border-top-color: green; }',
			fixed: 'a { border-top: 7px double green; }',
			message: messages.expected('border-top'),
			line: 1,
			column: 54,
			endLine: 1,
			endColumn: 70,
			fix: {
				range: [14, 70],
				text: ': 7px double',
			},
		},
		{
			code: 'a { -webkit-transition-delay: 0.5s; -webkit-transition-duration: 2s; -webkit-transition-property: top; -webkit-transition-timing-function: ease; }',
			fixed: 'a { -webkit-transition: top 2s ease 0.5s; }',
			message: messages.expected('-webkit-transition'),
			line: 1,
			column: 104,
			endLine: 1,
			endColumn: 138,
			fix: {
				range: [22, 143],
				text: ': top 2s ease 0.5s',
			},
		},
		{
			code: 'a { -WEBKIT-transition-delay: 0.5s; -webKIT-transition-duration: 2s; -webkit-TRANSITION-property: top; -webkit-transition-timing-function: ease; }',
			fixed: 'a { -webkit-transition: top 2s ease 0.5s; }',
			message: messages.expected('-webkit-transition'),
			line: 1,
			column: 104,
			endLine: 1,
			endColumn: 138,
			fix: {
				range: [5, 143],
				text: 'webkit-transition: top 2s ease 0.5s',
			},
		},
		{
			code: stripIndent`
				a {
					border-top-width: 1px;
					border-right-width: 2px;
					border-bottom-width: 3px;
					border-left-width: 4px;
					border-top-color: red;
					border-right-color: green;
					border-bottom-color: blue;
					border-left-color: yellow;
					border-top-style: dotted;
					border-right-style: solid;
					border-bottom-style: dashed;
					border-left-style: double;
				}
			`,
			fixed: stripIndent`
				a {
					border-width: 1px 2px 3px 4px;
					border-color: red green blue yellow;
					border-style: dotted solid dashed double;
				}
			`,
			warnings: [
				{
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 19,
					message: messages.expected('border-width'),
					fix: {
						range: [12, 100],
						text: 'width: 1px 2px 3px',
					},
				},
				{
					line: 9,
					column: 2,
					endLine: 9,
					endColumn: 19,
					message: messages.expected('border-color'),
				},
				{
					line: 13,
					column: 2,
					endLine: 13,
					endColumn: 19,
					message: messages.expected('border-style'),
				},
			],
		},
		{
			code: stripIndent`
				a {
					border-top-width: 1px;
					border-right-width: 2px;
					border-bottom-width: 3px;
					border-left-width: 4px;
					border-top-style: dotted;
					border-right-style: solid;
					border-bottom-style: dashed;
					border-left-style: double;
					border-top-color: red;
					border-right-color: green;
					border-bottom-color: blue;
					border-left-color: yellow;
				}
			`,
			fixed: stripIndent`
				a {
					border-width: 1px 2px 3px 4px;
					border-style: dotted solid dashed double;
					border-color: red green blue yellow;
				}
			`,
			warnings: [
				{
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 19,
					message: messages.expected('border-width'),
					fix: {
						range: [12, 100],
						text: 'width: 1px 2px 3px',
					},
				},
				{
					line: 9,
					column: 2,
					endLine: 9,
					endColumn: 19,
					message: messages.expected('border-style'),
				},
				{
					line: 13,
					column: 2,
					endLine: 13,
					endColumn: 19,
					message: messages.expected('border-color'),
				},
			],
		},
		{
			code: stripIndent`
				a {
					border-top-width: 1px;
					border-top-style: dotted;
					border-top-color: red;
					border-right-width: 2px;
					border-right-style: solid;
					border-right-color: green;
					border-bottom-width: 3px;
					border-bottom-style: dashed;
					border-bottom-color: blue;
					border-left-width: 4px;
					border-left-style: double;
					border-left-color: yellow;
				}
			`,
			fixed: stripIndent`
				a {
					border-top: 1px dotted red;
					border-right: 2px solid green;
					border-bottom: 3px dashed blue;
					border-left: 4px double yellow;
				}
			`,
			warnings: [
				{
					line: 4,
					column: 2,
					endLine: 4,
					endColumn: 18,
					message: messages.expected('border-top'),
					fix: {
						range: [15, 73],
						text: ': 1px dotted',
					},
				},
				{
					line: 7,
					column: 2,
					endLine: 7,
					endColumn: 20,
					message: messages.expected('border-right'),
				},
				{
					line: 10,
					column: 2,
					endLine: 10,
					endColumn: 21,
					message: messages.expected('border-bottom'),
				},
				{
					line: 13,
					column: 2,
					endLine: 13,
					endColumn: 19,
					message: messages.expected('border-left'),
				},
			],
		},
		{
			code: stripIndent`
				a {
					border-top-width: 1px;
					border-top-style: dotted;
					border-top-color: red;
					border-bottom-width: 3px;
					border-bottom-style: dashed;
					border-bottom-color: blue;
					border-right-width: 2px;
					border-right-style: solid;
					border-right-color: green;
					border-left-width: 4px;
					border-left-style: double;
					border-left-color: yellow;
				}
			`,
			fixed: stripIndent`
				a {
					border-top: 1px dotted red;
					border-bottom: 3px dashed blue;
					border-right: 2px solid green;
					border-left: 4px double yellow;
				}
			`,
			warnings: [
				{
					line: 4,
					column: 2,
					endLine: 4,
					endColumn: 18,
					message: messages.expected('border-top'),
					fix: {
						range: [15, 73],
						text: ': 1px dotted',
					},
				},
				{
					line: 7,
					column: 2,
					endLine: 7,
					endColumn: 21,
					message: messages.expected('border-bottom'),
				},
				{
					line: 10,
					column: 2,
					endLine: 10,
					endColumn: 20,
					message: messages.expected('border-right'),
				},
				{
					line: 13,
					column: 2,
					endLine: 13,
					endColumn: 19,
					message: messages.expected('border-left'),
				},
			],
		},
		{
			code: stripIndent`
				a {
					border-top-width: 1px;
					border-bottom-width: 3px;
					border-right-width: 2px;
					border-left-width: 4px;
					border-top-style: dotted;
					border-top-color: red;
					border-bottom-style: dashed;
					border-bottom-color: blue;
					border-right-style: solid;
					border-right-color: green;
					border-left-style: double;
					border-left-color: yellow;
				}
			`,
			fixed: stripIndent`
				a {
					border-width: 1px 2px 3px 4px;
					border-style: dotted solid dashed double;
					border-color: red green blue yellow;
				}
			`,
			warnings: [
				{
					line: 5,
					column: 2,
					endLine: 5,
					endColumn: 19,
					message: messages.expected('border-width'),
					fix: {
						range: [12, 100],
						text: 'width: 1px 2px 3px',
					},
				},
				{
					line: 12,
					column: 2,
					endLine: 12,
					endColumn: 19,
					message: messages.expected('border-style'),
				},
				{
					line: 13,
					column: 2,
					endLine: 13,
					endColumn: 19,
					message: messages.expected('border-color'),
				},
			],
		},
		{
			code: stripIndent`
				a {
					border-top-width: 1px;
					border-top-style: dotted;
					border-top-color: red;
					border-right-width: 2px;
					border-bottom-width: 3px;
					border-left-width: 4px;
					border-right-style: solid;
					border-bottom-style: dashed;
					border-left-style: double;
					border-right-color: green;
					border-bottom-color: blue;
					border-left-color: yellow;
				}
			`,
			fixed: stripIndent`
				a {
					border-top: 1px dotted red;
					border-right: 2px solid green;
					border-bottom: 3px dashed blue;
					border-left: 4px double yellow;
				}
			`,
			warnings: [
				{
					line: 4,
					column: 2,
					endLine: 4,
					endColumn: 18,
					message: messages.expected('border-top'),
					fix: {
						range: [15, 73],
						text: ': 1px dotted',
					},
				},
				{
					line: 11,
					column: 2,
					endLine: 11,
					endColumn: 20,
					message: messages.expected('border-right'),
				},
				{
					line: 12,
					column: 2,
					endLine: 12,
					endColumn: 21,
					message: messages.expected('border-bottom'),
				},
				{
					line: 13,
					column: 2,
					endLine: 13,
					endColumn: 19,
					message: messages.expected('border-left'),
				},
			],
		},
		{
			code: 'a { border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; }',
			fixed: 'a { border-width: 1px 1px 1px 1px; }',
			message: messages.expected('border-width'),
			fix: {
				range: [11, 96],
				text: 'width: 1px 1px 1px',
			},
		},
		{
			code: 'a { top: 1px; right: 2px; bottom: 3px; left: 4px; }',
			fixed: 'a { inset: 1px 2px 3px 4px; }',
			message: messages.expected('inset'),
			fix: {
				range: [4, 44],
				text: 'inset: 1px 2px 3px',
			},
		},
		{
			code: 'a { top: 1px !important; right: 2px !important; bottom: 3px !important; left: 4px !important; }',
			fixed: 'a { inset: 1px 2px 3px 4px !important; }',
			message: messages.expected('inset'),
			fix: {
				range: [4, 77],
				text: 'inset: 1px 2px 3px',
			},
		},
		{
			code: 'a { top: 0; right: 0; bottom: 0; left: 0; }',
			fixed: 'a { inset: 0 0 0 0; }',
			message: messages.expected('inset'),
			fix: {
				range: [4, 38],
				text: 'inset: 0 0 0',
			},
		},
		{
			code: 'a { grid-template-rows: var(--header-h) 1fr var(--footer-h); grid-template-columns: var(--toolbar-w) 1fr; grid-template-areas: "header header" "toolbar main" "footer footer"; }',
			fixed:
				'a { grid-template: "header header" var(--header-h) "toolbar main" 1fr "footer footer" var(--footer-h) / var(--toolbar-w) 1fr; }',
			description: 'custom resolver for grid-template',
			message: messages.expected('grid-template'),
			fix: {
				range: [17, 173],
				text: ': "header header" var(--header-h) "toolbar main" 1fr "footer footer" var(--footer-h) / var(--toolbar-w) 1fr',
			},
		},
		{
			code: 'a { transition-delay: 500ms,    1s; transition-duration: 250ms,2s; transition-timing-function: ease-in-out; transition-property: transform, visibility; }',
			fixed: 'a { transition: transform 250ms ease-in-out 500ms, visibility 2s ease-in-out 1s; }',
			description:
				'custom resolver for transition - multiple properties, delays, durations, timing-functions',
			message: messages.expected('transition'),
			fix: {
				range: [14, 150],
				text: ': transform 250ms ease-in-out 500ms, visibility 2s ease-in-out 1s',
			},
		},
		{
			code: 'a { transition-delay: 500ms; transition-duration: 250ms; transition-timing-function: ease-in-out; transition-property: transform, visibility; }',
			fixed:
				'a { transition: transform 250ms ease-in-out 500ms, visibility 250ms ease-in-out 500ms; }',
			description:
				'custom resolver for transition - multiple properties, single delay/duration/timing-function',
			message: messages.expected('transition'),
			fix: {
				range: [14, 140],
				text: ': transform 250ms ease-in-out 500ms, visibility 250ms ease-in-out 500ms',
			},
		},
		{
			code: 'a { transition-delay: 500ms, 1s, 1.5s; transition-duration: 250ms, 0.5s; transition-timing-function: ease-in-out; transition-property: transform, visibility, padding; }',
			fixed:
				'a { transition: transform 250ms ease-in-out 500ms, visibility 0.5s ease-in-out 1s, padding 250ms ease-in-out 1.5s; }',
			description:
				'custom resolver for transition - multiple properties, multiple delays/duration/timing-functions with different periods',
			message: messages.expected('transition'),
			fix: {
				range: [14, 165],
				text: ': transform 250ms ease-in-out 500ms, visibility 0.5s ease-in-out 1s, padding 250ms ease-in-out 1.5s',
			},
		},
		{
			code: 'a { transition-delay: 500ms, 1s; transition-duration: 250ms,2s; transition-timing-function: ease-in-out; transition-property: none; }',
			fixed: 'a { transition: none 250ms ease-in-out 500ms; }',
			description:
				'custom resolver for transition - transition property contains property-specific basic keyword (none), but list is of size 1',
			message: messages.expected('transition'),
			fix: {
				range: [14, 130],
				text: ': none 250ms ease-in-out 500ms',
			},
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
			fix: {
				range: [24, 146],
				text: ': margin 10ms cubic-bezier(0, 1, 1, 1) 25ms',
			},
		},
		{
			code: '.class-name { transition-delay: 25ms, 50ms; transition-duration: 10ms, 20ms; transition-property: margin, padding; transition-timing-function: cubic-bezier(0, 1, 1, 1), cubic-bezier(1, 0, 0, 1); }',
			fixed:
				'.class-name { transition: margin 10ms cubic-bezier(0, 1, 1, 1) 25ms, padding 20ms cubic-bezier(1, 0, 0, 1) 50ms; }',
			description: 'autofixer should not mangle css functions with comma separated values',
			message: messages.expected('transition'),
			fix: {
				range: [24, 193],
				text: ': margin 10ms cubic-bezier(0, 1, 1, 1) 25ms, padding 20ms cubic-bezier(1, 0, 0, 1) 50ms',
			},
		},
		{
			code: 'a { grid-column-start: 1; grid-column-end: 2; }',
			fixed: 'a { grid-column: 1 / 2; }',
			description: 'explicit grid-column test',
			message: messages.expected('grid-column'),
			fix: {
				range: [15, 42],
				text: ': 1 /',
			},
		},
		{
			code: 'a { grid-row-start: 1; grid-row-end: 2; }',
			fixed: 'a { grid-row: 1 / 2; }',
			description: 'explicit grid-row test',
			message: messages.expected('grid-row'),
			fix: {
				range: [12, 36],
				text: ': 1 /',
			},
		},
		{
			code: stripIndent`
				a {
					grid-row-start: 1;
					grid-row-end: 2;
					grid-column-start: 3;
					grid-column-end: 4;
				}
			`,
			fixed: stripIndent`
				a {
					grid-row: 1 / 2;
					grid-column: 3 / 4;
				}
			`,
			description: 'combination of grid-row and grid-column test',
			warnings: [
				{
					column: 2,
					endColumn: 14,
					endLine: 3,
					line: 3,
					message: messages.expected('grid-row'),
					fix: {
						range: [13, 38],
						text: ': 1 /',
					},
				},
				{
					column: 2,
					endColumn: 17,
					endLine: 5,
					line: 5,
					message: messages.expected('grid-column'),
				},
			],
		},
		{
			code: stripIndent`
				a {
					grid-column: line-outer-left / line-outer-right;
					grid-row: line-inner-top / line-inner-bottom;
				}
			`,
			skip: true,
			description: 'TODO: explicit grid-area test',
			message: messages.expected('grid-area'),
			fix: {
				range: [1, 2],
				text: '',
			},
		},
		{
			code: 'a { border-top-left-radius: 1em; border-top-right-radius: 2em; border-bottom-right-radius: 3em; border-bottom-left-radius: 4em; }',
			fixed: 'a { border-radius: 1em 2em 3em 4em; }',
			description: 'explicit border-radius test',
			message: messages.expected('border-radius'),
			fix: {
				range: [11, 122],
				text: 'radius: 1em 2em 3em',
			},
		},
		{
			code: 'a { border-top-width: 0px; border-right-width: 1px; border-bottom-width: 2px; border-left-width: 3px; }',
			fixed: 'a { border-width: 0px 1px 2px 3px; }',
			description: 'explicit border-width test',
			message: messages.expected('border-width'),
			fix: {
				range: [11, 96],
				text: 'width: 0px 1px 2px',
			},
		},
		{
			code: 'a { inset-block-start: 1px; inset-block-end: 2px; }',
			fixed: 'a { inset-block: 1px 2px; }',
			description: 'explicit inset-block test',
			message: messages.expected('inset-block'),
			fix: {
				range: [15, 44],
				text: ': 1px',
			},
		},
		{
			code: 'a { inset-inline-start: 1px; inset-inline-end: 2px; }',
			fixed: 'a { inset-inline: 1px 2px; }',
			description: 'explicit inset-inline test',
			message: messages.expected('inset-inline'),
			fix: {
				range: [16, 46],
				text: ': 1px',
			},
		},
		{
			code: 'a { margin-block-start: 1px; margin-block-end: 2px; }',
			fixed: 'a { margin-block: 1px 2px; }',
			description: 'explicit margin-block test',
			message: messages.expected('margin-block'),
			fix: {
				range: [16, 46],
				text: ': 1px',
			},
		},
		{
			code: 'a { margin-inline-start: 1px; margin-inline-end: 2px; }',
			fixed: 'a { margin-inline: 1px 2px; }',
			description: 'explicit margin-inline test',
			message: messages.expected('margin-inline'),
			fix: {
				range: [17, 48],
				text: ': 1px',
			},
		},
		{
			code: 'a { padding-block-start: 1px; padding-block-end: 2px; }',
			fixed: 'a { padding-block: 1px 2px; }',
			description: 'explicit padding-block test',
			message: messages.expected('padding-block'),
			fix: {
				range: [17, 48],
				text: ': 1px',
			},
		},
		{
			code: 'a { padding-inline-start: 1px; padding-inline-end: 2px; }',
			fixed: 'a { padding-inline: 1px 2px; }',
			description: 'explicit padding-inline test',
			message: messages.expected('padding-inline'),
			fix: {
				range: [18, 50],
				text: ': 1px',
			},
		},
		{
			code: 'a { scroll-margin-block-start: 1px; scroll-margin-block-end: 2px; }',
			fixed: 'a { scroll-margin-block: 1px 2px; }',
			description: 'explicit scroll-margin-block test',
			message: messages.expected('scroll-margin-block'),
			fix: {
				range: [23, 60],
				text: ': 1px',
			},
		},
		{
			code: 'a { scroll-margin-inline-start: 1px; scroll-margin-inline-end: 2px; }',
			fixed: 'a { scroll-margin-inline: 1px 2px; }',
			description: 'explicit scroll-margin-inline test',
			message: messages.expected('scroll-margin-inline'),
			fix: {
				range: [24, 62],
				text: ': 1px',
			},
		},
		{
			code: 'a { scroll-padding-block-start: 1px; scroll-padding-block-end: 2px; }',
			fixed: 'a { scroll-padding-block: 1px 2px; }',
			description: 'explicit scroll-padding-block test',
			message: messages.expected('scroll-padding-block'),
			fix: {
				range: [24, 62],
				text: ': 1px',
			},
		},
		{
			code: 'a { scroll-padding-inline-start: 1px; scroll-padding-inline-end: 2px; }',
			fixed: 'a { scroll-padding-inline: 1px 2px; }',
			description: 'explicit scroll-padding-inline test',
			message: messages.expected('scroll-padding-inline'),
			fix: {
				range: [25, 64],
				text: ': 1px',
			},
		},
		{
			code: 'a { border-block-color: blue; border-block-style: dashed; border-block-width: medium; }',
			fixed: 'a { border-block: medium dashed blue; }',
			description: 'explicit border-block test',
			message: messages.expected('border-block'),
			fix: {
				range: [16, 84],
				text: ': medium dashed blue',
			},
		},
		{
			code: 'a { border-inline-color: blue; border-inline-style: dashed; border-inline-width: medium; }',
			fixed: 'a { border-inline: medium dashed blue; }',
			description: 'explicit border-inline test',
			message: messages.expected('border-inline'),
			fix: {
				range: [17, 87],
				text: ': medium dashed blue',
			},
		},
		{
			code: 'a { font-synthesis-weight: none; font-synthesis-style: none; font-synthesis-small-caps: none; }',
			fixed: 'a { font-synthesis: none; }',
			description: 'font-synthesis - all none',
			message: messages.expected('font-synthesis'),
			fix: {
				range: [18, 86],
				text: '',
			},
		},
		{
			code: 'a { font-synthesis-weight: auto; font-synthesis-style: auto; font-synthesis-small-caps: auto; }',
			fixed: 'a { font-synthesis: weight style small-caps; }',
			description: 'font-synthesis - all auto',
			message: messages.expected('font-synthesis'),
			fix: {
				range: [18, 92],
				text: ': weight style small-caps',
			},
		},
		{
			code: 'a { font-synthesis-weight: auto; font-synthesis-style: none; font-synthesis-small-caps: auto; }',
			fixed: 'a { font-synthesis: weight small-caps; }',
			description: 'font-synthesis - mixed',
			message: messages.expected('font-synthesis'),
			fix: {
				range: [18, 92],
				text: ': weight small-caps',
			},
		},
		{
			code: 'a { font-synthesis-weight: aut3; font-synthesis-style: none; font-synthesis-small-caps: auto; }',
			unfixable: true,
			description: 'font-synthesis - invalid value cannot be combined',
			message: messages.expected('font-synthesis'),
		},
		{
			code: 'div { overflow-y: visible; overflow-x: hidden; }',
			fixed: 'div { overflow: hidden visible; }',
			description: 'explicit overflow test',
			message: messages.expected('overflow'),
			fix: {
				range: [14, 45],
				text: ': hidden visible',
			},
		},
		{
			code: 'div { overscroll-behavior-y: contain; overscroll-behavior-x: auto; }',
			fixed: 'div { overscroll-behavior: auto contain; }',
			description: 'explicit overscroll-behavior test',
			message: messages.expected('overscroll-behavior'),
			fix: {
				range: [25, 65],
				text: ': auto contain',
			},
		},
		{
			code: 'div { column-gap: 20px; row-gap: 10px; }',
			fixed: 'div { gap: 10px 20px; }',
			description: 'explicit gap test',
			message: messages.expected('gap'),
			fix: {
				range: [6, 34],
				text: 'gap: 10px 2',
			},
		},
		{
			code: 'div { justify-content: center; align-content: end; }',
			fixed: 'div { place-content: end center; }',
			description: 'explicit place-content test',
			message: messages.expected('place-content'),
			fix: {
				range: [6, 49],
				text: 'place-content: end center',
			},
		},
		{
			code: 'div { justify-items: center; align-items: end; }',
			fixed: 'div { place-items: end center; }',
			description: 'explicit place-items test',
			message: messages.expected('place-items'),
			fix: {
				range: [6, 45],
				text: 'place-items: end center',
			},
		},
		{
			code: 'div { justify-self: center; align-self: end; }',
			fixed: 'div { place-self: end center; }',
			description: 'explicit place-self test',
			message: messages.expected('place-self'),
			fix: {
				range: [6, 43],
				text: 'place-self: end center',
			},
		},
		{
			code: 'a { scroll-margin-left: 40px; scroll-margin-right: 10px; scroll-margin-top: 20px; scroll-margin-bottom: 30px; }',
			fixed: 'a { scroll-margin: 20px 10px 30px 40px; }',
			description: 'explicit scroll-margin test',
			message: messages.expected('scroll-margin'),
			fix: {
				range: [17, 105],
				text: ': 20px 10px 30px 4',
			},
		},
		{
			code: 'a { scroll-padding-left: 40px; scroll-padding-right: 10px; scroll-padding-top: 20px; scroll-padding-bottom: 30px; }',
			fixed: 'a { scroll-padding: 20px 10px 30px 40px; }',
			description: 'explicit scroll-padding test',
			message: messages.expected('scroll-padding'),
			fix: {
				range: [18, 109],
				text: ': 20px 10px 30px 4',
			},
		},
		{
			code: 'a { grid-template-columns: repeat(3, 1fr); grid-template-rows: auto; grid-template-areas: "left center right"; }',
			unfixable: true,
			description:
				'the repeat() notation has non-trivial semantics and is currently not fixable (columns)',
			message: messages.expected('grid-template'),
		},
		{
			code: 'a { grid-template-columns: auto; grid-template-rows: repeat(3, 1fr); grid-template-areas: "left center right"; }',
			unfixable: true,
			description:
				'the repeat() notation has non-trivial semantics and is currently not fixable (rows)',
			message: messages.expected('grid-template'),
		},
		{
			code: 'a { text-decoration-color: purple; text-decoration-thickness: 1px; text-decoration-style: solid; text-decoration-line: underline; }',
			fixed: 'a { text-decoration: underline solid purple 1px; }',
			message: messages.expected('text-decoration'),
			description: 'CSS Text Decoration Module Level 4',
			fix: {
				range: [19, 128],
				text: ': underline solid purple 1px',
			},
		},
		{
			code: stripIndent`
				a {
					font-variant-ligatures: foo1;
					font-variant-position: foo2;
					font-variant-caps: foo3;
					font-variant-numeric: foo4;
					font-variant-alternates: foo5;
					font-variant-east-asian: foo6;
					font-variant-emoji: foo7;
				}
			`,
			fixed: stripIndent`
				a {
					font-variant: foo1 foo2 foo3 foo4 foo5 foo6 foo7;
				}
			`,
			fix: {
				range: [17, 204],
				text: ': foo1 foo2 foo3 foo4 foo5 foo6',
			},
			message: messages.expected('font-variant'),
		},
	],
});

testRule({
	ruleName,
	config: [
		true,
		{
			ignoreLonghands: ['background-size', 'background-origin', 'background-clip'],
		},
	],
	fix: true,

	reject: [
		{
			code: 'a { background-repeat: repeat; background-attachment: scroll; background-position: 0% 0%; background-color: transparent; background-image: none; background-size: contain; background-origin: border-box; background-clip: text; }',
			fixed:
				'a { background: none 0% 0% repeat scroll transparent; background-size: contain; background-origin: border-box; background-clip: text; }',
			message: messages.expected('background'),
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreLonghands: 'text-decoration-thickness' }],
	fix: true,

	reject: [
		{
			code: 'a { text-decoration-line: underline; text-decoration-style: solid; text-decoration-color: purple; }',
			fixed: 'a { text-decoration: underline solid purple; }',
			description: 'CSS Text Decoration Module Level 3',
			message: messages.expected('text-decoration'),
		},
		{
			code: 'a { text-decoration-color: purple; text-decoration-thickness: 1px; text-decoration-style: solid; text-decoration-line: underline; text-decoration-width: 1px; }',
			fixed:
				'a { text-decoration: underline solid purple; text-decoration-thickness: 1px; text-decoration-width: 1px; }',
			description: 'ignore text-decoration-width by default',
			message: messages.expected('text-decoration'),
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

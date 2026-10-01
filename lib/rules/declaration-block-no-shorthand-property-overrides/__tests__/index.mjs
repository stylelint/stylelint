import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.cjs';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { padding: 10px; }',
		},
		{
			code: 'a { padding: 10px; padding-left: 20px; }',
		},
		{
			code: '@media (color) { padding: 10px; padding-left: 20px; }',
		},
		{
			code: 'a { @media (color) { padding: 10px; padding-left: 20px; }}',
		},
		{
			code: 'a { padding-left: 10px; { b { padding: 20px; }}}',
			description: 'nested related properties',
		},
		{
			code: 'a { border-top-width: 1px; top: 0; bottom: 3px; border-bottom: 2px solid blue; }',
		},
		{
			code: 'a { transition-property: opacity; } a { transition: opacity 1s linear; }',
		},
		{
			code: 'a { -webkit-transition-property: opacity; transition: opacity 1s linear; }',
		},
		{
			code: 'a { transition-property: opacity; -webkit-transition: opacity 1s linear; }',
		},
		{
			code: 'a { padding-left: 10px; padding-inline: 5px; }',
			description: 'flow-relative shorthand after physical longhand depends on writing mode',
		},
		{
			code: 'a { padding: 10px; padding-inline: 5px; }',
			description: 'flow-relative shorthand after physical shorthand',
		},
		{
			code: 'a { padding-inline-start: 5px; padding-block: 10px; }',
			description: 'flow-relative shorthand of another axis',
		},
		{
			code: 'a { padding-inline: 5px; padding-block: 10px; }',
			description: 'flow-relative shorthands of different axes',
		},
		{
			code: 'a { padding-inline: 5px; padding-left: 10px; }',
			description: 'physical longhand after flow-relative shorthand',
		},
		{
			code: 'a { padding-inline: 5px; margin: 10px; }',
			description: 'physical shorthand of another logical property group',
		},
		{
			code: 'a { border-block: 1px solid; border-width: 2px; }',
			description: 'physical shorthand overriding only part of a flow-relative shorthand',
		},
		{
			code: 'a { border-inline-start-color: red; border-style: solid; }',
			description: 'physical shorthand of another border sub-property',
		},
		{
			code: 'a { border-start-start-radius: 2px; border: 1px solid; }',
			description: 'border does not reset border-radius',
		},
		{
			code: 'a { overflow: auto; overflow-inline: hidden; }',
			description: 'two-axis flow-relative longhand after physical shorthand',
		},
	],

	reject: [
		{
			code: 'a { padding-left: 10px; padding: 20px; }',
			message: messages.rejected('padding', 'padding-left'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { padding-inline: 5px; padding: 10px; }',
			message: messages.rejected('padding', 'padding-inline'),
			description: 'flow-relative shorthand',
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a {\n\tpadding-block-end: 5px;\n\tpadding: 10px;\n}',
			message: messages.rejected('padding', 'padding-block-end'),
			description: 'flow-relative longhand',
			line: 3,
			column: 2,
			endLine: 3,
			endColumn: 9,
		},
		{
			code: 'a { margin-inline: 5px; margin: 10px; }',
			message: messages.rejected('margin', 'margin-inline'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { inset-block-start: 5px; inset: 10px; }',
			message: messages.rejected('inset', 'inset-block-start'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { scroll-margin-inline: 5px; scroll-margin: 10px; }',
			message: messages.rejected('scroll-margin', 'scroll-margin-inline'),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: 'a { scroll-padding-block: 5px; scroll-padding: 10px; }',
			message: messages.rejected('scroll-padding', 'scroll-padding-block'),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: 'a { border-block-width: 1px; border-width: 2px; }',
			message: messages.rejected('border-width', 'border-block-width'),
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 42,
		},
		{
			code: 'a { border-inline-style: dotted; border-style: solid; }',
			message: messages.rejected('border-style', 'border-inline-style'),
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: 'a { border-block-end-color: red; border-color: blue; }',
			message: messages.rejected('border-color', 'border-block-end-color'),
			line: 1,
			column: 34,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: 'a { border-start-start-radius: 2px; border-radius: 4px; }',
			message: messages.rejected('border-radius', 'border-start-start-radius'),
			line: 1,
			column: 37,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: 'a { overflow-inline: hidden; overflow: auto; }',
			message: messages.rejected('overflow', 'overflow-inline'),
			description: 'two-axis physical shorthand',
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 38,
		},
		{
			code: 'a { overscroll-behavior-block: contain; overscroll-behavior: auto; }',
			message: messages.rejected('overscroll-behavior', 'overscroll-behavior-block'),
			line: 1,
			column: 41,
			endLine: 1,
			endColumn: 60,
		},
		{
			code: 'a { border-block: 1px solid; border: 20px dashed black; }',
			message: messages.rejected('border', 'border-block'),
			description: 'flow-relative shorthand of a shorthand',
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: 'a { border-inline-start-width: 1px; border: 20px dashed black; }',
			message: messages.rejected('border', 'border-inline-start-width'),
			description: 'flow-relative longhand of a shorthand',
			line: 1,
			column: 37,
			endLine: 1,
			endColumn: 43,
		},
		{
			code: 'a { PADDING-INLINE: 5PX; PADDING: 10PX; }',
			message: messages.rejected('PADDING', 'PADDING-INLINE'),
			line: 1,
			column: 26,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a {\n\tborder-block: 1px solid;\n\tborder-inline-width: 2px;\n\tborder: 1px solid;\n}',
			description: 'two flow-relative properties overridden by one shorthand',
			warnings: [
				{
					message: messages.rejected('border', 'border-block'),
					line: 4,
					column: 2,
					endLine: 4,
					endColumn: 8,
				},
				{
					message: messages.rejected('border', 'border-inline-width'),
					line: 4,
					column: 2,
					endLine: 4,
					endColumn: 8,
				},
			],
		},
		{
			code: 'a { border-width: 20px; border: 1px solid black; }',
			message: messages.rejected('border', 'border-width'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: 'a { border-color: red; border: 1px solid black; }',
			message: messages.rejected('border', 'border-color'),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { border-style: dotted; border: 1px solid black; }',
			message: messages.rejected('border', 'border-style'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: 'a { border-image: url("foo.png"); border: 1px solid black; }',
			message: messages.rejected('border', 'border-image'),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: 'a { border-image-source: url("foo.png"); border: 1px solid black; }',
			message: messages.rejected('border', 'border-image-source'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 48,
		},
		{
			code: 'a { pAdDiNg-lEfT: 10Px; pAdDiNg: 20Px; }',
			message: messages.rejected('pAdDiNg', 'pAdDiNg-lEfT'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { PADDING-LEFT: 10PX; PADDING: 20PX; }',
			message: messages.rejected('PADDING', 'PADDING-LEFT'),
			line: 1,
			column: 25,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { padding-left: 10px; { b { padding-top: 10px; padding: 20px; }}}',
			description: 'override within nested rule',
			message: messages.rejected('padding', 'padding-top'),
			line: 1,
			column: 50,
			endLine: 1,
			endColumn: 57,
		},
		{
			code: 'a { border-top-width: 1px; top: 0; bottom: 3px; border: 2px solid blue; }',
			message: messages.rejected('border', 'border-top-width'),
			line: 1,
			column: 49,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: 'a { transition-property: opacity; transition: opacity 1s linear; }',
			message: messages.rejected('transition', 'transition-property'),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: 'a { background-repeat: no-repeat; background: url(lion.png); }',
			message: messages.rejected('background', 'background-repeat'),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: '@media (color) { background-repeat: no-repeat; background: url(lion.png); }',
			message: messages.rejected('background', 'background-repeat'),
			line: 1,
			column: 48,
			endLine: 1,
			endColumn: 58,
		},
		{
			code: 'a { @media (color) { background-repeat: no-repeat; background: url(lion.png); }}',
			message: messages.rejected('background', 'background-repeat'),
			line: 1,
			column: 52,
			endLine: 1,
			endColumn: 62,
		},
		{
			code: 'a { -webkit-transition-property: opacity; -webkit-transition: opacity 1s linear; }',
			message: messages.rejected('-webkit-transition', '-webkit-transition-property'),
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 61,
		},
		{
			code: 'a { -WEBKIT-transition-property: opacity; -webKIT-transition: opacity 1s linear; }',
			message: messages.rejected('-webKIT-transition', '-WEBKIT-transition-property'),
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 61,
		},
		{
			code: 'a { font-variant: small-caps; font: sans-serif; }',
			message: messages.rejected('font', 'font-variant'),
			description: 'CSS2 explicit reset',
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: 'a { font-variant: all-small-caps; font: sans-serif; }',
			message: messages.rejected('font', 'font-variant'),
			description: 'CSS3 implicit reset',
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 39,
		},
		{
			code: 'a { font-size-adjust: 0.545; font: Verdana; }',
			message: messages.rejected('font', 'font-size-adjust'),
			line: 1,
			column: 30,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { font-variant-caps: small-caps; font-variant: normal; }',
			message: messages.rejected('font-variant', 'font-variant-caps'),
			line: 1,
			column: 36,
			endLine: 1,
			endColumn: 48,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-html',

	accept: [
		{
			code: '<style>a { padding: 10px; }</style>',
		},
		{
			code: '<style>a { padding-left: 10px; }</style><style>a { padding: 10px; }</style>',
		},
		{
			code: '<a style="padding: 10px;"></a>',
		},
		{
			code: '<a style="padding-left: 10px;"></a><a style="padding: 10px;"></a>',
		},
	],

	reject: [
		{
			code: '<style>p { padding-left: 10px; padding: 20px; }</style>',
			message: messages.rejected('padding', 'padding-left'),
		},
		{
			code: '<a style="padding-left: 10px; padding: 20px;"></a>',
			message: messages.rejected('padding', 'padding-left'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: naiveCssInJs,

	accept: [
		{
			code: 'css` padding: 10px; `;',
		},
	],

	reject: [
		{
			code: 'css` padding-left: 10px; padding: 20px; `;',
			message: messages.rejected('padding', 'padding-left'),
		},
		{
			code: 'css` padding-left: 10px; padding: 20px; `;',
			message: messages.rejected('padding', 'padding-left'),
		},
	],
});

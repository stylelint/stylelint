'use strict';

const { messages, ruleName } = require('..');

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
	],

	reject: [
		{
			code: 'a { padding-left: 10px; padding: 20px; }',
			message: messages.rejected('padding', 'padding-left'),
		},
		{
			code: 'a { pAdDiNg-lEfT: 10Px; pAdDiNg: 20Px; }',
			message: messages.rejected('pAdDiNg', 'pAdDiNg-lEfT'),
		},
		{
			code: 'a { PADDING-LEFT: 10PX; PADDING: 20PX; }',
			message: messages.rejected('PADDING', 'PADDING-LEFT'),
		},
		{
			code: 'a { padding-left: 10px; { b { padding-top: 10px; padding: 20px; }}}',
			description: 'override within nested rule',
			message: messages.rejected('padding', 'padding-top'),
		},
		{
			code: 'a { border-top-width: 1px; top: 0; bottom: 3px; border: 2px solid blue; }',
			message: messages.rejected('border', 'border-top-width'),
		},
		{
			code: 'a { transition-property: opacity; transition: opacity 1s linear; }',
			message: messages.rejected('transition', 'transition-property'),
		},
		{
			code: 'a { background-repeat: no-repeat; background: url(lion.png); }',
			message: messages.rejected('background', 'background-repeat'),
		},
		{
			code: '@media (color) { background-repeat: no-repeat; background: url(lion.png); }',
			message: messages.rejected('background', 'background-repeat'),
		},
		{
			code: 'a { @media (color) { background-repeat: no-repeat; background: url(lion.png); }}',
			message: messages.rejected('background', 'background-repeat'),
		},
		{
			code: 'a { -webkit-transition-property: opacity; -webkit-transition: opacity 1s linear; }',
			message: messages.rejected('-webkit-transition', '-webkit-transition-property'),
		},
		{
			code: 'a { -WEBKIT-transition-property: opacity; -webKIT-transition: opacity 1s linear; }',
			message: messages.rejected('-webKIT-transition', '-WEBKIT-transition-property'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'html',

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
	syntax: 'css-in-js',

	accept: [
		{
			code: "import styled from 'react-emotion';\nexport default styled.div` padding: 10px; `;",
		},
	],

	reject: [
		{
			code:
				"import styled from 'styled-components';\nexport default styled.div` padding-left: 10px; padding: 20px; `;",
			message: messages.rejected('padding', 'padding-left'),
		},
		{
			code:
				"import styled from 'react-emotion';\nexport default styled.div` padding-left: 10px; padding: 20px; `;",
			message: messages.rejected('padding', 'padding-left'),
		},
	],
});

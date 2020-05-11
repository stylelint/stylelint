'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: '.foo { }',
		},
		{
			code: '[ target ] { }',
		},
		{
			code: '[  target  ] { }',
		},
		{
			code: '[ target=_blank ] { }',
		},
		{
			code: '[  target=_blank  ] { }',
		},
		{
			code: "[ target='_blank' ] { }",
		},
		{
			code: '[ target="_blank" ] { }',
		},
		{
			code: '[ title~=flower ] { }',
		},
		{
			code: '[ title|=flower ] { }',
		},
		{
			code: '[ title^=flower ] { }',
		},
		{
			code: '[ title$=flower ] { }',
		},
		{
			code: 'a[ href*=w3schools ] { }',
		},
		{
			code: 'img[ alt~=person ][ src*=lorem ] { }',
		},
		{
			code: '[ target=_blank ]:hover { }',
		},
		{
			code: '[ target=_blank ]::before { }',
		},
		{
			code: 'option[ data-hidden=true ] { }',
		},
		{
			code: 'option[ dataHidden ] { }',
		},
		{
			code: '@media screen and (max-width: 480px) { img[ align=right ] {} }',
		},
		{
			code: '[ target=_blank ] .foo { }',
		},
		{
			code: 'li[ aria-hidden=false ]:nth-child(1) { }',
		},
		{
			code: 'li[ aria-hidden=false ]:nth-child( 1) { }',
		},
		{
			code: 'li[ aria-hidden=false ]:nth-child(1 ) { }',
		},
		{
			code: 'li[ aria-hidden=false ]:nth-child( 1 ) { }',
		},
		{
			code: 'ul li[ aria-hidden=false ] + li[ aria-hidden=false ] a { }',
		},
		{
			code: '[ target ] { content: "[" }',
		},
		{
			code: '[ target ] { content: "]" }',
		},
		{
			code: '[ foo=bar i ] { }',
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
			code: 'a[b=#{c}] { }',
			description: 'ignore "invalid" selector (see #3130)',
		},
	],

	reject: [
		{
			code: '[target ] { }',
			fixed: '[ target ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[ target] { }',
			fixed: '[ target ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 8,
		},
		{
			code: '[target  ] { }',
			fixed: '[ target  ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[  target] { }',
			fixed: '[  target ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 9,
		},
		{
			code: '[target=_blank ] { }',
			fixed: '[ target=_blank ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[ target=_blank] { }',
			fixed: '[ target=_blank ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 15,
		},
		{
			code: '[target=_blank  ] { }',
			fixed: '[ target=_blank  ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[  target=_blank] { }',
			fixed: '[  target=_blank ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 16,
		},
		{
			code: "[target='_blank' ] { }",
			fixed: "[ target='_blank' ] { }",
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: "[ target='_blank'] { }",
			fixed: "[ target='_blank' ] { }",
			message: messages.expectedClosing,
			line: 1,
			column: 17,
		},
		{
			code: '[target="_blank" ] { }',
			fixed: '[ target="_blank" ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[ target="_blank"] { }',
			fixed: '[ target="_blank" ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 17,
		},
		{
			code: 'a[href*=w3schools ] { }',
			fixed: 'a[ href*=w3schools ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: 'a[ href*=w3schools] { }',
			fixed: 'a[ href*=w3schools ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 18,
		},
		{
			code: 'img[alt~=person ][ src*=lorem ] { }',
			fixed: 'img[ alt~=person ][ src*=lorem ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 5,
		},
		{
			code: 'img[ alt~=person][ src*=lorem ] { }',
			fixed: 'img[ alt~=person ][ src*=lorem ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 16,
		},
		{
			code: 'img[ alt~=person ][src*=lorem ] { }',
			fixed: 'img[ alt~=person ][ src*=lorem ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 20,
		},
		{
			code: 'img[ alt~=person ][ src*=lorem] { }',
			fixed: 'img[ alt~=person ][ src*=lorem ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 30,
		},
		{
			code: '[target=_blank ]:hover { }',
			fixed: '[ target=_blank ]:hover { }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[ target=_blank]:hover { }',
			fixed: '[ target=_blank ]:hover { }',
			message: messages.expectedClosing,
			line: 1,
			column: 15,
		},
		{
			code: '[target=_blank ]::before { }',
			fixed: '[ target=_blank ]::before { }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[ target=_blank]::before { }',
			fixed: '[ target=_blank ]::before { }',
			message: messages.expectedClosing,
			line: 1,
			column: 15,
		},
		{
			code: 'option[data-hidden=true ] { }',
			fixed: 'option[ data-hidden=true ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 8,
		},
		{
			code: 'option[ data-hidden=true] { }',
			fixed: 'option[ data-hidden=true ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 24,
		},
		{
			code: 'option[dataHidden ] { }',
			fixed: 'option[ dataHidden ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 8,
		},
		{
			code: 'option[ dataHidden] { }',
			fixed: 'option[ dataHidden ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 18,
		},
		{
			code: '@media screen and (max-width: 480px) { img[align=right ] {} }',
			fixed: '@media screen and (max-width: 480px) { img[ align=right ] {} }',
			message: messages.expectedOpening,
			line: 1,
			column: 44,
		},
		{
			code: '@media screen and (max-width: 480px) { img[ align=right] {} }',
			fixed: '@media screen and (max-width: 480px) { img[ align=right ] {} }',
			message: messages.expectedClosing,
			line: 1,
			column: 55,
		},
		{
			code: '[target=_blank ] .foo { }',
			fixed: '[ target=_blank ] .foo { }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[ target=_blank] .foo { }',
			fixed: '[ target=_blank ] .foo { }',
			message: messages.expectedClosing,
			line: 1,
			column: 15,
		},
		{
			code: 'li[aria-hidden=false ]:nth-child(1) { }',
			fixed: 'li[ aria-hidden=false ]:nth-child(1) { }',
			message: messages.expectedOpening,
			line: 1,
			column: 4,
		},
		{
			code: 'li[ aria-hidden=false]:nth-child(1) { }',
			fixed: 'li[ aria-hidden=false ]:nth-child(1) { }',
			message: messages.expectedClosing,
			line: 1,
			column: 21,
		},
		{
			code: 'li[aria-hidden=false ]:nth-child( 1 ) { }',
			fixed: 'li[ aria-hidden=false ]:nth-child( 1 ) { }',
			message: messages.expectedOpening,
			line: 1,
			column: 4,
		},
		{
			code: 'li[ aria-hidden=false]:nth-child( 1 ) { }',
			fixed: 'li[ aria-hidden=false ]:nth-child( 1 ) { }',
			message: messages.expectedClosing,
			line: 1,
			column: 21,
		},
		{
			code: 'ul li[aria-hidden=false ] + li[ aria-hidden=false ] a { }',
			fixed: 'ul li[ aria-hidden=false ] + li[ aria-hidden=false ] a { }',
			message: messages.expectedOpening,
			line: 1,
			column: 7,
		},
		{
			code: 'ul li[ aria-hidden=false] + li[ aria-hidden=false ] a { }',
			fixed: 'ul li[ aria-hidden=false ] + li[ aria-hidden=false ] a { }',
			message: messages.expectedClosing,
			line: 1,
			column: 24,
		},
		{
			code: 'ul li[ aria-hidden=false ] + li[aria-hidden=false ] a { }',
			fixed: 'ul li[ aria-hidden=false ] + li[ aria-hidden=false ] a { }',
			message: messages.expectedOpening,
			line: 1,
			column: 33,
		},
		{
			code: 'ul li[ aria-hidden=false ] + li[ aria-hidden=false] a { }',
			fixed: 'ul li[ aria-hidden=false ] + li[ aria-hidden=false ] a { }',
			message: messages.expectedClosing,
			line: 1,
			column: 50,
		},
		{
			code: '[target ] { content: "[" }',
			fixed: '[ target ] { content: "[" }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[ target] { content: "[" }',
			fixed: '[ target ] { content: "[" }',
			message: messages.expectedClosing,
			line: 1,
			column: 8,
		},
		{
			code: '[target ] { content: "]" }',
			fixed: '[ target ] { content: "]" }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[ target] { content: "]" }',
			fixed: '[ target ] { content: "]" }',
			message: messages.expectedClosing,
			line: 1,
			column: 8,
		},
		{
			code: '[ foo=bar i] { }',
			fixed: '[ foo=bar i ] { }',
			message: messages.expectedClosing,
			line: 1,
			column: 11,
		},
		{
			code: '[foo=bar i ] { }',
			fixed: '[ foo=bar i ] { }',
			message: messages.expectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: 'img[alt~=person][src*=lorem] { }',
			fixed: 'img[ alt~=person ][ src*=lorem ] { }',
			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 5,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 15,
				},
				{
					message: messages.expectedOpening,
					line: 1,
					column: 18,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 27,
				},
			],
		},
		{
			code: '[/**/foo=bar i] { }',
			fixed: '[ /**/foo=bar i ] { }',
			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 14,
				},
			],
		},
		{
			code: '[foo=bar i /**/] { }',
			fixed: '[ foo=bar i /**/ ] { }',
			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 15,
				},
			],
		},
		{
			code: '[foo=bar i/**/] { }',
			fixed: '[ foo=bar i/**/ ] { }',

			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 14,
				},
			],
		},
		{
			code: '[foo=bar/**/] { }',
			fixed: '[ foo=bar/**/ ] { }',
			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 12,
				},
			],
		},
		{
			code: '[foo/**/] { }',
			fixed: '[ foo/**/ ] { }',
			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 8,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

	accept: [
		{
			code: '.foo { }',
		},
		{
			code: '[target] { }',
		},
		{
			code: '[target] { }',
		},
		{
			code: '[target=_blank] { }',
		},
		{
			code: "[target='_blank'] { }",
		},
		{
			code: '[target="_blank"] { }',
		},
		{
			code: '[title~=flower] { }',
		},
		{
			code: '[title|=flower] { }',
		},
		{
			code: '[title^=flower] { }',
		},
		{
			code: '[title$=flower] { }',
		},
		{
			code: 'a[href*=w3schools] { }',
		},
		{
			code: 'img[alt~=person][src*=lorem] { }',
		},
		{
			code: '[target=_blank]:hover { }',
		},
		{
			code: '[target=_blank]::before { }',
		},
		{
			code: 'option[data-hidden=true] { }',
		},
		{
			code: 'option[dataHidden] { }',
		},
		{
			code: '@media screen and (max-width: 480px) { img[align=right] {} }',
		},
		{
			code: '[target=_blank] .foo { }',
		},
		{
			code: 'li[aria-hidden=false]:nth-child(1) { }',
		},
		{
			code: 'li[aria-hidden=false]:nth-child( 1) { }',
		},
		{
			code: 'li[aria-hidden=false]:nth-child(1 ) { }',
		},
		{
			code: 'li[aria-hidden=false]:nth-child( 1 ) { }',
		},
		{
			code: 'ul li[aria-hidden=false] + li[aria-hidden=false] a { }',
		},
		{
			code: '[target] { content: "[" }',
		},
		{
			code: '[target] { content: "]" }',
		},
		{
			code: '[foo=bar i] { }',
		},
	],

	reject: [
		{
			code: '[ target] { }',
			fixed: '[target] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target ] { }',
			fixed: '[target] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 8,
		},
		{
			code: '[  target] { }',
			fixed: '[target] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target  ] { }',
			fixed: '[target] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 9,
		},
		{
			code: '[ target=_blank] { }',
			fixed: '[target=_blank] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target=_blank ] { }',
			fixed: '[target=_blank] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 15,
		},
		{
			code: '[  target=_blank] { }',
			fixed: '[target=_blank] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target=_blank  ] { }',
			fixed: '[target=_blank] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 16,
		},
		{
			code: "[ target='_blank'] { }",
			fixed: "[target='_blank'] { }",
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: "[target='_blank' ] { }",
			fixed: "[target='_blank'] { }",
			message: messages.rejectedClosing,
			line: 1,
			column: 17,
		},
		{
			code: '[ target="_blank"] { }',
			fixed: '[target="_blank"] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target="_blank" ] { }',
			fixed: '[target="_blank"] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 17,
		},
		{
			code: 'a[ href*=w3schools] { }',
			fixed: 'a[href*=w3schools] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 3,
		},
		{
			code: 'a[href*=w3schools ] { }',
			fixed: 'a[href*=w3schools] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 18,
		},
		{
			code: 'img[ alt~=person][src*=lorem] { }',
			fixed: 'img[alt~=person][src*=lorem] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 5,
		},
		{
			code: 'img[alt~=person ][src*=lorem] { }',
			fixed: 'img[alt~=person][src*=lorem] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 16,
		},
		{
			code: 'img[alt~=person][ src*=lorem] { }',
			fixed: 'img[alt~=person][src*=lorem] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 18,
		},
		{
			code: 'img[alt~=person][src*=lorem ] { }',
			fixed: 'img[alt~=person][src*=lorem] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 28,
		},
		{
			code: '[ target=_blank]:hover { }',
			fixed: '[target=_blank]:hover { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target=_blank ]:hover { }',
			fixed: '[target=_blank]:hover { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 15,
		},
		{
			code: '[ target=_blank]::before { }',
			fixed: '[target=_blank]::before { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target=_blank ]::before { }',
			fixed: '[target=_blank]::before { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 15,
		},
		{
			code: 'option[ data-hidden=true] { }',
			fixed: 'option[data-hidden=true] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 8,
		},
		{
			code: 'option[data-hidden=true ] { }',
			fixed: 'option[data-hidden=true] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 24,
		},
		{
			code: 'option[ dataHidden] { }',
			fixed: 'option[dataHidden] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 8,
		},
		{
			code: 'option[dataHidden ] { }',
			fixed: 'option[dataHidden] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 18,
		},
		{
			code: '@media screen and (max-width: 480px) { img[ align=right] {} }',
			fixed: '@media screen and (max-width: 480px) { img[align=right] {} }',
			message: messages.rejectedOpening,
			line: 1,
			column: 44,
		},
		{
			code: '@media screen and (max-width: 480px) { img[align=right ] {} }',
			fixed: '@media screen and (max-width: 480px) { img[align=right] {} }',
			message: messages.rejectedClosing,
			line: 1,
			column: 55,
		},
		{
			code: '[ target=_blank] .foo { }',
			fixed: '[target=_blank] .foo { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target=_blank ] .foo { }',
			fixed: '[target=_blank] .foo { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 15,
		},
		{
			code: 'li[ aria-hidden=false]:nth-child(1) { }',
			fixed: 'li[aria-hidden=false]:nth-child(1) { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 4,
		},
		{
			code: 'li[aria-hidden=false ]:nth-child(1) { }',
			fixed: 'li[aria-hidden=false]:nth-child(1) { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 21,
		},
		{
			code: 'li[ aria-hidden=false]:nth-child( 1 ) { }',
			fixed: 'li[aria-hidden=false]:nth-child( 1 ) { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 4,
		},
		{
			code: 'li[aria-hidden=false ]:nth-child( 1 ) { }',
			fixed: 'li[aria-hidden=false]:nth-child( 1 ) { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 21,
		},
		{
			code: 'ul li[ aria-hidden=false] + li[aria-hidden=false] a { }',
			fixed: 'ul li[aria-hidden=false] + li[aria-hidden=false] a { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 7,
		},
		{
			code: 'ul li[aria-hidden=false ] + li[aria-hidden=false] a { }',
			fixed: 'ul li[aria-hidden=false] + li[aria-hidden=false] a { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 24,
		},
		{
			code: 'ul li[aria-hidden=false] + li[ aria-hidden=false] a { }',
			fixed: 'ul li[aria-hidden=false] + li[aria-hidden=false] a { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 31,
		},
		{
			code: 'ul li[aria-hidden=false] + li[aria-hidden=false ] a { }',
			fixed: 'ul li[aria-hidden=false] + li[aria-hidden=false] a { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 48,
		},
		{
			code: '[ target] { content: "[" }',
			fixed: '[target] { content: "[" }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target ] { content: "[" }',
			fixed: '[target] { content: "[" }',
			message: messages.rejectedClosing,
			line: 1,
			column: 8,
		},
		{
			code: '[ target] { content: "]" }',
			fixed: '[target] { content: "]" }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[target ] { content: "]" }',
			fixed: '[target] { content: "]" }',
			message: messages.rejectedClosing,
			line: 1,
			column: 8,
		},
		{
			code: '[ foo=bar i] { }',
			fixed: '[foo=bar i] { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 2,
		},
		{
			code: '[foo=bar i ] { }',
			fixed: '[foo=bar i] { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 11,
		},
		{
			code: 'img[ alt~=person ][ src*=lorem ] { }',
			fixed: 'img[alt~=person][src*=lorem] { }',
			warnings: [
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 5,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 17,
				},
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 20,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 31,
				},
			],
		},
		{
			code: '[ /**/foo=bar i ] { }',
			fixed: '[/**/foo=bar i] { }',
			warnings: [
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 16,
				},
			],
		},
		{
			code: '[ foo=bar i /**/ ] { }',
			fixed: '[foo=bar i /**/] { }',
			warnings: [
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 17,
				},
			],
		},
		{
			code: '[ foo=bar i/**/ ] { }',
			fixed: '[foo=bar i/**/] { }',
			warnings: [
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 16,
				},
			],
		},
		{
			code: '[ foo=bar/**/ ] { }',
			fixed: '[foo=bar/**/] { }',
			warnings: [
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 14,
				},
			],
		},
		{
			code: '[ foo/**/ ] { }',
			fixed: '[foo/**/] { }',
			warnings: [
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 2,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 10,
				},
			],
		},
	],
});

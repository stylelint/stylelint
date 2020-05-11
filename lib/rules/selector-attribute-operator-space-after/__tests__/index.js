'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: '.foo {}',
		},
		{
			code: '[target] {}',
		},
		{
			code: '[ target] {}',
		},
		{
			code: '[target ] {}',
		},
		{
			code: '[ target ] {}',
		},
		{
			code: '[target= _blank] {}',
		},
		{
			code: '[target = _blank] {}',
		},
		{
			code: '[target= _blank ] {}',
		},
		{
			code: '[target = _blank ] {}',
		},
		{
			code: '[ target= _blank] {}',
		},
		{
			code: '[ target = _blank] {}',
		},
		{
			code: '[ target= _blank ] {}',
		},
		{
			code: '[ target = _blank ] {}',
		},
		{
			code: "[target= '_blank'] {}",
		},
		{
			code: "[target = '_blank'] {}",
		},
		{
			code: "[target= ' _blank'] {}",
		},
		{
			code: "[target= '_blank' ] {}",
		},
		{
			code: "[target= '_blank '] {}",
		},
		{
			code: "[target = '_blank' ] {}",
		},
		{
			code: "[target= ' _blank '] {}",
		},
		{
			code: "[ target= '_blank'] {}",
		},
		{
			code: "[ target = '_blank'] {}",
		},
		{
			code: "[ target= ' _blank'] {}",
		},
		{
			code: "[ target= '_blank' ] {}",
		},
		{
			code: "[ target= '_blank '] {}",
		},
		{
			code: "[ target = '_blank' ] {}",
		},
		{
			code: "[ target= ' _blank '] {}",
		},
		{
			code: '[target= "_blank"] {}',
		},
		{
			code: '[target = "_blank"] {}',
		},
		{
			code: '[target= " _blank"] {}',
		},
		{
			code: '[target= "_blank" ] {}',
		},
		{
			code: '[target= "_blank "] {}',
		},
		{
			code: '[target = "_blank" ] {}',
		},
		{
			code: '[target= " _blank "] {}',
		},
		{
			code: '[ target= "_blank"] {}',
		},
		{
			code: '[ target = "_blank"] {}',
		},
		{
			code: '[ target= " _blank"] {}',
		},
		{
			code: '[ target= "_blank" ] {}',
		},
		{
			code: '[ target= "_blank "] {}',
		},
		{
			code: '[ target = "_blank" ] {}',
		},
		{
			code: '[ target= " _blank "] {}',
		},
		{
			code: '[title~= flower] { }',
		},
		{
			code: '[title ~= flower] { }',
		},
		{
			code: '[title|= flower] { }',
		},
		{
			code: '[title |= flower] { }',
		},
		{
			code: '[title^= flower] { }',
		},
		{
			code: '[title ^= flower] { }',
		},
		{
			code: '[title$= flower] { }',
		},
		{
			code: '[title $= flower] { }',
		},
		{
			code: 'a[href*= w3schools] { }',
		},
		{
			code: 'a[href *= w3schools] { }',
		},
		{
			code: 'img[alt~= person][src*= lorem] { }',
		},
		{
			code: 'img[alt ~= person][src*= lorem] { }',
		},
		{
			code: 'img[alt~= person][src *= lorem] { }',
		},
		{
			code: 'img[alt ~= person][src *= lorem] { }',
		},
		{
			code: '[target= _blank]:hover { }',
		},
		{
			code: '[target = _blank]:hover { }',
		},
		{
			code: '[target= _blank]::before { }',
		},
		{
			code: '[target = _blank]::before { }',
		},
		{
			code: 'option[data-hidden= true] { }',
		},
		{
			code: 'option[data-hidden = true] { }',
		},
		{
			code: 'option[dataHidden] { }',
		},
		{
			code: '@media screen and (max-width: 480px) { img[align= right] {} }',
		},
		{
			code: '@media screen and (max-width: 480px) { img[align = right] {} }',
		},
		{
			code: '[target= _blank] .foo { }',
		},
		{
			code: '[target = _blank] .foo { }',
		},
		{
			code: 'li[aria-hidden= false]:nth-child(1) { }',
		},
		{
			code: 'li[aria-hidden= false]:nth-child( 1) { }',
		},
		{
			code: 'li[aria-hidden= false]:nth-child(1 ) { }',
		},
		{
			code: 'li[aria-hidden= false]:nth-child( 1 ) { }',
		},
		{
			code: 'li[aria-hidden = false]:nth-child(1) { }',
		},
		{
			code: 'li[aria-hidden = false]:nth-child( 1) { }',
		},
		{
			code: 'li[aria-hidden = false]:nth-child(1 ) { }',
		},
		{
			code: 'li[aria-hidden = false]:nth-child( 1 ) { }',
		},
		{
			code: 'ul li[aria-hidden= false] + li[aria-hidden= false] a { }',
		},
		{
			code: 'ul li[aria-hidden = false] + li[aria-hidden= false] a { }',
		},
		{
			code: 'ul li[aria-hidden= false] + li[aria-hidden = false] a { }',
		},
		{
			code: 'ul li[aria-hidden = false] + li[aria-hidden = false] a { }',
		},
		{
			code: '[target] { content: " " }',
		},
		{
			code: '[target ] { content: " " }',
		},
		{
			code: '[ target] { content: " " }',
		},
		{
			code: '[ target ] { content: " " }',
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
			code: '[target=_blank] { }',
			fixed: '[target= _blank] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target =_blank] { }',
			fixed: '[target = _blank] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target=_blank ] { }',
			fixed: '[target= _blank ] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target =_blank ] { }',
			fixed: '[target = _blank ] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target=_blank] { }',
			fixed: '[ target= _blank] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target =_blank] { }',
			fixed: '[ target = _blank] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: '[ target=_blank ] { }',
			fixed: '[ target= _blank ] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target =_blank ] { }',
			fixed: '[ target = _blank ] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: "[target='_blank'] { }",
			fixed: "[target= '_blank'] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[target ='_blank'] { }",
			fixed: "[target = '_blank'] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[target=' _blank'] { }",
			fixed: "[target= ' _blank'] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[target='_blank' ] { }",
			fixed: "[target= '_blank' ] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[target='_blank '] { }",
			fixed: "[target= '_blank '] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[target ='_blank' ] { }",
			fixed: "[target = '_blank' ] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[target=' _blank '] { }",
			fixed: "[target= ' _blank '] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[ target='_blank'] { }",
			fixed: "[ target= '_blank'] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[ target ='_blank'] { }",
			fixed: "[ target = '_blank'] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: "[ target=' _blank'] { }",
			fixed: "[ target= ' _blank'] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[ target='_blank' ] { }",
			fixed: "[ target= '_blank' ] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[ target='_blank '] { }",
			fixed: "[ target= '_blank '] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[ target ='_blank' ] { }",
			fixed: "[ target = '_blank' ] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: "[ target=' _blank '] { }",
			fixed: "[ target= ' _blank '] { }",
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target="_blank"] { }',
			fixed: '[target= "_blank"] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target ="_blank"] { }',
			fixed: '[target = "_blank"] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target=" _blank"] { }',
			fixed: '[target= " _blank"] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target="_blank" ] { }',
			fixed: '[target= "_blank" ] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target="_blank "] { }',
			fixed: '[target= "_blank "] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target ="_blank" ] { }',
			fixed: '[target = "_blank" ] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target=" _blank "] { }',
			fixed: '[target= " _blank "] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[ target="_blank"] { }',
			fixed: '[ target= "_blank"] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target ="_blank"] { }',
			fixed: '[ target = "_blank"] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: '[ target=" _blank"] { }',
			fixed: '[ target= " _blank"] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target="_blank" ] { }',
			fixed: '[ target= "_blank" ] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target="_blank "] { }',
			fixed: '[ target= "_blank "] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target ="_blank" ] { }',
			fixed: '[ target = "_blank" ] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: '[ target=" _blank "] { }',
			fixed: '[ target= " _blank "] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[title~=flower] { }',
			fixed: '[title~= flower] { }',
			message: messages.expectedAfter('~='),
			line: 1,
			column: 8,
		},
		{
			code: '[title ~=flower] { }',
			fixed: '[title ~= flower] { }',
			message: messages.expectedAfter('~='),
			line: 1,
			column: 9,
		},
		{
			code: '[title|=flower] { }',
			fixed: '[title|= flower] { }',
			message: messages.expectedAfter('|='),
			line: 1,
			column: 8,
		},
		{
			code: '[title |=flower] { }',
			fixed: '[title |= flower] { }',
			message: messages.expectedAfter('|='),
			line: 1,
			column: 9,
		},
		{
			code: '[title^=flower] { }',
			fixed: '[title^= flower] { }',
			message: messages.expectedAfter('^='),
			line: 1,
			column: 8,
		},
		{
			code: '[title ^=flower] { }',
			fixed: '[title ^= flower] { }',
			message: messages.expectedAfter('^='),
			line: 1,
			column: 9,
		},
		{
			code: '[title$=flower] { }',
			fixed: '[title$= flower] { }',
			message: messages.expectedAfter('$='),
			line: 1,
			column: 8,
		},
		{
			code: '[title $=flower] { }',
			fixed: '[title $= flower] { }',
			message: messages.expectedAfter('$='),
			line: 1,
			column: 9,
		},
		{
			code: 'a[href*=w3schools] { }',
			fixed: 'a[href*= w3schools] { }',
			message: messages.expectedAfter('*='),
			line: 1,
			column: 8,
		},
		{
			code: 'a[href *=w3schools] { }',
			fixed: 'a[href *= w3schools] { }',
			message: messages.expectedAfter('*='),
			line: 1,
			column: 9,
		},
		{
			code: 'img[alt~=person][src*= lorem] { }',
			fixed: 'img[alt~= person][src*= lorem] { }',
			message: messages.expectedAfter('~='),
			line: 1,
			column: 9,
		},
		{
			code: 'img[alt ~=person][src*= lorem] { }',
			fixed: 'img[alt ~= person][src*= lorem] { }',
			message: messages.expectedAfter('~='),
			line: 1,
			column: 10,
		},
		{
			code: 'img[alt~= person][src *=lorem] { }',
			fixed: 'img[alt~= person][src *= lorem] { }',
			message: messages.expectedAfter('*='),
			line: 1,
			column: 24,
		},
		{
			code: 'img[alt ~= person][src *=lorem] { }',
			fixed: 'img[alt ~= person][src *= lorem] { }',
			message: messages.expectedAfter('*='),
			line: 1,
			column: 25,
		},
		{
			code: '[target=_blank]:hover { }',
			fixed: '[target= _blank]:hover { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target =_blank]:hover { }',
			fixed: '[target = _blank]:hover { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target=_blank]::before { }',
			fixed: '[target= _blank]::before { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target =_blank]::before { }',
			fixed: '[target = _blank]::before { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: 'option[data-hidden=true] { }',
			fixed: 'option[data-hidden= true] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 19,
		},
		{
			code: 'option[data-hidden =true] { }',
			fixed: 'option[data-hidden = true] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 20,
		},
		{
			code: '@media screen and (max-width: 480px) { img[align=right] {} }',
			fixed: '@media screen and (max-width: 480px) { img[align= right] {} }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 49,
		},
		{
			code: '@media screen and (max-width: 480px) { img[align =right] {} }',
			fixed: '@media screen and (max-width: 480px) { img[align = right] {} }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 50,
		},
		{
			code: '[target=_blank] .foo { }',
			fixed: '[target= _blank] .foo { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target =_blank] .foo { }',
			fixed: '[target = _blank] .foo { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: 'li[aria-hidden=false]:nth-child(1) { }',
			fixed: 'li[aria-hidden= false]:nth-child(1) { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 15,
		},
		{
			code: 'li[aria-hidden=false]:nth-child( 1) { }',
			fixed: 'li[aria-hidden= false]:nth-child( 1) { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 15,
		},
		{
			code: 'li[aria-hidden=false]:nth-child(1 ) { }',
			fixed: 'li[aria-hidden= false]:nth-child(1 ) { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 15,
		},
		{
			code: 'li[aria-hidden=false]:nth-child( 1 ) { }',
			fixed: 'li[aria-hidden= false]:nth-child( 1 ) { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 15,
		},
		{
			code: 'li[aria-hidden =false]:nth-child(1) { }',
			fixed: 'li[aria-hidden = false]:nth-child(1) { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 16,
		},
		{
			code: 'li[aria-hidden =false]:nth-child( 1) { }',
			fixed: 'li[aria-hidden = false]:nth-child( 1) { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 16,
		},
		{
			code: 'li[aria-hidden =false]:nth-child(1 ) { }',
			fixed: 'li[aria-hidden = false]:nth-child(1 ) { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 16,
		},
		{
			code: 'li[aria-hidden =false]:nth-child( 1 ) { }',
			fixed: 'li[aria-hidden = false]:nth-child( 1 ) { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 16,
		},
		{
			code: 'ul li[aria-hidden=false] + li[aria-hidden= false] a { }',
			fixed: 'ul li[aria-hidden= false] + li[aria-hidden= false] a { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 18,
		},
		{
			code: 'ul li[aria-hidden= false] + li[aria-hidden=false] a { }',
			fixed: 'ul li[aria-hidden= false] + li[aria-hidden= false] a { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 43,
		},
		{
			code: 'ul li[aria-hidden =false] + li[aria-hidden= false] a { }',
			fixed: 'ul li[aria-hidden = false] + li[aria-hidden= false] a { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 19,
		},
		{
			code: 'ul li[aria-hidden = false] + li[aria-hidden=false] a { }',
			fixed: 'ul li[aria-hidden = false] + li[aria-hidden= false] a { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 44,
		},
		{
			code: 'ul li[aria-hidden=false] + li[aria-hidden = false] a { }',
			fixed: 'ul li[aria-hidden= false] + li[aria-hidden = false] a { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 18,
		},
		{
			code: 'ul li[aria-hidden= false] + li[aria-hidden =false] a { }',
			fixed: 'ul li[aria-hidden= false] + li[aria-hidden = false] a { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 44,
		},
		{
			code: 'ul li[aria-hidden =false] + li[aria-hidden = false] a { }',
			fixed: 'ul li[aria-hidden = false] + li[aria-hidden = false] a { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 19,
		},
		{
			code: 'ul li[aria-hidden = false] + li[aria-hidden =false] a { }',
			fixed: 'ul li[aria-hidden = false] + li[aria-hidden = false] a { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 45,
		},
		{
			code: 'ul li[aria-hidden=false] + li[aria-hidden=false] a { }',
			fixed: 'ul li[aria-hidden= false] + li[aria-hidden= false] a { }',
			warnings: [
				{
					message: messages.expectedAfter('='),
					line: 1,
					column: 18,
				},
				{
					message: messages.expectedAfter('='),
					line: 1,
					column: 42,
				},
			],
		},
		{
			code: '[target=/**/"_blank"] { }',
			fixed: '[target= /**/"_blank"] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target=/**/ "_blank"] { }',
			fixed: '[target= /**/ "_blank"] { }',
			message: messages.expectedAfter('='),
			line: 1,
			column: 8,
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
			code: '[ target] { }',
		},
		{
			code: '[target ] { }',
		},
		{
			code: '[ target ] { }',
		},
		{
			code: '[target=_blank] { }',
		},
		{
			code: '[target =_blank] { }',
		},
		{
			code: '[target=_blank ] { }',
		},
		{
			code: '[target =_blank ] { }',
		},
		{
			code: '[ target=_blank] { }',
		},
		{
			code: '[ target =_blank] { }',
		},
		{
			code: '[ target=_blank ] { }',
		},
		{
			code: '[ target =_blank ] { }',
		},
		{
			code: "[target='_blank'] { }",
		},
		{
			code: "[target ='_blank'] { }",
		},
		{
			code: "[target=' _blank'] { }",
		},
		{
			code: "[target='_blank' ] { }",
		},
		{
			code: "[target='_blank '] { }",
		},
		{
			code: "[target ='_blank' ] { }",
		},
		{
			code: "[target=' _blank '] { }",
		},
		{
			code: "[ target='_blank'] { }",
		},
		{
			code: "[ target ='_blank'] { }",
		},
		{
			code: "[ target=' _blank'] { }",
		},
		{
			code: "[ target='_blank' ] { }",
		},
		{
			code: "[ target='_blank '] { }",
		},
		{
			code: "[ target ='_blank' ] { }",
		},
		{
			code: "[ target=' _blank '] { }",
		},
		{
			code: '[target="_blank"] { }',
		},
		{
			code: '[target ="_blank"] { }',
		},
		{
			code: '[target=" _blank"] { }',
		},
		{
			code: '[target="_blank" ] { }',
		},
		{
			code: '[target="_blank "] { }',
		},
		{
			code: '[target ="_blank" ] { }',
		},
		{
			code: '[target=" _blank "] { }',
		},
		{
			code: '[ target="_blank"] { }',
		},
		{
			code: '[ target ="_blank"] { }',
		},
		{
			code: '[ target=" _blank"] { }',
		},
		{
			code: '[ target="_blank" ] { }',
		},
		{
			code: '[ target="_blank "] { }',
		},
		{
			code: '[ target ="_blank" ] { }',
		},
		{
			code: '[ target=" _blank "] { }',
		},
		{
			code: '[title~=flower] { }',
		},
		{
			code: '[title ~=flower] { }',
		},
		{
			code: '[title|=flower] { }',
		},
		{
			code: '[title |=flower] { }',
		},
		{
			code: '[title^=flower] { }',
		},
		{
			code: '[title ^=flower] { }',
		},
		{
			code: '[title$=flower] { }',
		},
		{
			code: '[title $=flower] { }',
		},
		{
			code: 'a[href*=w3schools] { }',
		},
		{
			code: 'a[href *=w3schools] { }',
		},
		{
			code: 'img[alt~=person][src*=lorem] { }',
		},
		{
			code: 'img[alt ~=person][src*=lorem] { }',
		},
		{
			code: 'img[alt~=person][src *=lorem] { }',
		},
		{
			code: 'img[alt ~=person][src *=lorem] { }',
		},
		{
			code: '[target=_blank]:hover { }',
		},
		{
			code: '[target =_blank]:hover { }',
		},
		{
			code: '[target=_blank]::before { }',
		},
		{
			code: '[target =_blank]::before { }',
		},
		{
			code: 'option[data-hidden=true] { }',
		},
		{
			code: 'option[data-hidden =true] { }',
		},
		{
			code: 'option[dataHidden] { }',
		},
		{
			code: '@media screen and (max-width: 480px) { img[align=right] {} }',
		},
		{
			code: '@media screen and (max-width: 480px) { img[align =right] {} }',
		},
		{
			code: '[target=_blank] .foo { }',
		},
		{
			code: '[target =_blank] .foo { }',
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
			code: 'li[aria-hidden =false]:nth-child(1) { }',
		},
		{
			code: 'li[aria-hidden =false]:nth-child( 1) { }',
		},
		{
			code: 'li[aria-hidden =false]:nth-child(1 ) { }',
		},
		{
			code: 'li[aria-hidden =false]:nth-child( 1 ) { }',
		},
		{
			code: 'ul li[aria-hidden=false] + li[aria-hidden=false] a { }',
		},
		{
			code: 'ul li[aria-hidden =false] + li[aria-hidden=false] a { }',
		},
		{
			code: 'ul li[aria-hidden=false] + li[aria-hidden =false] a { }',
		},
		{
			code: 'ul li[aria-hidden =false] + li[aria-hidden =false] a { }',
		},
		{
			code: '[target] { content: " " }',
		},
		{
			code: '[target ] { content: " " }',
		},
		{
			code: '[ target] { content: " " }',
		},
		{
			code: '[ target ] { content: " " }',
		},
	],

	reject: [
		{
			code: '[target= _blank] { }',
			fixed: '[target=_blank] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target = _blank] { }',
			fixed: '[target =_blank] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target= _blank ] { }',
			fixed: '[target=_blank ] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target = _blank ] { }',
			fixed: '[target =_blank ] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target= _blank] { }',
			fixed: '[ target=_blank] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target = _blank] { }',
			fixed: '[ target =_blank] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: '[ target= _blank ] { }',
			fixed: '[ target=_blank ] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target = _blank ] { }',
			fixed: '[ target =_blank ] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: "[target= '_blank'] { }",
			fixed: "[target='_blank'] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[target = '_blank'] { }",
			fixed: "[target ='_blank'] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[target= ' _blank'] { }",
			fixed: "[target=' _blank'] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[target= '_blank' ] { }",
			fixed: "[target='_blank' ] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[target= '_blank '] { }",
			fixed: "[target='_blank '] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[target = '_blank' ] { }",
			fixed: "[target ='_blank' ] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[target= ' _blank '] { }",
			fixed: "[target=' _blank '] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: "[ target= '_blank'] { }",
			fixed: "[ target='_blank'] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[ target = '_blank'] { }",
			fixed: "[ target ='_blank'] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: "[ target= ' _blank'] { }",
			fixed: "[ target=' _blank'] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[ target= '_blank' ] { }",
			fixed: "[ target='_blank' ] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[ target= '_blank '] { }",
			fixed: "[ target='_blank '] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: "[ target = '_blank' ] { }",
			fixed: "[ target ='_blank' ] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: "[ target= ' _blank '] { }",
			fixed: "[ target=' _blank '] { }",
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target= "_blank"] { }',
			fixed: '[target="_blank"] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target = "_blank"] { }',
			fixed: '[target ="_blank"] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target= " _blank"] { }',
			fixed: '[target=" _blank"] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target= "_blank" ] { }',
			fixed: '[target="_blank" ] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target= "_blank "] { }',
			fixed: '[target="_blank "] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target = "_blank" ] { }',
			fixed: '[target ="_blank" ] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target= " _blank "] { }',
			fixed: '[target=" _blank "] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[ target= "_blank"] { }',
			fixed: '[ target="_blank"] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target = "_blank"] { }',
			fixed: '[ target ="_blank"] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: '[ target= " _blank"] { }',
			fixed: '[ target=" _blank"] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target= "_blank" ] { }',
			fixed: '[ target="_blank" ] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target= "_blank "] { }',
			fixed: '[ target="_blank "] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[ target = "_blank" ] { }',
			fixed: '[ target ="_blank" ] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 10,
		},
		{
			code: '[ target= " _blank "] { }',
			fixed: '[ target=" _blank "] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[title~= flower] { }',
			fixed: '[title~=flower] { }',
			message: messages.rejectedAfter('~='),
			line: 1,
			column: 8,
		},
		{
			code: '[title ~= flower] { }',
			fixed: '[title ~=flower] { }',
			message: messages.rejectedAfter('~='),
			line: 1,
			column: 9,
		},
		{
			code: '[title|= flower] { }',
			fixed: '[title|=flower] { }',
			message: messages.rejectedAfter('|='),
			line: 1,
			column: 8,
		},
		{
			code: '[title |= flower] { }',
			fixed: '[title |=flower] { }',
			message: messages.rejectedAfter('|='),
			line: 1,
			column: 9,
		},
		{
			code: '[title^= flower] { }',
			fixed: '[title^=flower] { }',
			message: messages.rejectedAfter('^='),
			line: 1,
			column: 8,
		},
		{
			code: '[title ^= flower] { }',
			fixed: '[title ^=flower] { }',
			message: messages.rejectedAfter('^='),
			line: 1,
			column: 9,
		},
		{
			code: '[title$= flower] { }',
			fixed: '[title$=flower] { }',
			message: messages.rejectedAfter('$='),
			line: 1,
			column: 8,
		},
		{
			code: '[title $= flower] { }',
			fixed: '[title $=flower] { }',
			message: messages.rejectedAfter('$='),
			line: 1,
			column: 9,
		},
		{
			code: 'a[href*= w3schools] { }',
			fixed: 'a[href*=w3schools] { }',
			message: messages.rejectedAfter('*='),
			line: 1,
			column: 8,
		},
		{
			code: 'a[href *= w3schools] { }',
			fixed: 'a[href *=w3schools] { }',
			message: messages.rejectedAfter('*='),
			line: 1,
			column: 9,
		},
		{
			code: 'img[alt~= person][src*=lorem] { }',
			fixed: 'img[alt~=person][src*=lorem] { }',
			message: messages.rejectedAfter('~='),
			line: 1,
			column: 9,
		},
		{
			code: 'img[alt ~= person][src*=lorem] { }',
			fixed: 'img[alt ~=person][src*=lorem] { }',
			message: messages.rejectedAfter('~='),
			line: 1,
			column: 10,
		},
		{
			code: 'img[alt~=person][src *= lorem] { }',
			fixed: 'img[alt~=person][src *=lorem] { }',
			message: messages.rejectedAfter('*='),
			line: 1,
			column: 23,
		},
		{
			code: 'img[alt ~=person][src *= lorem] { }',
			fixed: 'img[alt ~=person][src *=lorem] { }',
			message: messages.rejectedAfter('*='),
			line: 1,
			column: 24,
		},
		{
			code: '[target= _blank]:hover { }',
			fixed: '[target=_blank]:hover { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target = _blank]:hover { }',
			fixed: '[target =_blank]:hover { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: '[target= _blank]::before { }',
			fixed: '[target=_blank]::before { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target = _blank]::before { }',
			fixed: '[target =_blank]::before { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: 'option[data-hidden= true] { }',
			fixed: 'option[data-hidden=true] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 19,
		},
		{
			code: 'option[data-hidden = true] { }',
			fixed: 'option[data-hidden =true] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 20,
		},
		{
			code: '@media screen and (max-width: 480px) { img[align= right] {} }',
			fixed: '@media screen and (max-width: 480px) { img[align=right] {} }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 49,
		},
		{
			code: '@media screen and (max-width: 480px) { img[align = right] {} }',
			fixed: '@media screen and (max-width: 480px) { img[align =right] {} }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 50,
		},
		{
			code: '[target= _blank] .foo { }',
			fixed: '[target=_blank] .foo { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target = _blank] .foo { }',
			fixed: '[target =_blank] .foo { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 9,
		},
		{
			code: 'li[aria-hidden= false]:nth-child(1) { }',
			fixed: 'li[aria-hidden=false]:nth-child(1) { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 15,
		},
		{
			code: 'li[aria-hidden= false]:nth-child( 1) { }',
			fixed: 'li[aria-hidden=false]:nth-child( 1) { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 15,
		},
		{
			code: 'li[aria-hidden= false]:nth-child(1 ) { }',
			fixed: 'li[aria-hidden=false]:nth-child(1 ) { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 15,
		},
		{
			code: 'li[aria-hidden= false]:nth-child( 1 ) { }',
			fixed: 'li[aria-hidden=false]:nth-child( 1 ) { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 15,
		},
		{
			code: 'li[aria-hidden = false]:nth-child(1) { }',
			fixed: 'li[aria-hidden =false]:nth-child(1) { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 16,
		},
		{
			code: 'li[aria-hidden = false]:nth-child( 1) { }',
			fixed: 'li[aria-hidden =false]:nth-child( 1) { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 16,
		},
		{
			code: 'li[aria-hidden = false]:nth-child(1 ) { }',
			fixed: 'li[aria-hidden =false]:nth-child(1 ) { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 16,
		},
		{
			code: 'li[aria-hidden = false]:nth-child( 1 ) { }',
			fixed: 'li[aria-hidden =false]:nth-child( 1 ) { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 16,
		},
		{
			code: 'ul li[aria-hidden= false] + li[aria-hidden=false] a { }',
			fixed: 'ul li[aria-hidden=false] + li[aria-hidden=false] a { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 18,
		},
		{
			code: 'ul li[aria-hidden=false] + li[aria-hidden= false] a { }',
			fixed: 'ul li[aria-hidden=false] + li[aria-hidden=false] a { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 42,
		},
		{
			code: 'ul li[aria-hidden = false] + li[aria-hidden=false] a { }',
			fixed: 'ul li[aria-hidden =false] + li[aria-hidden=false] a { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 19,
		},
		{
			code: 'ul li[aria-hidden =false] + li[aria-hidden= false] a { }',
			fixed: 'ul li[aria-hidden =false] + li[aria-hidden=false] a { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 43,
		},
		{
			code: 'ul li[aria-hidden= false] + li[aria-hidden =false] a { }',
			fixed: 'ul li[aria-hidden=false] + li[aria-hidden =false] a { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 18,
		},
		{
			code: 'ul li[aria-hidden=false] + li[aria-hidden = false] a { }',
			fixed: 'ul li[aria-hidden=false] + li[aria-hidden =false] a { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 43,
		},
		{
			code: 'ul li[aria-hidden = false] + li[aria-hidden =false] a { }',
			fixed: 'ul li[aria-hidden =false] + li[aria-hidden =false] a { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 19,
		},
		{
			code: 'ul li[aria-hidden =false] + li[aria-hidden = false] a { }',
			fixed: 'ul li[aria-hidden =false] + li[aria-hidden =false] a { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 44,
		},
		{
			code: 'ul li[aria-hidden = false] + li[aria-hidden = false] a { }',
			fixed: 'ul li[aria-hidden =false] + li[aria-hidden =false] a { }',
			warnings: [
				{
					message: messages.rejectedAfter('='),
					line: 1,
					column: 19,
				},
				{
					message: messages.rejectedAfter('='),
					line: 1,
					column: 45,
				},
			],
		},
		{
			code: '[target= /**/"_blank"] { }',
			fixed: '[target=/**/"_blank"] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
		{
			code: '[target= /**/ "_blank"] { }',
			fixed: '[target=/**/ "_blank"] { }',
			message: messages.rejectedAfter('='),
			line: 1,
			column: 8,
		},
	],
});

'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: 'a,\nb {}',
		},
		{
			code: 'a,\n\nb {}',
		},
		{
			code: 'a,\r\nb {}',
			description: 'CRLF',
		},
		{
			code: 'a,\r\n\r\nb {}',
			description: 'Double CRLF',
		},
		{
			code: 'a,\nb,\nc {}',
		},
		{
			code: 'a ,\nb {}',
		},
		{
			code: 'a\n,\nb {}',
		},
		{
			code: 'a\r\n,\r\nb {}',
			description: 'CRLF',
		},
		{
			code: 'a,\nb[data-foo="tr,tr"] {}',
		},
		{
			code: 'a {\n  &:hover,\n  &:focus {\n    color: pink; }\n}',
			description: 'nested in rule set',
		},
		{
			code: '@media (min-width: 10px) {\n  a,\n  b {}\n}',
			description: 'nested in at-rule',
		},
		{
			code: '@media (min-width: 10px) {\r\n  a,\r\n  b {}\r\n}',
			description: 'nested in at-rule and CRLF',
		},
		{
			code: '\ta,\n\tb {}',
			description: 'indented statement',
		},
		{
			code: 'a, /* comment */\nb {}',
			description: 'with end-of-line comment with newline after',
		},
		{
			code: 'a,   /* comment */\nb {}',
			description: 'with end-of-line and few spaces /* comment */ with newline after',
		},
		{
			code: 'a,\t/* comment */\nb {}',
			description: 'with end-of-line and a tab /* comment */ with newline after',
		},
		{
			code: 'a,\t\t/* comment */\nb {}',
			description: 'with end-of-line and few tabs /* comment */ with newline after',
		},
		{
			code: 'a, \t \t /* comment */\nb {}',
			description: 'with end-of-line and few tabs and spaces /* comment */ with newline after',
		},
		{
			code: 'a, /* comment\n       commentline2 */\nb {}',
			description: 'with end-of-line multi-line comment with newline after',
		},
		{
			code: 'a,   /* comment\n       commentline2 */\nb {}',
			description: 'with end-of-line and few spaces multi-line comment with newline after',
		},
		{
			code: 'a,\t/* comment\n       commentline2 */\nb {}',
			description: 'with end-of-line and a tab multi-line comment with newline after',
		},
		{
			code: 'a,\t\t/* comment\n       commentline2 */\nb {}',
			description: 'with end-of-line and few tabs multi-line comment with newline after',
		},
		{
			code: 'a, \t \t /* comment\n       commentline2 */\nb {}',
			description: 'with end-of-line and few tabs and spaces multi-line comment with newline after',
		},
		{
			code: 'a:matches(:hover, :focus) {}',
			description: 'comma inside :matches()',
		},
		{
			code: ':not(:hover, :focus) {}',
			description: 'comma inside :not()',
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
	],

	reject: [
		{
			code: 'a,b {}',
			fixed: 'a,\nb {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 2,
		},
		{
			code: 'a, b {}',
			fixed: 'a,\n b {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,  b {}',
			fixed: 'a,\n  b {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\tb {}',
			fixed: 'a,\n\tb {}',
			message: messages.expectedAfter(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\nb,c {}',
			fixed: 'a,\nb,\nc {}',
			message: messages.expectedAfter(),
			line: 2,
			column: 2,
		},
		{
			code: 'a,\r\nb,c {}',
			fixed: 'a,\r\nb,\r\nc {}',
			description: 'CRLF',
			message: messages.expectedAfter(),
			line: 2,
			column: 2,
		},
		{
			code: 'a, /* comment */ b {}',
			fixed: 'a, /* comment */\n b {}',
			description: 'with post-comma comment without newline after',
			message: messages.expectedAfter(),
			line: 1,
			column: 2,
		},
		{
			code: 'a, /* comment\n       commentline2 */b {}',
			fixed: 'a, /* comment\n       commentline2 */\nb {}',
			description: 'with post-comma multi-line comment without newline after',
			message: messages.expectedAfter(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z {\n}',
			fixed:
				'a,\nb,\nc,\nd,\ne,\nf,\ng,\nh,\ni,\nj,\nk,\nl,\nm,\nn,\no,\np,\nq,\nr,\ns,\nt,\nu,\nv,\nw,\nx,\ny,\nz {\n}',
			warnings: new Array(25).fill(0).map((_, i) => ({
				message: messages.expectedAfter(),
				line: 1,
				column: 2 * (i + 1),
			})),
		},
	],
});

testRule({
	ruleName,
	config: ['always-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a,\nb {}',
		},
		{
			code: 'a,\r\nb {}',
			description: 'CRLF',
		},
		{
			code: 'a, b {}',
			description: 'ignores single-line',
		},
		{
			code: 'a, b {\n}',
			description: 'ignores single-line selector list, multi-line block',
		},
		{
			code: 'a, b {\r\n}',
			description: 'ignores single-line selector list, multi-line block with CRLF',
		},
		{
			code: '\ta,\n\tb {\n}',
			description: 'indented statement',
		},
	],

	reject: [
		{
			code: 'a,\nb, c {}',
			fixed: 'a,\nb,\n c {}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
		{
			code: 'a,\nb, c {\n}',
			fixed: 'a,\nb,\n c {\n}',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
		{
			code: 'a,\r\nb, c {\r\n}',
			fixed: 'a,\r\nb,\r\n c {\r\n}',
			description: 'CRLF',
			message: messages.expectedAfterMultiLine(),
			line: 2,
			column: 2,
		},
	],
});

testRule({
	ruleName,
	config: ['never-multi-line'],
	fix: true,

	accept: [
		{
			code: 'a\n,b {}',
		},
		{
			code: 'a ,b {}',
			description: 'ignores single-line',
		},
		{
			code: 'a ,b {\n}',
			description: 'ignores single-line selector list, multi-line block',
		},
		{
			code: 'a:matches(:hover, :focus) {}',
			description: 'comma inside :matches()',
		},
		{
			code: ':not(:hover, :focus) {}',
			description: 'comma inside :not()',
		},
	],

	reject: [
		{
			code: 'a,\nb ,c {}',
			fixed: 'a,b ,c {}',
			message: messages.rejectedAfterMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\r\nb ,c {}',
			fixed: 'a,b ,c {}',
			description: 'CRLF',
			message: messages.rejectedAfterMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\nb ,c {\n}',
			fixed: 'a,b ,c {\n}',
			message: messages.rejectedAfterMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\n\n   \t b ,c {\n}',
			fixed: 'a,b ,c {\n}',
			message: messages.rejectedAfterMultiLine(),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\n/*comment*/\nb ,\nc {\n}',
			fixed: 'a,\n/*comment*/b ,c {\n}',
			warnings: [
				{
					message: messages.rejectedAfterMultiLine(),
					line: 1,
					column: 2,
				},
				{
					message: messages.rejectedAfterMultiLine(),
					line: 3,
					column: 3,
				},
			],
		},
		{
			code:
				'a,\nb,\nc,\nd,\ne,\nf,\ng,\nh,\ni,\nj,\nk,\nl,\nm,\nn,\no,\np,\nq,\nr,\ns,\nt,\nu,\nv,\nw,\nx,\ny,\nz {\n}',
			fixed: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z {\n}',
			warnings: new Array(25).fill(0).map((_, i) => ({
				message: messages.rejectedAfterMultiLine(),
				line: 1 + i,
				column: 2,
			})),
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: 'a, // comment\nb {}',
			description: 'with end-of-line // comment with newline after',
		},
		{
			code: 'a,   // comment\nb {}',
			description: 'with end-of-line and few spaces // comment with newline after',
		},
		{
			code: 'a,\t// comment\nb {}',
			description: 'with end-of-line and a tab // comment with newline after',
		},
		{
			code: 'a,\t\t// comment\nb {}',
			description: 'with end-of-line and few tabs // comment with newline after',
		},
		{
			code: 'a, \t \t // comment\nb {}',
			description: 'with end-of-line and few tabs and spaces // comment with newline after',
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	skipBasicChecks: true,
	syntax: 'less',
	fix: true,

	accept: [
		{
			code: 'a, // comment\nb {}',
			description: 'with end-of-line // comment with newline after',
		},
		{
			code: 'a,   // comment\nb {}',
			description: 'with end-of-line and few spaces // comment with newline after',
		},
		{
			code: 'a,\t// comment\nb {}',
			description: 'with end-of-line and a tab // comment with newline after',
		},
		{
			code: 'a,\t\t// comment\nb {}',
			description: 'with end-of-line and few tabs // comment with newline after',
		},
		{
			code: 'a, \t \t // comment\nb {}',
			description: 'with end-of-line and few tabs and spaces // comment with newline after',
		},
		{
			code: '.col( @a, @b ) {}',
			description: 'mixin ending in a char',
		},
		{
			code: '.col3( @a, @b ) {}',
			description: 'mixin ending in a number',
		},
	],
});

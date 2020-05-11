'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '.class { }',
		},
		{
			code: '.foo.class > .foo.class { }',
		},
		{
			code: '.foo#id { }',
		},
		{
			code: '.class[target] { }',
		},
		{
			code: '.class#id[target] { }',
		},
		{
			code: '#id { }',
		},
		{
			code: '#id.class { }',
		},
		{
			code: '#id.class[target] { }',
		},
		{
			code: '* { }',
		},
		{
			code: 'p { }',
		},
		{
			code: 'div, p { }',
		},
		{
			code: '.class, p { }',
		},
		{
			code: 'div, .class { }',
		},
		{
			code: '.class, .class { }',
		},
		{
			code: '#id, p { }',
		},
		{
			code: 'div, #id { }',
		},
		{
			code: '#id, #id { }',
		},
		{
			code: '[attribute], p { }',
		},
		{
			code: 'div, [attribute] { }',
		},
		{
			code: '[attribute], [src] { }',
		},
		{
			code: 'div p { }',
		},
		{
			code: '.class p { }',
		},
		{
			code: 'div .class { }',
		},
		{
			code: '.class .class { }',
		},
		{
			code: '#id p { }',
		},
		{
			code: 'div #id { }',
		},
		{
			code: '#id #id { }',
		},
		{
			code: '[attribute] p { }',
		},
		{
			code: 'div [attribute] { }',
		},
		{
			code: '[attribute] [src] { }',
		},
		{
			code: 'div > p { }',
		},
		{
			code: '.class > p { }',
		},
		{
			code: 'div > .class { }',
		},
		{
			code: '.class > .class { }',
		},
		{
			code: '#id > p { }',
		},
		{
			code: 'div > #id { }',
		},
		{
			code: '#id > #id { }',
		},
		{
			code: '[attribute] > p { }',
		},
		{
			code: 'div > [attribute] { }',
		},
		{
			code: '[attribute] > [src] { }',
		},
		{
			code: 'div + p { }',
		},
		{
			code: '.class + p { }',
		},
		{
			code: 'div + .class { }',
		},
		{
			code: '.class + .class { }',
		},
		{
			code: '#id + p { }',
		},
		{
			code: 'div + #id { }',
		},
		{
			code: '#id + #id { }',
		},
		{
			code: '[attribute] + p { }',
		},
		{
			code: 'div + [attribute] { }',
		},
		{
			code: '[attribute] + [src] { }',
		},
		{
			code: 'div ~ p { }',
		},
		{
			code: '.class ~ p { }',
		},
		{
			code: 'div ~ .class { }',
		},
		{
			code: '.class ~ .class { }',
		},
		{
			code: '#id ~ p { }',
		},
		{
			code: 'div ~ #id { }',
		},
		{
			code: '#id ~ #id { }',
		},
		{
			code: '[attribute] ~ p { }',
		},
		{
			code: 'div ~ [attribute] { }',
		},
		{
			code: '[attribute] ~ [src] { }',
		},
		{
			code: '[target] { }',
		},
		{
			code: '[target].class { }',
		},
		{
			code: '#id[target] { }',
		},
		{
			code: '#id.class[target] { }',
		},
		{
			code: '[target=_blank] { }',
		},
		{
			code: '[title~=flower] { }',
		},
		{
			code: '[lang|=en] { }',
		},
		{
			code: '[href^=https] { }',
		},
		{
			code: '[href$=.pdf] { }',
		},
		{
			code: '[href*=w3schools] { }',
		},
		{
			code: 'a:active { }',
		},
		{
			code: 'p::after { }',
		},
		{
			code: ':not(p) { }',
		},
		{
			code: '::selection { }',
		},
		{
			code: 'a:hover .class { }',
		},
		{
			code: 'a:hover #id { }',
		},
		{
			code: 'a:hover [attribute] { }',
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
			code: 'div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { div#thing {} }',
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: 'div#thing, a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a, div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'div#thing a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'div#thing > a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a > div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing + a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a + div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing ~ a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing:hover { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: 'div#thing:nth-child(2n+1) { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'div#thing::before { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { ul.list {} }',
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: 'ul.list, a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a, ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'ul.list a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'ul.list > a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a > ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list + a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a + ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list ~ a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list:hover { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: 'ul.list:nth-child(2n+1) { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'ul.list::before { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "@media (min-width: 700px) { a[href='place'] {} }",
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: "a[href='place'], a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a, a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: "a[href='place'] a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: "a[href='place'] > a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "div > a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 7,
		},
		{
			code: "a[href='place'] + a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a + a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place'] ~ a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a ~ a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place']:hover { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "div:hover a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 11,
		},
		{
			code: "a[href='place']:nth-child(2n+1) { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place']::before { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['id'] }],

	accept: [
		{
			code: '.class { }',
		},
		{
			code: '.foo.class { }',
		},
		{
			code: '.foo#id { }',
		},
		{
			code: '.class[target] { }',
		},
		{
			code: '.class#id[target] { }',
		},
		{
			code: '#id { }',
		},
		{
			code: '#id.class { }',
		},
		{
			code: '#id.class[target] { }',
		},
		{
			code: '* { }',
		},
		{
			code: 'p { }',
		},
		{
			code: 'div, p { }',
		},
		{
			code: '.class, p { }',
		},
		{
			code: 'div, .class { }',
		},
		{
			code: '.class, .class { }',
		},
		{
			code: '#id, p { }',
		},
		{
			code: 'div, #id { }',
		},
		{
			code: '#id, #id { }',
		},
		{
			code: '[attribute], p { }',
		},
		{
			code: 'div, [attribute] { }',
		},
		{
			code: '[attribute], [src] { }',
		},
		{
			code: 'div p { }',
		},
		{
			code: '.class p { }',
		},
		{
			code: 'div .class { }',
		},
		{
			code: '.class .class { }',
		},
		{
			code: '#id p { }',
		},
		{
			code: 'div #id { }',
		},
		{
			code: '#id #id { }',
		},
		{
			code: '[attribute] p { }',
		},
		{
			code: 'div [attribute] { }',
		},
		{
			code: '[attribute] [src] { }',
		},
		{
			code: 'div > p { }',
		},
		{
			code: '.class > p { }',
		},
		{
			code: 'div > .class { }',
		},
		{
			code: '.class > .class { }',
		},
		{
			code: '#id > p { }',
		},
		{
			code: 'div > #id { }',
		},
		{
			code: '#id > #id { }',
		},
		{
			code: '[attribute] > p { }',
		},
		{
			code: 'div > [attribute] { }',
		},
		{
			code: '[attribute] > [src] { }',
		},
		{
			code: 'div + p { }',
		},
		{
			code: '.class + p { }',
		},
		{
			code: 'div + .class { }',
		},
		{
			code: '.class + .class { }',
		},
		{
			code: '#id + p { }',
		},
		{
			code: 'div + #id { }',
		},
		{
			code: '#id + #id { }',
		},
		{
			code: '[attribute] + p { }',
		},
		{
			code: 'div + [attribute] { }',
		},
		{
			code: '[attribute] + [src] { }',
		},
		{
			code: 'div ~ p { }',
		},
		{
			code: '.class ~ p { }',
		},
		{
			code: 'div ~ .class { }',
		},
		{
			code: '.class ~ .class { }',
		},
		{
			code: '#id ~ p { }',
		},
		{
			code: 'div ~ #id { }',
		},
		{
			code: '#id ~ #id { }',
		},
		{
			code: '[attribute] ~ p { }',
		},
		{
			code: 'div ~ [attribute] { }',
		},
		{
			code: '[attribute] ~ [src] { }',
		},
		{
			code: '[target] { }',
		},
		{
			code: '[target].class { }',
		},
		{
			code: '#id[target] { }',
		},
		{
			code: '#id.class[target] { }',
		},
		{
			code: '[target=_blank] { }',
		},
		{
			code: '[title~=flower] { }',
		},
		{
			code: '[lang|=en] { }',
		},
		{
			code: '[href^=https] { }',
		},
		{
			code: '[href$=.pdf] { }',
		},
		{
			code: '[href*=w3schools] { }',
		},
		{
			code: 'a:active { }',
		},
		{
			code: 'p::after { }',
		},
		{
			code: ':not(p) { }',
		},
		{
			code: '::selection { }',
		},
		{
			code: 'a:hover .class { }',
		},
		{
			code: 'a:hover #id { }',
		},
		{
			code: 'a:hover [attribute] { }',
		},
		{
			code: 'div#thing { }',
		},
		{
			code: '@media (min-width: 700px) { div#thing {} }',
		},
		{
			code: 'div#thing, a { }',
		},
		{
			code: 'a, div#thing { }',
		},
		{
			code: 'div#thing a { }',
		},
		{
			code: 'a div#thing { }',
		},
		{
			code: 'div#thing > a { }',
		},
		{
			code: 'a > div#thing { }',
		},
		{
			code: 'div#thing + a { }',
		},
		{
			code: 'a + div#thing { }',
		},
		{
			code: 'div#thing ~ a { }',
		},
		{
			code: 'a ~ div#thing { }',
		},
		{
			code: 'div#thing:hover { }',
		},
		{
			code: 'a:hover div#thing { }',
		},
		{
			code: 'div#thing:nth-child(2n+1) { }',
		},
		{
			code: 'div#thing::before { }',
		},
	],

	reject: [
		{
			code: 'ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { ul.list {} }',
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: 'ul.list, a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a, ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'ul.list a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'ul.list > a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a > ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list + a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a + ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list ~ a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list:hover { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: 'ul.list:nth-child(2n+1) { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'ul.list::before { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "@media (min-width: 700px) { a[href='place'] {} }",
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: "a[href='place'], a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a, a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: "a[href='place'] a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: "a[href='place'] > a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "div > a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 7,
		},
		{
			code: "a[href='place'] + a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a + a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place'] ~ a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a ~ a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place']:hover { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "div:hover a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 11,
		},
		{
			code: "a[href='place']:nth-child(2n+1) { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place']::before { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['class'] }],

	accept: [
		{
			code: '.class { }',
		},
		{
			code: '.foo.class { }',
		},
		{
			code: '.foo#id { }',
		},
		{
			code: '.class[target] { }',
		},
		{
			code: '.class#id[target] { }',
		},
		{
			code: '#id { }',
		},
		{
			code: '#id.class { }',
		},
		{
			code: '#id.class[target] { }',
		},
		{
			code: '* { }',
		},
		{
			code: 'p { }',
		},
		{
			code: 'div, p { }',
		},
		{
			code: '.class, p { }',
		},
		{
			code: 'div, .class { }',
		},
		{
			code: '.class, .class { }',
		},
		{
			code: '#id, p { }',
		},
		{
			code: 'div, #id { }',
		},
		{
			code: '#id, #id { }',
		},
		{
			code: '[attribute], p { }',
		},
		{
			code: 'div, [attribute] { }',
		},
		{
			code: '[attribute], [src] { }',
		},
		{
			code: 'div p { }',
		},
		{
			code: '.class p { }',
		},
		{
			code: 'div .class { }',
		},
		{
			code: '.class .class { }',
		},
		{
			code: '#id p { }',
		},
		{
			code: 'div #id { }',
		},
		{
			code: '#id #id { }',
		},
		{
			code: '[attribute] p { }',
		},
		{
			code: 'div [attribute] { }',
		},
		{
			code: '[attribute] [src] { }',
		},
		{
			code: 'div > p { }',
		},
		{
			code: '.class > p { }',
		},
		{
			code: 'div > .class { }',
		},
		{
			code: '.class > .class { }',
		},
		{
			code: '#id > p { }',
		},
		{
			code: 'div > #id { }',
		},
		{
			code: '#id > #id { }',
		},
		{
			code: '[attribute] > p { }',
		},
		{
			code: 'div > [attribute] { }',
		},
		{
			code: '[attribute] > [src] { }',
		},
		{
			code: 'div + p { }',
		},
		{
			code: '.class + p { }',
		},
		{
			code: 'div + .class { }',
		},
		{
			code: '.class + .class { }',
		},
		{
			code: '#id + p { }',
		},
		{
			code: 'div + #id { }',
		},
		{
			code: '#id + #id { }',
		},
		{
			code: '[attribute] + p { }',
		},
		{
			code: 'div + [attribute] { }',
		},
		{
			code: '[attribute] + [src] { }',
		},
		{
			code: 'div ~ p { }',
		},
		{
			code: '.class ~ p { }',
		},
		{
			code: 'div ~ .class { }',
		},
		{
			code: '.class ~ .class { }',
		},
		{
			code: '#id ~ p { }',
		},
		{
			code: 'div ~ #id { }',
		},
		{
			code: '#id ~ #id { }',
		},
		{
			code: '[attribute] ~ p { }',
		},
		{
			code: 'div ~ [attribute] { }',
		},
		{
			code: '[attribute] ~ [src] { }',
		},
		{
			code: '[target] { }',
		},
		{
			code: '[target].class { }',
		},
		{
			code: '#id[target] { }',
		},
		{
			code: '#id.class[target] { }',
		},
		{
			code: '[target=_blank] { }',
		},
		{
			code: '[title~=flower] { }',
		},
		{
			code: '[lang|=en] { }',
		},
		{
			code: '[href^=https] { }',
		},
		{
			code: '[href$=.pdf] { }',
		},
		{
			code: '[href*=w3schools] { }',
		},
		{
			code: 'a:active { }',
		},
		{
			code: 'p::after { }',
		},
		{
			code: ':not(p) { }',
		},
		{
			code: '::selection { }',
		},
		{
			code: 'a:hover .class { }',
		},
		{
			code: 'a:hover #id { }',
		},
		{
			code: 'a:hover [attribute] { }',
		},
		{
			code: 'ul.list { }',
		},
		{
			code: 'ul.list.class { }',
		},
		{
			code: '@media (min-width: 700px) { ul.list {} }',
		},
		{
			code: 'ul.list, a { }',
		},
		{
			code: 'a, ul.list { }',
		},
		{
			code: 'ul.list a { }',
		},
		{
			code: 'a ul.list { }',
		},
		{
			code: 'ul.list > a { }',
		},
		{
			code: 'a > ul.list { }',
		},
		{
			code: 'ul.list + a { }',
		},
		{
			code: 'a + ul.list { }',
		},
		{
			code: 'ul.list ~ a { }',
		},
		{
			code: 'a ~ ul.list { }',
		},
		{
			code: 'ul.list:hover { }',
		},
		{
			code: 'a:hover ul.list { }',
		},
		{
			code: 'ul.list:nth-child(2n+1) { }',
		},
		{
			code: 'ul.list::before { }',
		},
	],

	reject: [
		{
			code: 'div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'div.class#thing { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { div#thing {} }',
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: 'div#thing, a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a, div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'div#thing a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'div#thing > a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a > div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing + a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a + div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing ~ a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing:hover { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: 'div#thing:nth-child(2n+1) { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'div#thing::before { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a.class[data='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "@media (min-width: 700px) { a[href='place'] {} }",
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: "a[href='place'], a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a, a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: "a[href='place'] a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: "a[href='place'] > a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "div > a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 7,
		},
		{
			code: "a[href='place'] + a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a + a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place'] ~ a { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a ~ a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place']:hover { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "div:hover a[href='place'] { }",
			message: messages.rejected,
			line: 1,
			column: 11,
		},
		{
			code: "a[href='place']:nth-child(2n+1) { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place']::before { }",
			message: messages.rejected,
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['attribute'] }],

	accept: [
		{
			code: '.class { }',
		},
		{
			code: '.foo.class { }',
		},
		{
			code: '.foo#id { }',
		},
		{
			code: '.class[target] { }',
		},
		{
			code: '.class#id[target] { }',
		},
		{
			code: '#id { }',
		},
		{
			code: '#id.class { }',
		},
		{
			code: '#id.class[target] { }',
		},
		{
			code: '* { }',
		},
		{
			code: 'p { }',
		},
		{
			code: 'div, p { }',
		},
		{
			code: '.class, p { }',
		},
		{
			code: 'div, .class { }',
		},
		{
			code: '.class, .class { }',
		},
		{
			code: '#id, p { }',
		},
		{
			code: 'div, #id { }',
		},
		{
			code: '#id, #id { }',
		},
		{
			code: '[attribute], p { }',
		},
		{
			code: 'div, [attribute] { }',
		},
		{
			code: '[attribute], [src] { }',
		},
		{
			code: 'div p { }',
		},
		{
			code: '.class p { }',
		},
		{
			code: 'div .class { }',
		},
		{
			code: '.class .class { }',
		},
		{
			code: '#id p { }',
		},
		{
			code: 'div #id { }',
		},
		{
			code: '#id #id { }',
		},
		{
			code: '[attribute] p { }',
		},
		{
			code: 'div [attribute] { }',
		},
		{
			code: '[attribute] [src] { }',
		},
		{
			code: 'div > p { }',
		},
		{
			code: '.class > p { }',
		},
		{
			code: 'div > .class { }',
		},
		{
			code: '.class > .class { }',
		},
		{
			code: '#id > p { }',
		},
		{
			code: 'div > #id { }',
		},
		{
			code: '#id > #id { }',
		},
		{
			code: '[attribute] > p { }',
		},
		{
			code: 'div > [attribute] { }',
		},
		{
			code: '[attribute] > [src] { }',
		},
		{
			code: 'div + p { }',
		},
		{
			code: '.class + p { }',
		},
		{
			code: 'div + .class { }',
		},
		{
			code: '.class + .class { }',
		},
		{
			code: '#id + p { }',
		},
		{
			code: 'div + #id { }',
		},
		{
			code: '#id + #id { }',
		},
		{
			code: '[attribute] + p { }',
		},
		{
			code: 'div + [attribute] { }',
		},
		{
			code: '[attribute] + [src] { }',
		},
		{
			code: 'div ~ p { }',
		},
		{
			code: '.class ~ p { }',
		},
		{
			code: 'div ~ .class { }',
		},
		{
			code: '.class ~ .class { }',
		},
		{
			code: '#id ~ p { }',
		},
		{
			code: 'div ~ #id { }',
		},
		{
			code: '#id ~ #id { }',
		},
		{
			code: '[attribute] ~ p { }',
		},
		{
			code: 'div ~ [attribute] { }',
		},
		{
			code: '[attribute] ~ [src] { }',
		},
		{
			code: '[target] { }',
		},
		{
			code: '[target].class { }',
		},
		{
			code: '#id[target] { }',
		},
		{
			code: '#id.class[target] { }',
		},
		{
			code: '[target=_blank] { }',
		},
		{
			code: '[title~=flower] { }',
		},
		{
			code: '[lang|=en] { }',
		},
		{
			code: '[href^=https] { }',
		},
		{
			code: '[href$=.pdf] { }',
		},
		{
			code: '[href*=w3schools] { }',
		},
		{
			code: 'a:active { }',
		},
		{
			code: 'p::after { }',
		},
		{
			code: ':not(p) { }',
		},
		{
			code: '::selection { }',
		},
		{
			code: 'a:hover .class { }',
		},
		{
			code: 'a:hover #id { }',
		},
		{
			code: 'a:hover [attribute] { }',
		},
		{
			code: "a[href='place'] { }",
		},
		{
			code: "a[href='place'][data='place'] { }",
		},
		{
			code: "a[target][data='place'] { }",
		},
		{
			code: "@media (min-width: 700px) { a[href='place'] {} }",
		},
		{
			code: "a[href='place'], a { }",
		},
		{
			code: "a, a[href='place'] { }",
		},
		{
			code: "a[href='place'] a { }",
		},
		{
			code: "a a[href='place'] { }",
		},
		{
			code: "a[href='place'] > a { }",
		},
		{
			code: "div > a[href='place'] { }",
		},
		{
			code: "a[href='place'] + a { }",
		},
		{
			code: "a + a[href='place'] { }",
		},
		{
			code: "a[href='place'] ~ a { }",
		},
		{
			code: "a ~ a[href='place'] { }",
		},
		{
			code: "a[href='place']:hover { }",
		},
		{
			code: "div:hover a[href='place'] { }",
		},
		{
			code: "a[href='place']:nth-child(2n+1) { }",
		},
		{
			code: "a[href='place']::before { }",
		},
	],

	reject: [
		{
			code: 'div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'div[target]#thing { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'div[target=_blank]#thing { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { div#thing {} }',
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: 'div#thing, a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a, div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'div#thing a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'div#thing > a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a > div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing + a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a + div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing ~ a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing:hover { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover div#thing { }',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: 'div#thing:nth-child(2n+1) { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'div#thing::before { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'ul[target].class { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'ul[target=_blank].class { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { ul.list {} }',
			message: messages.rejected,
			line: 1,
			column: 29,
		},
		{
			code: 'ul.list, a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a, ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'ul.list a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'ul.list > a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a > ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list + a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a + ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list ~ a { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list:hover { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover ul.list { }',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: 'ul.list:nth-child(2n+1) { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'ul.list::before { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: [true],

	accept: [
		{
			code: '[target] { &[attribute] {} }',
		},
		{
			code: '[target] { &.class {} }',
		},
		{
			code: '[target] { &#id {} }',
		},
		{
			code: '.class { &[attribute] {} }',
		},
		{
			code: '.class { &.class-two {} }',
		},
		{
			code: '.class { &#id {} }',
		},
		{
			code: '#id { &[attribute] {} }',
		},
		{
			code: '#id { &.class-two {} }',
		},
		{
			code: '.some-class:extend(a) {}',
		},
		{
			code: 'a@{variable}:extend(.bucket) {}',
		},
	],

	reject: [
		{
			code: 'a { &[attribute] {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'a { &.class {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'a { &#id {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div a { &[attribute] {} }',
			message: messages.rejected,
			line: 1,
			column: 13,
		},
		{
			code: 'div a { &.class {} }',
			message: messages.rejected,
			line: 1,
			column: 13,
		},
		{
			code: 'div a { &#id {} }',
			message: messages.rejected,
			line: 1,
			column: 13,
		},
		{
			code: 'div { & > a { &[attribute] {} } }',
			message: messages.rejected,
			line: 1,
			column: 21,
		},
		{
			code: 'div { & > a { &.class {} } }',
			message: messages.rejected,
			line: 1,
			column: 21,
		},
		{
			code: 'div { & > a { &#id {} } }',
			message: messages.rejected,
			line: 1,
			column: 21,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: [true],

	accept: [
		{
			code: '[target] { &[attribute] {} }',
		},
		{
			code: '[target] { &.class {} }',
		},
		{
			code: '[target] { &#id {} }',
		},
		{
			code: '.class { &[attribute] {} }',
		},
		{
			code: '.class { &.class-two {} }',
		},
		{
			code: '.class { &#id {} }',
		},
		{
			code: '#id { &[attribute] {} }',
		},
		{
			code: '#id { &.class-two {} }',
		},
		{
			code: 'a#{$selector}.class { }',
		},
		{
			code: '#{$selector}.class { }',
		},
		{
			code: 'a.class#{$selector}.class { }',
		},
		{
			code: '%foo { &.bar {} }',
		},
	],

	reject: [
		{
			code: 'a { &[attribute] {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'a { &.class {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'a { &#id {} }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'div a { &[attribute] {} }',
			message: messages.rejected,
			line: 1,
			column: 13,
		},
		{
			code: 'div a { &.class {} }',
			message: messages.rejected,
			line: 1,
			column: 13,
		},
		{
			code: 'div a { &#id {} }',
			message: messages.rejected,
			line: 1,
			column: 13,
		},
		{
			code: 'div { & > a { &[attribute] {} } }',
			message: messages.rejected,
			line: 1,
			column: 21,
		},
		{
			code: 'div { & > a { &.class {} } }',
			message: messages.rejected,
			line: 1,
			column: 21,
		},
		{
			code: 'div { & > a { &#id {} } }',
			message: messages.rejected,
			line: 1,
			column: 21,
		},
	],
});

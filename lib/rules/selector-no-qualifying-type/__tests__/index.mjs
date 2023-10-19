import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

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
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '@media (min-width: 700px) { div#thing {} }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 38,
		},
		{
			code: 'div#thing, a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a, div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: 'div#thing a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'div#thing > a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a > div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'div#thing + a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a + div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'div#thing ~ a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a ~ div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 14,
		},
		{
			code: 'div#thing:hover { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a:hover div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: 'div#thing:nth-child(2n+1) { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'div#thing::before { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: '@media (min-width: 700px) { ul.list {} }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: 'ul.list, a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a, ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: 'ul.list a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'ul.list > a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a > ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'ul.list + a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a + ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'ul.list ~ a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a ~ ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'ul.list:hover { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'a:hover ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'ul.list:nth-child(2n+1) { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: 'ul.list::before { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 8,
		},
		{
			code: "a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: "@media (min-width: 700px) { a[href='place'] {} }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 44,
		},
		{
			code: "a[href='place'], a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: "a, a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 4,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: "a[href='place'] a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: "a a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 3,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: "a[href='place'] > a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: "div > a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: "a[href='place'] + a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: "a + a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: "a[href='place'] ~ a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: "a ~ a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: "a[href='place']:hover { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: "div:hover a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: "a[href='place']:nth-child(2n+1) { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: "a[href='place']::before { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
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
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { ul.list {} }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 29,
		},
		{
			code: 'ul.list, a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a, ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 4,
		},
		{
			code: 'ul.list a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 3,
		},
		{
			code: 'ul.list > a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a > ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list + a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a + ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list ~ a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list:hover { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 9,
		},
		{
			code: 'ul.list:nth-child(2n+1) { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'ul.list::before { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "@media (min-width: 700px) { a[href='place'] {} }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 29,
		},
		{
			code: "a[href='place'], a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a, a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 4,
		},
		{
			code: "a[href='place'] a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 3,
		},
		{
			code: "a[href='place'] > a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "div > a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 7,
		},
		{
			code: "a[href='place'] + a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a + a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place'] ~ a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a ~ a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place']:hover { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "div:hover a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 11,
		},
		{
			code: "a[href='place']:nth-child(2n+1) { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place']::before { }",
			message: messages.rejected("a[href='place']"),
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
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'div.class#thing { }',
			message: messages.rejected('div.class#thing'),
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { div#thing {} }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 29,
		},
		{
			code: 'div#thing, a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a, div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 4,
		},
		{
			code: 'div#thing a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 3,
		},
		{
			code: 'div#thing > a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a > div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing + a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a + div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing ~ a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing:hover { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 9,
		},
		{
			code: 'div#thing:nth-child(2n+1) { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'div#thing::before { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a.class[data='place'] { }",
			message: messages.rejected("a.class[data='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "@media (min-width: 700px) { a[href='place'] {} }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 29,
		},
		{
			code: "a[href='place'], a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a, a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 4,
		},
		{
			code: "a[href='place'] a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 3,
		},
		{
			code: "a[href='place'] > a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "div > a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 7,
		},
		{
			code: "a[href='place'] + a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a + a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place'] ~ a { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a ~ a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 5,
		},
		{
			code: "a[href='place']:hover { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "div:hover a[href='place'] { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 11,
		},
		{
			code: "a[href='place']:nth-child(2n+1) { }",
			message: messages.rejected("a[href='place']"),
			line: 1,
			column: 1,
		},
		{
			code: "a[href='place']::before { }",
			message: messages.rejected("a[href='place']"),
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
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'div[target]#thing { }',
			message: messages.rejected('div[target]#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'div[target=_blank]#thing { }',
			message: messages.rejected('div[target=_blank]#thing'),
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { div#thing {} }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 29,
		},
		{
			code: 'div#thing, a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a, div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 4,
		},
		{
			code: 'div#thing a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 3,
		},
		{
			code: 'div#thing > a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a > div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing + a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a + div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing ~ a { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 5,
		},
		{
			code: 'div#thing:hover { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover div#thing { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 9,
		},
		{
			code: 'div#thing:nth-child(2n+1) { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'div#thing::before { }',
			message: messages.rejected('div#thing'),
			line: 1,
			column: 1,
		},
		{
			code: 'ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'ul[target].class { }',
			message: messages.rejected('ul[target].class'),
			line: 1,
			column: 1,
		},
		{
			code: 'ul[target=_blank].class { }',
			message: messages.rejected('ul[target=_blank].class'),
			line: 1,
			column: 1,
		},
		{
			code: '@media (min-width: 700px) { ul.list {} }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 29,
		},
		{
			code: 'ul.list, a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a, ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 4,
		},
		{
			code: 'ul.list a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 3,
		},
		{
			code: 'ul.list > a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a > ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list + a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a + ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list ~ a { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a ~ ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 5,
		},
		{
			code: 'ul.list:hover { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'a:hover ul.list { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 9,
		},
		{
			code: 'ul.list:nth-child(2n+1) { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
		{
			code: 'ul.list::before { }',
			message: messages.rejected('ul.list'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-less',
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
			message: messages.rejected('a[attribute]'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { &.class {} }',
			message: messages.rejected('a.class'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { &#id {} }',
			message: messages.rejected('a#id'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'div a { &[attribute] {} }',
			message: messages.rejected('a[attribute]'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'div a { &.class {} }',
			message: messages.rejected('a.class'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'div a { &#id {} }',
			message: messages.rejected('a#id'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'div { & > a { &[attribute] {} } }',
			message: messages.rejected('a[attribute]'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'div { & > a { &.class {} } }',
			message: messages.rejected('a.class'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'div { & > a { &#id {} } }',
			message: messages.rejected('a#id'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 22,
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-scss',
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
		{
			code: stripIndent`
				@include test {
					&--foo {
						&.bar {}
					}
				}`,
		},
	],

	reject: [
		{
			code: 'a { &[attribute] {} }',
			message: messages.rejected('a[attribute]'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: 'a { &.class {} }',
			message: messages.rejected('a.class'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'a { &#id {} }',
			message: messages.rejected('a#id'),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'div a { &[attribute] {} }',
			message: messages.rejected('a[attribute]'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'div a { &.class {} }',
			message: messages.rejected('a.class'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'div a { &#id {} }',
			message: messages.rejected('a#id'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: 'div { & > a { &[attribute] {} } }',
			message: messages.rejected('a[attribute]'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'div { & > a { &.class {} } }',
			message: messages.rejected('a.class'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: 'div { & > a { &#id {} } }',
			message: messages.rejected('a#id'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: stripIndent`
				div {
					div {
						a#id {}
					}
				}`,
			message: messages.rejected('a#id'),
			line: 3,
			column: 3,
			endLine: 3,
			endColumn: 7,
		},
	],
});

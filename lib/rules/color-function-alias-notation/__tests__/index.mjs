import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['with-alpha'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: rgba(0 0 0) }',
		},
		{
			code: 'a { color: hsla(4.71239rad 60% 70%) }',
		},
		{
			code: 'a { color: HSLA(270 60% 70%) }',
		},
		{
			code: 'a { color: RGBA(240 0 0 / 50%) }',
		},
		{
			code: stripIndent`
				a {
					color: hsla(
						270 /* comment */
						60%
						50%
						/* comment */ / 15%
					)
				}`,
		},
	],

	reject: [
		{
			code: 'a { color: rgb(0 0 0) }',
			fixed: 'a { color: rgba(0 0 0) }',
			message: messages.expected('rgb', 'rgba'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
			fix: {
				range: [13, 14],
				text: 'ba',
			},
		},
		{
			code: 'a { color: hsl(270 60% 70%) }',
			fixed: 'a { color: hsla(270 60% 70%) }',
			message: messages.expected('hsl', 'hsla'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 15,
			fix: {
				range: [13, 14],
				text: 'la',
			},
		},
		{
			code: stripIndent`
				a {
					color: HSL(
						calc(var(--hue) + 30)
						28% 50% /
						0.2
					);
				}
			`,
			fixed: stripIndent`
				a {
					color: HSLa(
						calc(var(--hue) + 30)
						28% 50% /
						0.2
					);
				}
			`,
			message: messages.expected('HSL', 'HSLa'),
			line: 2,
			column: 9,
			endLine: 2,
			endColumn: 12,
			fix: {
				range: [14, 15],
				text: 'La',
			},
		},
	],
});

testRule({
	ruleName,
	config: ['without-alpha'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: 'a { color: rgb(0 0 0) }',
		},
		{
			code: 'a { color: hsl(4.71239rad 60% 70%) }',
		},
		{
			code: 'a { color: HSL(270 60% 70%) }',
		},
		{
			code: 'a { color: RGB(240 0 0 / 50%) }',
		},
		{
			code: stripIndent`
				a {
					color: hsl(
						270 /* comment */
						60%
						50%
						/* comment */ / 15%
					)
				}`,
		},
	],

	reject: [
		{
			code: 'a { color: rgba(0 0 0) }',
			fixed: 'a { color: rgb(0 0 0) }',
			message: messages.expected('rgba', 'rgb'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
			fix: {
				range: [14, 15],
				text: '',
			},
		},
		{
			code: 'a { color: hsla(270 60% 70%) }',
			fixed: 'a { color: hsl(270 60% 70%) }',
			message: messages.expected('hsla', 'hsl'),
			line: 1,
			column: 12,
			endLine: 1,
			endColumn: 16,
			fix: {
				range: [14, 15],
				text: '',
			},
		},
		{
			code: stripIndent`
				a {
					color: HSLA(
						calc(var(--hue) + 30)
						28% 50% /
						0.2
					);
				}
			`,
			fixed: stripIndent`
				a {
					color: HSL(
						calc(var(--hue) + 30)
						28% 50% /
						0.2
					);
				}
			`,
			message: messages.expected('HSLA', 'HSL'),
			line: 2,
			column: 9,
			endLine: 2,
			endColumn: 13,
			fix: {
				range: [15, 16],
				text: '',
			},
		},
	],
});

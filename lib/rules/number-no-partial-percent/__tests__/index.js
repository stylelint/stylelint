'use strict';

const rule = require('..');

const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [true],
	accept: [
		{
			code: 'a { width: 100%; }',
		},
		{
			code: 'a { width: 0%; }',
		},
		{
			code: 'a { top: 0%; }',
		},
		{
			code: 'a { top: 100%; }',
		},
		{
			code: 'a { transform: translate(0%, 100%); }',
		},
		{
			code: 'a { width: 6px; }',
		},
		{
			code: 'a { front-size: 6rem; }',
		},
		{
			code: 'a { background-color: linear-gradient(to right, 0% rgba(0 0 0 / 20%), 100% rgba(255 255 255 / 20%)); }',
		},
		{
			code: 'a { color: rgba(0 0 0 / 20%); }',
		},
		{
			code: 'a { color: rgb(0 0 0 / 20%); }',
		},
		{
			code: 'a { color: color(0 0 0 / 20%); }',
		},
		{
			code: 'a { color: color (0 0 0 / 20%); }',
		},
		{
			code: 'a { color: color  (0 0 0 / 20%); }',
		},
		{
			code: 'a { width: 0; }',
		},
		{
			code: 'a { border: solid 0% rgba(var(--border, var(--border2)) 0 0 / 60%); }',
		},
		{
			code: 'a { box-shadow: 0px 0px 0px 0px rgba(0 0 0 / 20%); }',
		},
		{
			code: 'a { box-shadow: 0% 0px 0px 0px rgba(0 0 0 / 20%); }',
		},
		{
			code: 'a { box-shadow: 0% 100% 0px 0px rgba(0 0 0 / 20%); }',
		},
		{
			code: 'a { box-shadow: 0% 100% 0 0px rgba(0 0 0 / 20%); }',
		},
		{
			code: 'a { box-shadow: 0% 100% 0 0rem rgba(0 0 0 / 20%); }',
		},
		{
			code: 'a { background-image: url("data:image/svg+xml,203%22"); }',
		},
	],
	reject: [
		{
			code: 'a { width: 30%; }',
			warnings: [
				{
					message: messages.invalidPercent,
					column: 12,
					endColumn: 15,
					line: 1,
					endLine: 1,
				},
			],
		},
		{
			code: 'a { top: 60%; }',
			warnings: [
				{
					message: messages.invalidPercent,
					column: 10,
					endColumn: 13,
					line: 1,
					endLine: 1,
				},
			],
		},
		{
			code: 'a { transform: translate(20%, 100%); }',
			warnings: [
				{
					message: messages.invalidPercent,
					column: 26,
					endColumn: 29,
					line: 1,
					endLine: 1,
				},
			],
		},
		{
			code: 'a { transform: translate(0%, 80%); }',
			warnings: [
				{
					message: messages.invalidPercent,
					column: 30,
					endColumn: 33,
					line: 1,
					endLine: 1,
				},
			],
		},
		{
			code: 'a { border: solid 40% rgba(var(--border, var(--border2)) 0 0 / 60%); }',
			warnings: [
				{
					message: messages.invalidPercent,
					column: 19,
					endColumn: 22,
					line: 1,
					endLine: 1,
				},
			],
		},
		{
			code: 'a { box-shadow: 6% 0px 0px 0px rgba(0 0 0 / 20%); }',
			warnings: [
				{
					message: messages.invalidPercent,
					column: 17,
					endColumn: 19,
					line: 1,
					endLine: 1,
				},
			],
		},
		{
			code: 'a { box-shadow: 6% 0px 20% 0px rgba(0 0 0 / 20%); }',
			warnings: [
				{
					message: messages.invalidPercent,
					column: 17,
					endColumn: 19,
					line: 1,
					endLine: 1,
				},
				{
					message: messages.invalidPercent,
					column: 24,
					endColumn: 27,
					line: 1,
					endLine: 1,
				},
			],
		},
	],
});

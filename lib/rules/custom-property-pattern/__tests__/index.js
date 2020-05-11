'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [/foo-.+/],

	accept: [
		{
			code: ':root { --foo-bar: 0; }',
		},
		{
			code: ':root { --boo-foo-bar: 0; }',
		},
	],

	reject: [
		{
			code: ':root { --boo-bar: 0; }',
			message: messages.expected,
		},
		{
			code: ':root { --foo-: 0; }',
			message: messages.expected,
		},
	],
});

testRule({
	ruleName,
	config: ['foo-.+'],

	accept: [
		{
			code: ':root { --foo-bar: 0; }',
		},
		{
			code: ':root { --boo-foo-bar: 0; }',
		},
	],

	reject: [
		{
			code: ':root { --boo-bar: 0; }',
			message: messages.expected,
		},
		{
			code: ':root { --foo-: 0; }',
			message: messages.expected,
		},
	],
});

testRule({
	ruleName,
	config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/],

	accept: [
		{
			code: ':root { --Foo-bar: 0; }',
		},
		{
			code: ':root { --Foo-barBaz: 0; }',
		},
	],

	reject: [
		{
			code: ':root { --boo-Foo-bar: 0; }',
			message: messages.expected,
		},
		{
			code: ':root { --foo-bar: 0; }',
			message: messages.expected,
		},
		{
			code: ':root { --Foo-Bar: 0; }',
			message: messages.expected,
		},
	],
});

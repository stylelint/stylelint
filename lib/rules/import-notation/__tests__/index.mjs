import rule from '../index.js';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['url'],
	fix: true,

	accept: [
		{
			code: '@import url("foo.css");',
		},
		{
			code: '@import uRl("foo.css");',
		},
		{
			code: '@import URL("foo.css");',
		},
		{
			code: '@import url( "foo.css" );',
		},
		{
			code: "@import url('foo.css');",
		},
		{
			code: "@import uRl('foo.css');",
		},
		{
			code: "@import URL('foo.css');",
		},
		{
			code: "@import url( 'foo.css' );",
		},
		{
			code: "@import url('foo.css') print;",
		},
		{
			code: "@import url('foo.css') print, screen;",
		},
		{
			code: '@import url("foo.css") supports(display: flex) screen and (max-width: 400px);',
		},
	],

	reject: [
		{
			code: '@import "foo.css";',
			fixed: '@import url("foo.css");',
			message: messages.expected('"foo.css"', 'url("foo.css")'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: "@import 'foo.css';",
			fixed: "@import url('foo.css');",
			message: messages.expected("'foo.css'", "url('foo.css')"),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: "@import 'foo.css' print;",
			fixed: "@import url('foo.css') print;",
			message: messages.expected("'foo.css'", "url('foo.css')"),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: "@import 'foo.css' supports(display: flex) screen and (max-width: 400px);",
			fixed: "@import url('foo.css') supports(display: flex) screen and (max-width: 400px);",
			message: messages.expected("'foo.css'", "url('foo.css')"),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
	],
});

testRule({
	ruleName,
	config: ['string'],
	fix: true,

	accept: [
		{
			code: '@import "foo.css";',
		},
		{
			code: "@import 'foo.css';",
		},
		{
			code: "@import 'foo.css' screen;",
		},
		{
			code: "@import 'foo.css' supports(display: flex) screen and (max-width: 400px);",
		},
	],

	reject: [
		{
			code: '@import url("foo.css");',
			fixed: '@import "foo.css";',
			message: messages.expected('url("foo.css")', '"foo.css"'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '@import uRl("foo.css");',
			fixed: '@import "foo.css";',
			message: messages.expected('uRl("foo.css")', '"foo.css"'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '@import URL("foo.css");',
			fixed: '@import "foo.css";',
			message: messages.expected('URL("foo.css")', '"foo.css"'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '@import url( "foo.css" );',
			fixed: '@import "foo.css";',
			message: messages.expected('url( "foo.css" )', '"foo.css"'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: "@import url('foo.css');",
			fixed: "@import 'foo.css';",
			message: messages.expected("url('foo.css')", "'foo.css'"),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: "@import url( 'foo.css' );",
			fixed: "@import 'foo.css';",
			message: messages.expected("url( 'foo.css' )", "'foo.css'"),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '@import url(foo.css);',
			fixed: '@import "foo.css";',
			message: messages.expected('url(foo.css)', '"foo.css"'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '@import url(foo.css) print;',
			fixed: '@import "foo.css" print;',
			message: messages.expected('url(foo.css)', '"foo.css"'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: "@import url('foo.css') supports(display: flex) screen and (max-width: 400px);",
			fixed: "@import 'foo.css' supports(display: flex) screen and (max-width: 400px);",
			message: messages.expected("url('foo.css')", "'foo.css'"),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 23,
		},
	],
});

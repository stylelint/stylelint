'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '@import "a.css";',
		},
		{
			code: "@import url('a.css');",
		},
		{
			code: '@import url(a.css);',
		},
		{
			code: '@import url("a.css") projection, tv;',
		},
		{
			code: "@import 'a.css'; @import 'b.css';",
		},
		{
			code: "@import url('a.css') projection; @import url('a.css') tv;",
		},
		{
			code: '@import "a.css" screen; @import "b.css" tv; @import "a.css" tv;',
		},
		{
			code: '@IMPORT "a.css"; @ImPoRt "b.css";',
		},
		{
			code: '@import "a.css" supports(display: flex) tv; @import "a.css" layer tv;',
		},
		{
			code: '@import "a.css" supports(display: flex) tv; @import "a.css" supports(display: grid) tv;',
		},
	],

	reject: [
		{
			code: "@import 'a.css'; @import 'a.css';",
			message: messages.rejected(`a.css`),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: '@import url("a.css"); @import url("a.css");',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 43,
		},
		{
			code: '@import "a.css";\n@import \'a.css\';',
			message: messages.rejected(`a.css`),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 16,
		},
		{
			code: '@import "a.css"; @import \'b.css\'; @import url(a.css);',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 53,
		},
		{
			code: "@import url('a.css') tv; @import 'a.css' tv;",
			message: messages.rejected(`a.css`),
			line: 1,
			column: 26,
		},
		{
			code: "@import url('a.css') tv, projection; @import 'a.css' projection, tv;",
			message: messages.rejected(`a.css`),
			line: 1,
			column: 38,
		},
		{
			code: "@import url('a.css') tv, projection; @import 'a.css' projection, screen, tv;",
			message: messages.rejected(`a.css`),
			line: 1,
			column: 38,
		},
		{
			code: "@import url('a.css') tv, projection; @import 'a.css' screen, tv;",
			message: messages.rejected(`a.css`),
			line: 1,
			column: 38,
		},
		{
			code: "@import url('a.css') /* a comment */ tv; @import 'a.css' tv /* a comment */;",
			message: messages.rejected(`a.css`),
			line: 1,
			column: 42,
		},
		{
			code: '@import "a.css" (min-width : 500px);@import url(a.css) (  min-width:500px   );',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 37,
		},
		{
			code: '@import "a.css" tv, (min-width : 500px);@import url(a.css) (  min-width:500px   ), tv;',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 41,
		},
		{
			code: "@IMPORT 'a.css'; @ImPoRt 'a.css';",
			message: messages.rejected(`a.css`),
			line: 1,
			column: 18,
		},
		{
			code: '@import url("a.css") layer; @import url("a.css") layer;',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 55,
		},
		{
			code: '@import url("a.css") layer(base); @import url("a.css") layer(base);',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 67,
		},
		{
			code: '@import url("a.css") layer(base) supports(display: grid); @import url("a.css") layer(base) supports(display: grid);',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 59,
			endLine: 1,
			endColumn: 115,
		},
		{
			code: '@import url("a.css") supports(display: grid); @import url("a.css") supports(display: grid);',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 47,
			endLine: 1,
			endColumn: 91,
		},
		{
			code: '@import url("a.css") layer tv; @import url("a.css") layer tv;',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 61,
		},
		{
			code: '@import url("a.css") layer(base) tv; @import url("a.css") layer(base) tv;',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 73,
		},
		{
			code: '@import url("a.css") layer(base) supports(display: grid) tv; @import url("a.css") layer(base) supports(display: grid) tv;',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 62,
			endLine: 1,
			endColumn: 121,
		},
		{
			code: '@import url("a.css") layer(base) supports(display: grid) screen, tv; @import url("a.css") layer(base) supports(display: grid) tv;',
			message: messages.rejected(`a.css`),
			line: 1,
			column: 70,
			endLine: 1,
			endColumn: 129,
		},
	],
});

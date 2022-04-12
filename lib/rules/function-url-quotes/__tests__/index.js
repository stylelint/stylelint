'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],

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
			code: '@document url("http://www.w3.org/");',
		},
		{
			code: '@document url( "http://www.w3.org/" );',
		},
		{
			code: '@document url-prefix("http://www.w3.org/");',
		},
		{
			code: '@document url-prefix( "http://www.w3.org/" );',
		},
		{
			code: '@document domain("http://www.w3.org/");',
		},
		{
			code: '@document domain( "http://www.w3.org/" );',
		},
		{
			code: '@font-face { font-family: \'foo\'; src: url("foo.ttf"); }',
		},
		{
			code: '@font-face { font-family: \'foo\'; src: url( "foo.ttf" ); }',
		},
		{
			code: 'a { background: url("foo.css"); }',
		},
		{
			code: 'a { background: uRl("foo.css"); }',
		},
		{
			code: 'a { background: URL("foo.css"); }',
		},
		{
			code: 'a { background: url( "foo.css" ); }',
		},
		{
			code: 'a { background: url(  "foo.css"  ); }',
		},
		{
			code: 'a { cursor: url("foo.png"); }',
		},
		{
			code: 'a { background-image: url("foo.css"), url("bar.css"), url("baz.css"); }',
		},
		{
			code: 'a { background-image: url( "foo.css" ), url( "bar.css" ), url( "baz.css" ); }',
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
			code: "@document url('http://www.w3.org/');",
		},
		{
			code: "@document url( 'http://www.w3.org/' );",
		},
		{
			code: "@document url-prefix('http://www.w3.org/');",
		},
		{
			code: "@document url-prefix( 'http://www.w3.org/' );",
		},
		{
			code: "@document domain('http://www.w3.org/');",
		},
		{
			code: "@document domain( 'http://www.w3.org/' );",
		},
		{
			code: "@font-face { font-family: 'foo'; src: url('foo.ttf'); }",
		},
		{
			code: "@font-face { font-family: 'foo'; src: url( 'foo.ttf' ); }",
		},
		{
			code: "a { background: url('foo.css'); }",
		},
		{
			code: "a { background: uRl('foo.css'); }",
		},
		{
			code: "a { background: URL('foo.css'); }",
		},
		{
			code: "a { background: url( 'foo.css' ); }",
		},
		{
			code: "a { background: url(  'foo.css'  ); }",
		},
		{
			code: "a { cursor: url('foo.png'); }",
		},
		{
			code: "a { background-image: url('foo.css'), url('bar.css'), url('baz.css'); }",
		},
		{
			code: "a { background-image: url( 'foo.css' ), url( 'bar.css' ), url( 'baz.css' ); }",
		},
		{
			code: '@import url(@variable);',
		},
		{
			code: "@import url($variable + 'foo.css');",
		},
		{
			code: '@import url($variable + "foo.css");',
		},
		{
			code: "@import url('foo.css' + $variable);",
		},
		{
			code: '@import url("foo.css" + $variable);',
		},
		{
			code: "@import url($variable-one + 'foo.css' + $variable-two);",
		},
		{
			code: '@import url($variable-one + "foo.css" + $variable-two);',
		},
		{
			code: "@font-face { font-family: 'foo'; src: url(@variable); }",
		},
		{
			code: "@font-face { font-family: 'foo'; src: url($variable + 'foo.ttf'); }",
		},
		{
			code: '@font-face { font-family: \'foo\'; src: url($variable + "foo.ttf"); }',
		},
		{
			code: '@font-face { font-family: \'foo\'; src: url("foo.ttf" + $variable); }',
		},
		{
			code: "@font-face { font-family: 'foo'; src: url('foo.ttf' + $variable); }",
		},
		{
			code: "@font-face { font-family: 'foo'; src: url($variable + 'foo.ttf' + $variable); }",
		},
		{
			code: '@font-face { font-family: \'foo\'; src: url($variable + "foo.ttf" + $variable); }',
		},
		{
			code: 'a { background: url("/images/my_image@2x.png") }',
		},
		{
			code: 'a { background: url("") }',
		},
	],

	reject: [
		{
			code: '@import url(foo.css);',
			message: messages.expected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '@import url( foo.css );',
			message: messages.expected('url'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@document url-prefix(http://www.w3.org/Style);',
			message: messages.expected('url-prefix'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 45,
		},
		{
			code: '@document url-prefix( http://www.w3.org/Style );',
			message: messages.expected('url-prefix'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 47,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
			message: messages.expected('url'),
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url( foo.ttf ); }",
			message: messages.expected('url'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: 'a { cursor: url(foo.png); }',
			message: messages.expected('url'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { background-image: url(foo.css), url("bar.css"), url("baz.css"); }',
			message: messages.expected('url'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { background-image: url( foo.css ), url("bar.css"), url("baz.css"); }',
			message: messages.expected('url'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: 'a { background-image: url("foo.css"), url(bar.css), url("baz.css"); }',
			message: messages.expected('url'),
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: 'a { background-image: url("foo.css"), url( bar.css ), url("baz.css"); }',
			message: messages.expected('url'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: 'a { background-image: url("foo.css"), url("bar.css"), url(baz.css); }',
			message: messages.expected('url'),
			line: 1,
			column: 59,
			endLine: 1,
			endColumn: 66,
		},
		{
			code: 'a { background-image: url("foo.css"), url("bar.css"), url( baz.css ); }',
			message: messages.expected('url'),
			line: 1,
			column: 60,
			endLine: 1,
			endColumn: 68,
		},
	],
});

testRule({
	ruleName,
	config: ['never'],

	accept: [
		{
			code: '@import url(foo.css);',
		},
		{
			code: '@import uRl(foo.css);',
		},
		{
			code: '@import URL(foo.css);',
		},
		{
			code: '@import url( foo.css );',
		},
		{
			code: '@document url(http://www.w3.org/);',
		},
		{
			code: '@document url( http://www.w3.org/ );',
		},
		{
			code: '@document url-prefix(http://www.w3.org/);',
		},
		{
			code: '@document url-prefix( http://www.w3.org/ );',
		},
		{
			code: '@document domain(http://www.w3.org/);',
		},
		{
			code: '@document domain( http://www.w3.org/ );',
		},
		{
			code: '@font-face { font-family: foo; src: url(foo.ttf); }',
		},
		{
			code: '@font-face { font-family: foo; src: url( foo.ttf ); }',
		},
		{
			code: 'a { background: url(foo.css); }',
		},
		{
			code: 'a { background: uRl(foo.css); }',
		},
		{
			code: 'a { background: URL(foo.css); }',
		},
		{
			code: 'a { background: url( foo.css ); }',
		},
		{
			code: 'a { background: url(  foo.css  ); }',
		},
		{
			code: 'a { cursor: url(foo.png); }',
		},
		{
			code: 'a { background-image: url(foo.css), url(bar.css), url(baz.css); }',
		},
		{
			code: 'a { background-image: url( foo.css ), url( bar.css ), url( baz.css ); }',
		},
		{
			code: '@import url(@variable);',
		},
		{
			code: "@import url($variable + 'foo.css');",
		},
		{
			code: '@import url($variable + "foo.css");',
		},
		{
			code: "@import url('foo.css' + $variable);",
		},
		{
			code: '@import url("foo.css" + $variable);',
		},
		{
			code: "@import url($variable-one + 'foo.css' + $variable-two);",
		},
		{
			code: '@import url($variable-one + "foo.css" + $variable-two);',
		},
		{
			code: "@font-face { font-family: 'foo'; src: url(@variable); }",
		},
		{
			code: "@font-face { font-family: 'foo'; src: url($variable + 'foo.ttf'); }",
		},
		{
			code: '@font-face { font-family: \'foo\'; src: url($variable + "foo.ttf"); }',
		},
		{
			code: '@font-face { font-family: \'foo\'; src: url("foo.ttf" + $variable); }',
		},
		{
			code: "@font-face { font-family: 'foo'; src: url('foo.ttf' + $variable); }",
		},
		{
			code: "@font-face { font-family: 'foo'; src: url($variable + 'foo.ttf' + $variable); }",
		},
		{
			code: '@font-face { font-family: \'foo\'; src: url($variable + "foo.ttf" + $variable); }',
		},
	],

	reject: [
		{
			code: '@import url("foo.css");',
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@import uRl("foo.css");',
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@import URL("foo.css");',
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@import url( "foo.css" );',
			message: messages.rejected('url'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: "@import url('foo.css');",
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: "@import url( 'foo.css' );",
			message: messages.rejected('url'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@document url("http://www.w3.org/");',
			message: messages.rejected('url'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: '@document url( "http://www.w3.org/" );',
			message: messages.rejected('url'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: "@document url-prefix('http://www.w3.org/Style');",
			message: messages.rejected('url-prefix'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 47,
		},
		{
			code: "@document url-prefix( 'http://www.w3.org/Style' );",
			message: messages.rejected('url-prefix'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 49,
		},
		{
			code: '@document domain("mozilla.org");',
			message: messages.rejected('domain'),
			line: 1,
			column: 18,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: '@document domain( "mozilla.org" );',
			message: messages.rejected('domain'),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 33,
		},
		{
			code: "@font-face { font-family: foo; src: url('foo.ttf'); }",
			message: messages.rejected('url'),
			line: 1,
			column: 41,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: "@font-face { font-family: foo; src: url( 'foo.ttf' ); }",
			message: messages.rejected('url'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: 'a { background: url("foo.css"); }',
			message: messages.rejected('url'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { background: uRl("foo.css"); }',
			message: messages.rejected('url'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { background: URL("foo.css"); }',
			message: messages.rejected('url'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { background: url( "foo.css" ); }',
			message: messages.rejected('url'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { background: url(  "foo.css"  ); }',
			message: messages.rejected('url'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { cursor: url("foo.png"); }',
			message: messages.rejected('url'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: "a { background-image: url('foo.css'), url(bar.css), url(baz.css); }",
			message: messages.rejected('url'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: "a { background-image: url( 'foo.css' ), url(bar.css), url(baz.css); }",
			message: messages.rejected('url'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 38,
		},
		{
			code: "a { background-image: url(foo.css), url('bar.css'), url(baz.css); }",
			message: messages.rejected('url'),
			line: 1,
			column: 41,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: "a { background-image: url(foo.css), url( 'bar.css' ), url(baz.css); }",
			message: messages.rejected('url'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: "a { background-image: url(foo.css), url(bar.css), url('baz.css'); }",
			message: messages.rejected('url'),
			line: 1,
			column: 55,
			endLine: 1,
			endColumn: 64,
		},
		{
			code: "a { background-image: url(foo.css), url(bar.css), url( 'baz.css' ); }",
			message: messages.rejected('url'),
			line: 1,
			column: 56,
			endLine: 1,
			endColumn: 66,
		},
		{
			code: 'a { background: url("/images/my_image@2x.png") }',
			message: messages.rejected('url'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 46,
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['empty'] }],

	accept: [
		{
			code: '@-moz-document url-prefix() {}',
		},
		{
			code: 'a { background: url() }',
		},
	],

	reject: [
		{
			code: '@import url(foo.css);',
			message: messages.expected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: "@import url('');",
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '@import url("");',
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 15,
		},
	],
});

testRule({
	ruleName,
	config: ['never', { except: ['empty'] }],

	accept: [
		{
			code: '@-moz-document url-prefix("") {}',
		},
		{
			code: 'a { background: url("") }',
		},
		{
			code: "a { background: url('') }",
		},
		{
			code: '@import url(foo.css);',
		},
	],

	reject: [
		{
			code: '@-moz-document url-prefix() {}',
			message: messages.expected('url-prefix'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { background: url() }',
			message: messages.expected('url'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@import url("foo.css");',
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: "@import url('foo.css');",
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-html',

	reject: [
		{
			code: '<template><a style="background: url(foo.css);"></a><template>',
			message: messages.expected('url'),
			line: 1,
			column: 37,
			endLine: 1,
			endColumn: 44,
		},
		{
			code: '<html><head><style>a { background: url(foo.css); }</style></head></html>',
			message: messages.expected('url'),
			line: 1,
			column: 40,
			endLine: 1,
			endColumn: 47,
		},
	],
});

testRule({
	skip: true,
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-css-in-js',

	accept: [
		{
			code: "import styled from 'styled-components';\nexport default styled.div` background: url(${variable}); `;",
			description: 'ignore variable',
		},
		{
			code: "import styled from 'react-emotion';\nexport default styled.div` background: url(${variable}); `;",
			description: 'ignore variable',
		},
	],
	reject: [
		{
			code: 'import styled from "styled-components";\nexport default styled.div` background: url(foo.css); `;',
			message: messages.expected('url'),
			line: 2,
			column: 44,
		},
		{
			code: 'import styled from "react-emotion";\nexport default styled.div` background: url(foo.css); `;',
			message: messages.expected('url'),
			line: 2,
			column: 44,
		},
	],
});

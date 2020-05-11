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
			message: messages.expected(),
			line: 1,
			column: 13,
		},
		{
			code: '@import url( foo.css );',
			message: messages.expected(),
			line: 1,
			column: 14,
		},
		{
			code: '@document url-prefix(http://www.w3.org/Style);',
			message: messages.expected('url-prefix'),
			line: 1,
			column: 22,
		},
		{
			code: '@document url-prefix( http://www.w3.org/Style );',
			message: messages.expected('url-prefix'),
			line: 1,
			column: 23,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
			message: messages.expected(),
			line: 1,
			column: 43,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url( foo.ttf ); }",
			message: messages.expected(),
			line: 1,
			column: 44,
		},
		{
			code: 'a { cursor: url(foo.png); }',
			message: messages.expected(),
			line: 1,
			column: 17,
		},
		{
			code: 'a { background-image: url(foo.css), url("bar.css"), url("baz.css"); }',
			message: messages.expected(),
			line: 1,
			column: 27,
		},
		{
			code: 'a { background-image: url( foo.css ), url("bar.css"), url("baz.css"); }',
			message: messages.expected(),
			line: 1,
			column: 28,
		},
		{
			code: 'a { background-image: url("foo.css"), url(bar.css), url("baz.css"); }',
			message: messages.expected(),
			line: 1,
			column: 43,
		},
		{
			code: 'a { background-image: url("foo.css"), url( bar.css ), url("baz.css"); }',
			message: messages.expected(),
			line: 1,
			column: 44,
		},
		{
			code: 'a { background-image: url("foo.css"), url("bar.css"), url(baz.css); }',
			message: messages.expected(),
			line: 1,
			column: 59,
		},
		{
			code: 'a { background-image: url("foo.css"), url("bar.css"), url( baz.css ); }',
			message: messages.expected(),
			line: 1,
			column: 60,
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
			message: messages.rejected(),
			line: 1,
			column: 13,
		},
		{
			code: '@import uRl("foo.css");',
			message: messages.rejected(),
			line: 1,
			column: 13,
		},
		{
			code: '@import URL("foo.css");',
			message: messages.rejected(),
			line: 1,
			column: 13,
		},
		{
			code: '@import url( "foo.css" );',
			message: messages.rejected(),
			line: 1,
			column: 14,
		},
		{
			code: "@import url('foo.css');",
			message: messages.rejected(),
			line: 1,
			column: 13,
		},
		{
			code: "@import url( 'foo.css' );",
			message: messages.rejected(),
			line: 1,
			column: 14,
		},
		{
			code: '@document url("http://www.w3.org/");',
			message: messages.rejected(),
			line: 1,
			column: 15,
		},
		{
			code: '@document url( "http://www.w3.org/" );',
			message: messages.rejected(),
			line: 1,
			column: 16,
		},
		{
			code: "@document url-prefix('http://www.w3.org/Style');",
			message: messages.rejected('url-prefix'),
			line: 1,
			column: 22,
		},
		{
			code: "@document url-prefix( 'http://www.w3.org/Style' );",
			message: messages.rejected('url-prefix'),
			line: 1,
			column: 23,
		},
		{
			code: '@document domain("mozilla.org");',
			message: messages.rejected('domain'),
			line: 1,
			column: 18,
		},
		{
			code: '@document domain( "mozilla.org" );',
			message: messages.rejected('domain'),
			line: 1,
			column: 19,
		},
		{
			code: "@font-face { font-family: foo; src: url('foo.ttf'); }",
			message: messages.rejected(),
			line: 1,
			column: 41,
		},
		{
			code: "@font-face { font-family: foo; src: url( 'foo.ttf' ); }",
			message: messages.rejected(),
			line: 1,
			column: 42,
		},
		{
			code: 'a { background: url("foo.css"); }',
			message: messages.rejected(),
			line: 1,
			column: 21,
		},
		{
			code: 'a { background: uRl("foo.css"); }',
			message: messages.rejected(),
			line: 1,
			column: 21,
		},
		{
			code: 'a { background: URL("foo.css"); }',
			message: messages.rejected(),
			line: 1,
			column: 21,
		},
		{
			code: 'a { background: url( "foo.css" ); }',
			message: messages.rejected(),
			line: 1,
			column: 22,
		},
		{
			code: 'a { background: url(  "foo.css"  ); }',
			message: messages.rejected(),
			line: 1,
			column: 23,
		},
		{
			code: 'a { cursor: url("foo.png"); }',
			message: messages.rejected(),
			line: 1,
			column: 17,
		},
		{
			code: "a { background-image: url('foo.css'), url(bar.css), url(baz.css); }",
			message: messages.rejected(),
			line: 1,
			column: 27,
		},
		{
			code: "a { background-image: url( 'foo.css' ), url(bar.css), url(baz.css); }",
			message: messages.rejected(),
			line: 1,
			column: 28,
		},
		{
			code: "a { background-image: url(foo.css), url('bar.css'), url(baz.css); }",
			message: messages.rejected(),
			line: 1,
			column: 41,
		},
		{
			code: "a { background-image: url(foo.css), url( 'bar.css' ), url(baz.css); }",
			message: messages.rejected(),
			line: 1,
			column: 42,
		},
		{
			code: "a { background-image: url(foo.css), url(bar.css), url('baz.css'); }",
			message: messages.rejected(),
			line: 1,
			column: 55,
		},
		{
			code: "a { background-image: url(foo.css), url(bar.css), url( 'baz.css' ); }",
			message: messages.rejected(),
			line: 1,
			column: 56,
		},
		{
			code: 'a { background: url("/images/my_image@2x.png") }',
			message: messages.rejected(),
			line: 1,
			column: 21,
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
			message: messages.expected(),
			line: 1,
			column: 13,
		},
		{
			code: "@import url('');",
			message: messages.rejected(),
			line: 1,
			column: 13,
		},
		{
			code: '@import url("");',
			message: messages.rejected(),
			line: 1,
			column: 13,
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
			message: messages.expected(),
		},
		{
			code: 'a { background: url() }',
			message: messages.expected(),
		},
		{
			code: '@import url("foo.css");',
			message: messages.rejected(),
			line: 1,
			column: 13,
		},
		{
			code: "@import url('foo.css');",
			message: messages.rejected(),
			line: 1,
			column: 13,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'html',

	reject: [
		{
			code: '<template><a style="background: url(foo.css);"></a><template>',
			message: messages.expected(),
			line: 1,
			column: 37,
		},
		{
			code: '<html><head><style>a { background: url(foo.css); }</style></head></html>',
			message: messages.expected(),
			line: 1,
			column: 40,
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	syntax: 'css-in-js',

	accept: [
		{
			code:
				"import styled from 'styled-components';\nexport default styled.div` background: url(${variable}); `;",
			description: 'ignore variable',
		},
		{
			code:
				"import styled from 'react-emotion';\nexport default styled.div` background: url(${variable}); `;",
			description: 'ignore variable',
		},
	],
	reject: [
		{
			code:
				'import styled from "styled-components";\nexport default styled.div` background: url(foo.css); `;',
			message: messages.expected(),
			line: 2,
			column: 44,
		},
		{
			code:
				'import styled from "react-emotion";\nexport default styled.div` background: url(foo.css); `;',
			message: messages.expected(),
			line: 2,
			column: 44,
		},
	],
});

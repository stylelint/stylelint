import { stripIndent } from 'common-tags';

import naiveCssInJs from '../../../__tests__/fixtures/postcss-naive-css-in-js.js';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['always'],
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
			code: '@document url("http://www.w3.org/");',
		},
		{
			code: '@document url( "http://www.w3.org/" );',
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
			fixed: '@import url("foo.css");',
			message: messages.expected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '@import url( foo.css );',
			fixed: '@import url( "foo.css" );',
			message: messages.expected('url'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
			fixed: '@font-face { font-family: \'foo\'; src: url("foo.ttf"); }',
			message: messages.expected('url'),
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: "@font-face { font-family: 'foo'; src: url( foo.ttf ); }",
			fixed: '@font-face { font-family: \'foo\'; src: url( "foo.ttf" ); }',
			message: messages.expected('url'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: 'a { cursor: url(foo.png); }',
			fixed: 'a { cursor: url("foo.png"); }',
			message: messages.expected('url'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'a { background-image: url(foo.css), url("bar.css"), url("baz.css"); }',
			fixed: 'a { background-image: url("foo.css"), url("bar.css"), url("baz.css"); }',
			message: messages.expected('url'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { background-image: url( foo.css ), url("bar.css"), url("baz.css"); }',
			fixed: 'a { background-image: url( "foo.css" ), url("bar.css"), url("baz.css"); }',
			message: messages.expected('url'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: 'a { background-image: url("foo.css"), url(bar.css), url("baz.css"); }',
			fixed: 'a { background-image: url("foo.css"), url("bar.css"), url("baz.css"); }',
			message: messages.expected('url'),
			line: 1,
			column: 43,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: 'a { background-image: url("foo.css"), url( bar.css ), url("baz.css"); }',
			fixed: 'a { background-image: url("foo.css"), url( "bar.css" ), url("baz.css"); }',
			message: messages.expected('url'),
			line: 1,
			column: 44,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: 'a { background-image: url("foo.css"), url("bar.css"), url(baz.css); }',
			fixed: 'a { background-image: url("foo.css"), url("bar.css"), url("baz.css"); }',
			message: messages.expected('url'),
			line: 1,
			column: 59,
			endLine: 1,
			endColumn: 66,
		},
		{
			code: 'a { background-image: url("foo.css"), url("bar.css"), url( baz.css ); }',
			fixed: 'a { background-image: url("foo.css"), url("bar.css"), url( "baz.css" ); }',
			message: messages.expected('url'),
			line: 1,
			column: 60,
			endLine: 1,
			endColumn: 68,
		},
		{
			code: 'a { background-image: url(foo.css), url(bar.css); }',
			fixed: 'a { background-image: url("foo.css"), url("bar.css"); }',
			warnings: [
				{
					message: messages.expected('url'),
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 34,
				},
				{
					message: messages.expected('url'),
					line: 1,
					column: 41,
					endLine: 1,
					endColumn: 48,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,

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
			fixed: '@import url(foo.css);',
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@import uRl("foo.css");',
			fixed: '@import uRl(foo.css);',
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@import URL("foo.css");',
			fixed: '@import URL(foo.css);',
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: '@import url( "foo.css" );',
			fixed: '@import url( foo.css );',
			message: messages.rejected('url'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: "@import url('foo.css');",
			fixed: '@import url(foo.css);',
			message: messages.rejected('url'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 22,
		},
		{
			code: "@import url( 'foo.css' );",
			fixed: '@import url( foo.css );',
			message: messages.rejected('url'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: '@document url("http://www.w3.org/");',
			fixed: '@document url(http://www.w3.org/);',
			message: messages.rejected('url'),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: '@document url( "http://www.w3.org/" );',
			fixed: '@document url( http://www.w3.org/ );',
			message: messages.rejected('url'),
			line: 1,
			column: 16,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: "@font-face { font-family: foo; src: url('foo.ttf'); }",
			fixed: '@font-face { font-family: foo; src: url(foo.ttf); }',
			message: messages.rejected('url'),
			line: 1,
			column: 41,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: "@font-face { font-family: foo; src: url( 'foo.ttf' ); }",
			fixed: '@font-face { font-family: foo; src: url( foo.ttf ); }',
			message: messages.rejected('url'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: 'a { background: url("foo.css"); }',
			fixed: 'a { background: url(foo.css); }',
			message: messages.rejected('url'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { background: uRl("foo.css"); }',
			fixed: 'a { background: uRl(foo.css); }',
			message: messages.rejected('url'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { background: URL("foo.css"); }',
			fixed: 'a { background: URL(foo.css); }',
			message: messages.rejected('url'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 30,
		},
		{
			code: 'a { background: url( "foo.css" ); }',
			fixed: 'a { background: url( foo.css ); }',
			message: messages.rejected('url'),
			line: 1,
			column: 22,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'a { background: url(  "foo.css"  ); }',
			fixed: 'a { background: url(  foo.css  ); }',
			message: messages.rejected('url'),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 34,
		},
		{
			code: 'a { cursor: url("foo.png"); }',
			fixed: 'a { cursor: url(foo.png); }',
			message: messages.rejected('url'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: "a { background-image: url('foo.css'), url(bar.css), url(baz.css); }",
			fixed: 'a { background-image: url(foo.css), url(bar.css), url(baz.css); }',
			message: messages.rejected('url'),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: "a { background-image: url( 'foo.css' ), url(bar.css), url(baz.css); }",
			fixed: 'a { background-image: url( foo.css ), url(bar.css), url(baz.css); }',
			message: messages.rejected('url'),
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 38,
		},
		{
			code: "a { background-image: url(foo.css), url('bar.css'), url(baz.css); }",
			fixed: 'a { background-image: url(foo.css), url(bar.css), url(baz.css); }',
			message: messages.rejected('url'),
			line: 1,
			column: 41,
			endLine: 1,
			endColumn: 50,
		},
		{
			code: "a { background-image: url(foo.css), url( 'bar.css' ), url(baz.css); }",
			fixed: 'a { background-image: url(foo.css), url( bar.css ), url(baz.css); }',
			message: messages.rejected('url'),
			line: 1,
			column: 42,
			endLine: 1,
			endColumn: 52,
		},
		{
			code: "a { background-image: url(foo.css), url(bar.css), url('baz.css'); }",
			fixed: 'a { background-image: url(foo.css), url(bar.css), url(baz.css); }',
			message: messages.rejected('url'),
			line: 1,
			column: 55,
			endLine: 1,
			endColumn: 64,
		},
		{
			code: "a { background-image: url(foo.css), url(bar.css), url( 'baz.css' ); }",
			fixed: 'a { background-image: url(foo.css), url(bar.css), url( baz.css ); }',
			message: messages.rejected('url'),
			line: 1,
			column: 56,
			endLine: 1,
			endColumn: 66,
		},
		{
			code: 'a { background: url("/images/my_image@2x.png") }',
			fixed: 'a { background: url(/images/my_image@2x.png) }',
			message: messages.rejected('url'),
			line: 1,
			column: 21,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: 'a { background-image: url("foo.css"), url(\'bar.css\'); }',
			fixed: 'a { background-image: url(foo.css), url(bar.css); }',
			warnings: [
				{
					message: messages.rejected('url'),
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 36,
				},
				{
					message: messages.rejected('url'),
					line: 1,
					column: 43,
					endLine: 1,
					endColumn: 52,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['always', { except: ['empty'] }],

	accept: [
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
	ruleName,
	config: ['always'],
	customSyntax: naiveCssInJs,

	accept: [
		{
			code: 'css` background: url(${variable}); `;',
			description: 'ignore variable',
		},
	],

	reject: [
		{
			code: 'css` background: url(foo.css); `;',
			message: messages.expected('url'),
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-scss',
	fix: true,

	accept: [
		{
			code: stripIndent`
				$a: (
					// foo
				)`,
			description: 'SCSS map',
		},
		{
			code: stripIndent`
				@function a(
					// foo
				) {}`,
			description: 'SCSS function',
		},
		{
			code: stripIndent`
				@forward "module" with (
					// foo
				)`,
			description: 'SCSS with',
		},
	],
});

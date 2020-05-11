'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: '',
		},
		{
			code: '\n',
		},
		{
			code: 'a { color: pink; }\n',
		},
		{
			code: 'a { color: pink; }\r\n',
		},
		{
			code: 'a { color: pink; }\n\n\n',
		},
		{
			code: 'a { color: pink; }\r\n\r\n\r\n',
		},
	],

	reject: [
		{
			code: 'a { color: pink; }',
			fixed: 'a { color: pink; }\n',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: pink; }\n\n\nb{ color: orange; }',
			fixed: 'a { color: pink; }\n\n\nb{ color: orange; }\n',
			message: messages.rejected,
			line: 4,
			column: 19,
		},
		{
			code: 'a { color: pink; }\r\n\r\n\r\nb{ color: orange; }',
			fixed: 'a { color: pink; }\r\n\r\n\r\nb{ color: orange; }\r\n',
			message: messages.rejected,
			line: 4,
			column: 19,
		},
		{
			code: '&.active {\n    top:\n    .tab {}\n}',
			fixed: '&.active {\n    top:\n    .tab {}\n}\n',
			message: messages.rejected,
			line: 4,
			column: 1,
		},
		{
			code: '&.active {\r\n    top:\r\n    .tab {}\r\n}',
			fixed: '&.active {\r\n    top:\r\n    .tab {}\r\n}\r\n',
			message: messages.rejected,
			line: 4,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'html',

	accept: [
		{
			code: `<div>
<style>
a {
  color: red;
}
</style>

</div>`,
		},
		{
			code: '<a style="color: red;"></a>',
		},
	],

	reject: [
		{
			code: `<div>
<style>a {
  color: red;
}</style>

</div>`,
			message: messages.rejected,
			line: 4,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'css-in-js',

	accept: [
		{
			code: `export default (
        <button
          style={{ color: "#fff" }}
        >
        </button>
      );`,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'sugarss',
	fix: true,

	accept: [
		{
			code: 'a\n',
		},
		{
			code: 'a\r\n',
		},
	],

	reject: [
		{
			code: 'a',
			fixed: 'a\n',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: 'body\n  padding: 5% 2% 5%',
			fixed: 'body\n  padding: 5% 2% 5%\n',
			message: messages.rejected,
			line: 2,
			column: 17,
		},
		{
			code: 'body\r\n  padding: 5% 2% 5%',
			fixed: 'body\r\n  padding: 5% 2% 5%\r\n',
			message: messages.rejected,
			line: 2,
			column: 17,
		},
	],
});

'use strict';

const { messages, ruleName } = require('..');
const testUrl = 'somethingsomething something\tsomething';
const _21whitespaces = new Array(21).fill('\u0020').join('');

testRule({
	ruleName,
	config: [20],

	accept: [
		{
			code: 'a { color: 0; }',
		},
		{
			code: 'a {  color   : 0 ; }',
		},
		{
			code: 'a { color: 0;\n  top: 0; }',
		},
		{
			code: '@media print {\n  a {\n    color: pink;\n }\n}',
		},
		{
			code: `a {\n background: url("${testUrl}");\n}`,
		},
		{
			code: `@import '${testUrl}';\na {\n background: url("${testUrl}");\n}`,
		},
		{
			code: `a {\n background: uRl("${testUrl}");\n}`,
		},
		{
			code: `a {\n background: URL("${testUrl}");\n}`,
		},
		{
			code: `a {\n  background: url(\n  "${testUrl}"\n  );\n}`,
		},
		{
			code: `a {\n  background: uRl(\n  "${testUrl}"\n  );\n}`,
		},
		{
			code: `a {\n  background: URL(\n  "${testUrl}"\n  );\n}`,
		},
		{
			code: `a {\n  background: URL(\n  "${testUrl}"\n  );\nbackground: url(\n  "${testUrl}"\n);\n}`,
		},
		{
			code: 'a { margin: 0 2px; }\r\n',
		},
		{
			code: 'a { margin: 0 2px; }\r\na { margin: 4px 0; }\n',
		},
		{
			code: `@import url("${testUrl}") print;`,
		},
		{
			code: `@import '${testUrl}';`,
		},
		{
			code: `@import "${testUrl}";`,
		},
		{
			code: `@import url("${testUrl}");`,
		},
		{
			code: '@import \'svg-something<id="horse">\' projection;',
		},
		{
			code: `a {\n background-image:\nurl(\n${_21whitespaces.substr(0, 20)}"${testUrl}"\n); }`,
			description: 'exactly 20 whitespaces',
		},
		{
			code: `a {\n background-image:\nurl(\n"${testUrl}"${_21whitespaces.substr(0, 20)}\n); }`,
			description: 'exactly 20 whitespaces',
		},
	],

	reject: [
		{
			code: 'a {   color   : 0  ;}',
			message: messages.expected(20),
			line: 1,
			column: 21,
		},
		{
			code: 'a { color: 0; top: 0; }',
			message: messages.expected(20),
			line: 1,
			column: 23,
		},
		{
			code: 'a { color: 0;\n  top: 0; bottom: 0; right: 0; \n  left: 0; }',
			message: messages.expected(20),
			line: 2,
			column: 31,
		},
		{
			code: 'a { color: 0;\n  top: 0;\n  left: 0; bottom: 0; right: 0; }',
			message: messages.expected(20),
			line: 3,
			column: 33,
		},
		{
			code: `a {\n  background: URL(\n  "${testUrl}"\n  );\n           background: url(\n  "${testUrl}"\n);\n}`,
			message: messages.expected(20),
			line: 5,
			column: 27,
		},
		{
			code: '@media print {\n  a {\n    color: pink; background: orange;\n }\n}',
			message: messages.expected(20),
			line: 3,
			column: 36,
		},
		{
			code: '@media (min-width: 30px) and screen {}',
			message: messages.expected(20),
			line: 1,
			column: 38,
		},
		{
			code: 'a { margin: 0 2rem; }\r\n',
			message: messages.expected(20),
			line: 1,
			column: 21,
		},
		{
			code: `@import url("${testUrl}") projection, tv;`,
			message: messages.expected(20),
			line: 1,
			column: 69,
		},
		{
			code: `@import '${testUrl}' projection, tv;`,
			message: messages.expected(20),
			line: 1,
			column: 64,
		},
		{
			code: `@import "${testUrl}" projection, tv;`,
			message: messages.expected(20),
			line: 1,
			column: 64,
		},
		{
			code: '@import \'svg-something<id="horse">\' screens, tv;',
			message: messages.expected(20),
			line: 1,
			column: 48,
		},
		{
			code: `a { background-image: url("${testUrl}"); }`,
			message: messages.expected(20),
			line: 1,
			column: 70,
		},
		{
			code:
				'a {\n    /* Lorem ipsum dolor sit amet. The comment Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium officia fugiat unde deserunt sit, tenetur! Incidunt similique blanditiis placeat ad quia possimus libero, reiciendis excepturi non esse deserunt a odit. */\n}',
			message: messages.expected(20),
			line: 2,
			column: 272,
		},
		{
			code: `a {
        background-image:
        url(
        ${_21whitespaces}"${testUrl}"
        );
      }`,
			description: 'more than 20 whitespaces',
			message: messages.expected(20),
			line: 4,
			column: 69,
		},
		{
			code: `a {
        background-image:
        url(
        "${testUrl}"${_21whitespaces}
        );
      }`,
			description: 'more than 20 whitespaces',
			message: messages.expected(20),
			line: 4,
			column: 69,
		},
		{
			code: `@import '${testUrl}';\na {\n background: url("${testUrl}"${_21whitespaces});\n}`,
			warnings: [
				{
					message: messages.expected(20),
					line: 3,
					column: 80,
				},
			],
		},
		{
			code: `@import url("${testUrl}"${_21whitespaces});`,
			warnings: [
				{
					message: messages.expected(20),
					line: 1,
					column: 75,
				},
			],
		},
		{
			code: `@import '${testUrl}'${_21whitespaces};\na {\n background: url("${testUrl}"${_21whitespaces});\n}`,
			warnings: [
				{
					message: messages.expected(20),
					line: 1,
					column: 70,
				},
				{
					message: messages.expected(20),
					line: 3,
					column: 80,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [20],
	syntax: 'html',

	accept: [
		{
			code: `<div>
<div>Very very very very very very very very very very very very very long line</div>
<style>
a {
  color: red;
}
</style>

</div>`,
		},
	],

	reject: [
		{
			code: `<div>
<style>
a {
  color     :      red;
}
</style>

</div>`,
			message: messages.expected(20),
			line: 4,
			column: 23,
		},
		{
			code: `<div>
<div>Very very very very very very very very very very very very very long line</div>
<div>Very very very very very very very very very very very very very long line</div>
<style>
a {
  color     :      red;
}
</style>

</div>`,
			message: messages.expected(20),
			line: 6,
			column: 23,
		},
	],
});

testRule({
	ruleName,
	config: [20],
	syntax: 'css-in-js',

	accept: [
		{
			code: `
import styled from 'styled-components';
const str = "Very very very very very very very very very very very very very long line";
export default styled.div\`
  color: #00
\`;
`,
		},
	],

	reject: [
		{
			code: `
import styled from 'styled-components';
const str = "Very very very very very very very very very very very very very long line";
export default styled.div\`
  color     :      red;
\`;
`,
			message: messages.expected(20),
			line: 5,
			column: 23,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: [20],

	reject: [
		{
			code:
				'a {\n    // Lorem ipsum dolor sit amet. The comment Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium officia fugiat unde deserunt sit, tenetur! Incidunt similique blanditiis placeat ad quia possimus libero, reiciendis excepturi non esse deserunt a odit.\n}',
			message: messages.expected(20),
			line: 2,
			column: 269,
		},
	],
});

testRule({
	ruleName,
	config: [30],

	accept: [
		{
			code: 'a { color: 0;\n  top: 0; left: 0; right: 0; \n  bottom: 0; }',
		},
		{
			code: '@import url("somethingsomethingsomethingsomething.css") print;',
		},
		{
			code: '@import url("somethingsomethingsomethingsomething.css") projection, tv;',
		},
		{
			code: '@import url("chrome://somethingsomethingsomethingsomething/");',
		},
		{
			code: '@import "somethingsomethingsomethingsomething.css" screen, projection;',
		},
	],

	reject: [
		{
			code: 'a { color: 0;\n  top: 0; left: 0; right: 0; background: pink; \n  bottom: 0; }',
			message: messages.expected(30),
			line: 2,
			column: 47,
		},
		{
			code: '@import url("somethingsomethingsomethingsomething.css") projection, screen;',
			message: messages.expected(30),
			line: 1,
			column: 75,
		},
		{
			code: '@import "somethingsomethingsomethingsomething.css" screen, projection, tv;',
			message: messages.expected(30),
			line: 1,
			column: 74,
		},
	],
});

testRule({
	ruleName,
	config: [20, { ignore: 'non-comments' }],

	accept: [
		{
			code: 'a { color: 0; top: 0; bottom: 0; }',
		},
		{
			code: 'a { color: 0; top: 0; /* too long comment here */ bottom: 0; }',
		},
		{
			code: '/* short nuff */',
		},
		{
			code: '/* short\nnuff */',
		},
		{
			code: '/**\n * each line\n * short nuff\n */',
		},
		{
			code: 'a { color: 0; }\n/* short nuff */\nb {}',
		},
		{
			code: 'a {}\n/**\n * each line\n * short nuff\n */\nb {}',
		},
		{
			code: 'a { /* this comment is too long for the max length */ }',
		},
	],

	reject: [
		{
			code: '/* comment that is too long */',
			message: messages.expected(20),
			line: 1,
			column: 30,
		},
		{
			code: 'a {}\n  /* comment that is too long */\nb {}',
			message: messages.expected(20),
			line: 2,
			column: 32,
		},
		{
			code: '/* this comment is too long for the max length */',
			message: messages.expected(20),
			line: 1,
			column: 49,
		},
		{
			code:
				'a {}\n/**\n * each line\n * short nuff\n * except this one which is too long\n */\nb {}',
			message: messages.expected(20),
			line: 5,
			column: 36,
		},
	],
});

testRule({
	ruleName,
	config: [20, { ignore: 'comments' }],

	accept: [
		{
			code: '/* comment that is too long */',
		},
		{
			code: '       /* comment that is too long */',
		},
		{
			code: '/* short */ a { color: 0; }',
		},
		{
			code: 'a {}\n/* comment that is too long\n*/ a { color: 0; top: 0; }',
		},
		{
			code: '/**\n comment that is too long #1\n comment that is too long #2 */',
		},
	],

	reject: [
		{
			code: 'a { color: 0; } /* comment that is too long */',
			message: messages.expected(20),
			line: 1,
			column: 46,
		},
		{
			code: 'a { /* this comment is too long for the max length */ }',
			message: messages.expected(20),
			line: 1,
			column: 55,
		},
	],
});

testRule({
	ruleName,
	config: [30, { ignorePattern: '/^my-/' }],

	accept: [
		{
			code: 'my-property: has-a-really-long-declaration-value-for-some-reason',
		},
	],
});

testRule({
	ruleName,
	config: [20, { ignorePattern: '/https?://[0-9,a-z]*.*/' }],

	accept: [
		{
			code: '/* ignore urls https://www.example.com */',
		},
	],

	reject: [
		{
			code: "/* don't ignore lines without urls something something */",
			message: messages.expected(20),
			line: 1,
			column: 57,
		},
	],
});

testRule({
	ruleName,
	config: [30, { ignorePattern: '/@import\\s+/' }],

	accept: [
		{
			code:
				'@import "../../../something/something/something/something.css" screen, projection, tv;',
		},
	],

	reject: [
		{
			code: 'a { color: 0;\n  top: 0; left: 0; right: 0; background: pink; \n  bottom: 0; }',
			message: messages.expected(30),
			line: 2,
			column: 47,
		},
		{
			code:
				'@import "../../../something/something/something/something.css";\na { color: 0;\n  top: 0; left: 0; right: 0; background: pink; \n  bottom: 0; }',
			message: messages.expected(30),
			line: 3,
			column: 47,
		},
	],
});

testRule({
	ruleName,
	config: [20, { ignorePattern: '/(Multiple:.+)|(Should:.+)/' }],

	accept: [
		{
			code: '/*\n Multiple: lines in multiline comments\n Should: be able to be ignored\n*/',
		},
	],

	reject: [
		{
			code: '/*\n multiple: lines in multiline comments\n Should: be able to be ignored\n*/',
			message: messages.expected(20),
			line: 2,
			column: 38,
		},
	],
});

testRule({
	ruleName,
	config: [30, { ignorePattern: /^my-/ }],

	accept: [
		{
			code: 'my-property: has-a-really-long-declaration-value-for-some-reason',
		},
	],
});

testRule({
	ruleName,
	config: [20, { ignorePattern: /(Multiple:.+)|(Should:.+)/ }],

	accept: [
		{
			code: '/*\n Multiple: lines in multiline comments\n Should: be able to be ignored\n*/',
		},
	],

	reject: [
		{
			code: '/*\n multiple: lines in multiline comments\n Should: be able to be ignored\n*/',
			message: messages.expected(20),
			line: 2,
			column: 38,
		},
	],
});

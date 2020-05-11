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
			description: 'empty string',
		},
		{
			code: '\n',
			description: 'no nodes',
		},
		{
			code: 'a {}',
			description: 'no newline',
		},
		{
			code: 'a::before { content: "  \n\t\n"; }',
			description: 'breaking the rule within a string',
		},
		{
			code: 'a,\nb {}',
			description: 'selector delimiter',
		},
		{
			code: 'a\n{}',
			description: 'before opening brace',
		},
		{
			code: 'a {\n  color: pink; }',
			description: 'after opening brace with space after newline',
		},
		{
			code: 'a { color: pink;\n}',
			description: 'before closing brace',
		},
		{
			code: 'a { color: pink; }\nb { color: orange; }',
			description: 'after closing brace',
		},
		{
			code: 'a { color: pink; }\n\n\nb { color: orange; }',
			description: 'multiple newlines after closing brace',
		},
		{
			code: 'a { color: pink;\n  top: 0; }',
			description: 'between declarations with two spaces after newline',
		},
		{
			code: 'a { color:\n\tpink; }',
			description: 'between properties and values with tab after newline',
		},
		{
			code: 'a { background-position: top left,\ntop right; }',
			description: 'within values',
		},
		{
			code: '@media print,\nscreen {}',
			description: 'within media query list',
		},
		{
			code: '@media print {\n  a { color: pink; } }',
			description: 'after opening brace of media query with space after newline',
		},
		{
			code: 'a\r{}',
			description: 'carriage return opening brace',
		},
		{
			code: 'a\n{\n\tcolor: pink;\n\ttop: 0;\n}',
		},
		{
			code:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
		},
		{
			code: '/* comment\n*/',
		},
		{
			code: '/* comment\r\n*/\r\n',
		},
	],

	reject: [
		{
			code: ' \n',
			fixed: '\n',
			description: 'no nodes with space before newline',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '/* foo  \nbar */ a { color: pink; }',
			fixed: '/* foo\nbar */ a { color: pink; }',
			description: 'eol-whitespace within a comment',
			message: messages.rejected,
			line: 1,
			column: 8,
		},
		{
			code: '/* \nfoo */ a { color: pink; }',
			fixed: '/*\nfoo */ a { color: pink; }',
			description: 'eol-whitespace within a comment left',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a, \nb {}',
			fixed: 'a,\nb {}',
			description: 'selector delimiter with space before newline',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: 'a\t\n{}',
			fixed: 'a\n{}',
			description: 'before opening brace with tab before newline',
			message: messages.rejected,
			line: 1,
			column: 2,
		},
		{
			code: 'a { \n  color: pink; }',
			fixed: 'a {\n  color: pink; }',
			description: 'after opening brace with space before and after newline',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'a { color: pink; \n}',
			fixed: 'a { color: pink;\n}',
			description: 'before closing brace with space before newline',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink; }\t\nb { color: orange; }',
			fixed: 'a { color: pink; }\nb { color: orange; }',
			description: 'after closing brace with tab before newline',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; } \n\n\nb { color: orange; }',
			fixed: 'a { color: pink; }\n\n\nb { color: orange; }',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: pink; }\n \n\nb { color: orange; }',
			fixed: 'a { color: pink; }\n\n\nb { color: orange; }',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: pink; }\n\n \nb { color: orange; }',
			fixed: 'a { color: pink; }\n\n\nb { color: orange; }',
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: 'a { color: pink; \n  top: 0; }',
			fixed: 'a { color: pink;\n  top: 0; }',
			description: 'between declarations with space before and two after newline',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color:\t\n\tpink; }',
			fixed: 'a { color:\n\tpink; }',
			description: 'between properties and values with tab before and after newline',
			message: messages.rejected,
			line: 1,
			column: 11,
		},
		{
			code: 'a { background-position: top left, \ntop right; }',
			fixed: 'a { background-position: top left,\ntop right; }',
			description: 'within values with space before newline',
			message: messages.rejected,
			line: 1,
			column: 35,
		},
		{
			code: '@media print, \nscreen {}',
			fixed: '@media print,\nscreen {}',
			description: 'within media query list with space before newline',
			message: messages.rejected,
			line: 1,
			column: 14,
		},
		{
			code: '@media print { \n  a { color: pink; } }',
			fixed: '@media print {\n  a { color: pink; } }',
			description: 'after opening brace of media query with space before and after newline',
			message: messages.rejected,
			line: 1,
			column: 15,
		},
		{
			code: 'a\t\r{}',
			fixed: 'a\r{}',
			description: 'tab before carriage return before opening brace',
			message: messages.rejected,
			line: 1,
			column: 2,
		},
		{
			code: 'a \n{\n\tcolor: pink;\n\ttop: 0;\n}',
			fixed: 'a\n{\n\tcolor: pink;\n\ttop: 0;\n}',
			message: messages.rejected,
			line: 1,
			column: 2,
		},
		{
			code: 'a\n{\t\n\tcolor: pink;\n\ttop: 0;\n}',
			fixed: 'a\n{\n\tcolor: pink;\n\ttop: 0;\n}',
			message: messages.rejected,
			line: 2,
			column: 2,
		},
		{
			code: 'a\n{\n\tcolor: pink; \n\ttop: 0;\n}',
			fixed: 'a\n{\n\tcolor: pink;\n\ttop: 0;\n}',
			message: messages.rejected,
			line: 3,
			column: 14,
		},
		{
			code: 'a\n{\n\tcolor: pink;\n\ttop: 0;  \n}',
			fixed: 'a\n{\n\tcolor: pink;\n\ttop: 0;\n}',
			message: messages.rejected,
			line: 4,
			column: 10,
		},
		{
			code:
				'@media print { \n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			fixed:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			message: messages.rejected,
			line: 1,
			column: 15,
		},
		{
			code:
				'@media print {\n  a { \n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			fixed:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			message: messages.rejected,
			line: 2,
			column: 6,
		},
		{
			code:
				'@media print {\n  a {\n  color: pink; \n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			fixed:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			message: messages.rejected,
			line: 3,
			column: 15,
		},
		{
			code:
				'@media print {\n  a {\n  color: pink;\n  } \n}\n\n@media screen {\n  b { color: orange; }\n}',
			fixed:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			message: messages.rejected,
			line: 4,
			column: 4,
		},
		{
			code:
				'@media print {\n  a {\n  color: pink;\n  }\n} \n\n@media screen {\n  b { color: orange; }\n}',
			fixed:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			message: messages.rejected,
			line: 5,
			column: 2,
		},
		{
			code:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n \n@media screen {\n  b { color: orange; }\n}',
			fixed:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			message: messages.rejected,
			line: 6,
			column: 1,
		},
		{
			code:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen { \n  b { color: orange; }\n}',
			fixed:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			message: messages.rejected,
			line: 7,
			column: 16,
		},
		{
			code:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; } \n}',
			fixed:
				'@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}',
			message: messages.rejected,
			line: 8,
			column: 23,
		},
		{
			code: 'a { color \n: \npink; }',
			fixed: 'a { color\n:\npink; }',
			description: 'between before and after newline',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 10,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 2,
				},
			],
		},
		{
			code: 'a { padding: 0 \n0 \n0 \n0 \n; }',
			fixed: 'a { padding: 0\n0\n0\n0\n; }',
			description: 'values newline',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 15,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 2,
				},
				{
					message: messages.rejected,
					line: 3,
					column: 2,
				},
				{
					message: messages.rejected,
					line: 4,
					column: 2,
				},
			],
		},
		{
			code: 'a { padding: 0 /* \n \n*/0 0 0; }',
			fixed: 'a { padding: 0 /*\n\n*/0 0 0; }',
			description: 'values comment newline',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 18,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 1,
				},
			],
		},
		{
			code: 'a/* \n*/ \n.b { }',
			fixed: 'a/*\n*/\n.b { }',
			description: 'raws selector',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 4,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 3,
				},
			],
		},
		{
			code: '@media \n print {}',
			fixed: '@media\n print {}',
			description: 'afterName',
			message: messages.rejected,
			line: 1,
			column: 7,
		},
		{
			code: '@media/* \n*/ print {}',
			fixed: '@media/*\n*/ print {}',
			description: 'afterName',
			message: messages.rejected,
			line: 1,
			column: 9,
		},
		{
			code: '@media print, \nscreen {}',
			fixed: '@media print,\nscreen {}',
			description: 'params',
			message: messages.rejected,
			line: 1,
			column: 14,
		},
		{
			code: '@media print,/* \n*/screen {}',
			fixed: '@media print,/*\n*/screen {}',
			description: 'raws params',
			message: messages.rejected,
			line: 1,
			column: 16,
		},
		{
			code: '/* comment      \n*/   \n',
			fixed: '/* comment\n*/\n',
			description: 'comments fix properly (1)',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 16,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 5,
				},
			],
		},
		{
			code: '/* comment      \n*/   ',
			fixed: '/* comment\n*/',
			description: 'comments fix properly (2)',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 16,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 5,
				},
			],
		},
		{
			code: '/* comment      \r\n*/   \r\n',
			fixed: '/* comment\r\n*/\r\n',
			description: 'comments fix properly (3)',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 16,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 5,
				},
			],
		},
		{
			code: '/* comment      \r\n*/   ',
			fixed: '/* comment\r\n*/',
			description: 'comments fix properly (4)',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 16,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 5,
				},
			],
		},
		{
			code: 'a\n{ color: red \n}  ',
			fixed: 'a\n{ color: red\n}',
			description: 'fix properly without trailing EOL',
			warnings: [
				{
					message: messages.rejected,
					line: 2,
					column: 13,
				},
				{
					message: messages.rejected,
					line: 3,
					column: 3,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'scss',
	fix: true,

	accept: [
		{
			code: '// comment 1\n',
			description: 'scss comment (1)',
		},
		{
			code: '//\n//comment\n  a\n{ color: red\n}',
			description: 'scss comment (2)',
		},
	],

	reject: [
		{
			code: '// comment 2  ',
			fixed: '// comment 2',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 14,
				},
			],
		},
		{
			code: '// comment 3  \r\n',
			fixed: '// comment 3\r\n',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 14,
				},
			],
		},
		{
			code: '// comment 3  \ra {color: red}  ',
			fixed: '// comment 3\ra {color: red}',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 14,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 31,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'html',
	fix: true,

	accept: [
		{
			code: `<div> /* After this comment we have eol whitespace */ 
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
  color: red; 
}
</style>

</div>`,
			fixed: `<div>
<style>
a {
  color: red;
}
</style>

</div>`,
			message: messages.rejected,
			line: 4,
			column: 14,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignore: ['empty-lines'] }],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: 'a {}\n     \nb {}',
			description: 'empty line with spaces',
		},
		{
			code: 'a {}\r\n\t\r\nb {}',
			description: 'empty line with a tab and CRLF',
		},
		{
			code: 'a {}\n  \t\nb {}',
			description: 'empty line with spaces and a tab',
		},
		{
			code: ' \n',
			description: 'no nodes with space before newline',
		},
	],

	reject: [
		{
			code: 'a { color: pink; \n}',
			fixed: 'a { color: pink;\n}',
			description: 'typical rejection #1',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: pink; }\t\n',
			fixed: 'a { color: pink; }\n',
			description: 'typical rejection #2',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
	],
});

testRule({
	ruleName,
	syntax: 'css-in-js',
	config: [true],

	accept: [
		{
			code: `
        export const a = styled.div\`
          a {}
\`;

        export const b = styled.div\`
          a {}
\`;
      `,
		},
		{
			code: `export default <a style={{
width: 'calc(100% - 80px)'
}} />;`,
		},
	],
});

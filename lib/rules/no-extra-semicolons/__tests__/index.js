'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	fix: true,

	accept: [
		{
			code: "@import 'x.css';",
		},
		{
			code: '.foo { color: red }',
		},
		{
			code: '.foo { color: red; }',
		},
		{
			code: '.foo { color: red; display: block; }',
		},
		{
			code: '.foo { color: red; display: block }',
		},
		{
			code: '@media screen { a { color: red; } }',
		},
		{
			code: '/* comment */',
		},
		{
			code: '/* comment; */',
		},
		{
			code: '/* ;;comment;; words;; */',
		},
		{
			code: "a { content: ''; }",
		},
		{
			code: "a { content: ';'; }",
		},
		{
			code: "a { content: ';;'; }",
		},
		{
			code: "a { content: ';\t; ;'; }",
		},
		{
			code: ':root { --foo: red; --bar: blue; }',
		},
		{
			code:
				':root { --foo: { color: red }; --bar: { color: blue }; --foo-bar: { color: blue }; --bar-foo: { color: red }; }',
		},
		{
			code:
				':root { --foo: { color: red }; /* comment */ --bar: { color: blue };/* comment */ --foo-bar: { color: blue }; --bar-foo: { color: red }; }',
		},
	],

	reject: [
		{
			code: ';',
			fixed: '',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ' ;',
			fixed: ' ',
			message: messages.rejected,
			line: 1,
			column: 2,
		},
		{
			code: '  ;',
			fixed: '  ',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: '\n;',
			fixed: '\n',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: '\n\n;',
			fixed: '\n\n',
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: '\r\n;',
			fixed: '\r\n',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: '\r\n\r\n;',
			fixed: '\r\n\r\n',
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: '\r;',
			fixed: '\r',
			message: messages.rejected,
			line: 1,
			column: 2,
		},
		{
			code: '\r\r;',
			fixed: '\r\r',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: '\t;',
			fixed: '\t',
			message: messages.rejected,
			line: 1,
			column: 2,
		},
		{
			code: '\t\t;',
			fixed: '\t\t',
			message: messages.rejected,
			line: 1,
			column: 3,
		},
		{
			code: '; ; ;',
			fixed: '  ',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 1,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 3,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 5,
				},
			],
		},
		{
			code: 'a {;}',
			fixed: 'a {}',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'a { ;}',
			fixed: 'a { }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'a {; }',
			fixed: 'a { }',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'a { ; }',
			fixed: 'a {  }',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'a {  ;}',
			fixed: 'a {  }',
			message: messages.rejected,
			line: 1,
			column: 6,
		},
		{
			code: 'a {;  }',
			fixed: 'a {  }',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'a {  ;  }',
			fixed: 'a {    }',
			message: messages.rejected,
			line: 1,
			column: 6,
		},
		{
			code: 'a {   ;   }',
			fixed: 'a {      }',
			message: messages.rejected,
			line: 1,
			column: 7,
		},
		{
			code: 'a {\n;}',
			fixed: 'a {\n}',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: 'a {;\n}',
			fixed: 'a {\n}',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'a {\n;\n}',
			fixed: 'a {\n\n}',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: 'a {\r\n;}',
			fixed: 'a {\r\n}',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: 'a {;\r\n}',
			fixed: 'a {\r\n}',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'a {\r\n;\r\n}',
			fixed: 'a {\r\n\r\n}',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: 'a {\t;}',
			fixed: 'a {\t}',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'a {;\t}',
			fixed: 'a {\t}',
			message: messages.rejected,
			line: 1,
			column: 4,
		},
		{
			code: 'a {\t;\t}',
			fixed: 'a {\t\t}',
			message: messages.rejected,
			line: 1,
			column: 5,
		},
		{
			code: 'a { ;\n;\t; }',
			fixed: 'a { \n\t }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 5,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 1,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 3,
				},
			],
		},
		{
			code: 'a { color: red; };',
			fixed: 'a { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: red; } ;',
			fixed: 'a { color: red; } ',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: red; }\n;',
			fixed: 'a { color: red; }\n',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: red; }\n\n;',
			fixed: 'a { color: red; }\n\n',
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: 'a { color: red; }\r\n;',
			fixed: 'a { color: red; }\r\n',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: red; }\r\n\r\n;',
			fixed: 'a { color: red; }\r\n\r\n',
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: 'a { color: red; }\r;',
			fixed: 'a { color: red; }\r',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: red; }\r\r;',
			fixed: 'a { color: red; }\r\r',
			message: messages.rejected,
			line: 1,
			column: 20,
		},
		{
			code: 'a { color: red; }\t;',
			fixed: 'a { color: red; }\t',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: red; }\t\t;',
			fixed: 'a { color: red; }\t\t',
			message: messages.rejected,
			line: 1,
			column: 20,
		},
		{
			code: 'a { color: red; };\t;\n; ;',
			fixed: 'a { color: red; }\t\n ',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 20,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 1,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 3,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 18,
				},
			],
		},
		{
			code: ';a { color: red; }',
			fixed: 'a { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '; a { color: red; }',
			fixed: ' a { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ';  a { color: red; }',
			fixed: '  a { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ';\na { color: red; }',
			fixed: '\na { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ';\n\na { color: red; }',
			fixed: '\n\na { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ';\r\na { color: red; }',
			fixed: '\r\na { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ';\r\n\r\na { color: red; }',
			fixed: '\r\n\r\na { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ';\ta { color: red; }',
			fixed: '\ta { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ';\t\ta { color: red; }',
			fixed: '\t\ta { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ';\n;\t; ;a { color: red; }',
			fixed: '\n\t a { color: red; }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 1,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 1,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 3,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 5,
				},
			],
		},
		{
			code: '/*comment*/\n;\t; ;a { color: red; }',
			fixed: '/*comment*/\n\t a { color: red; }',
			warnings: [
				{
					message: messages.rejected,
					line: 2,
					column: 1,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 3,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 5,
				},
			],
		},
		{
			code: ';/*comment*/\n;\t; ;a { color: red; }',
			fixed: '/*comment*/\n\t a { color: red; }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 1,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 1,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 3,
				},
				{
					message: messages.rejected,
					line: 2,
					column: 5,
				},
			],
		},
		{
			code: '@media screen { ; }',
			fixed: '@media screen {  }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: '@media screen { ;a { color: red; } }',
			fixed: '@media screen { a { color: red; } }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: '@media screen { a { color: red; }; }',
			fixed: '@media screen { a { color: red; } }',
			message: messages.rejected,
			line: 1,
			column: 34,
		},
		{
			code: '@media screen { };',
			fixed: '@media screen { }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: ';@media screen { }',
			fixed: '@media screen { }',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: ';/* comment */',
			fixed: '/* comment */',
			message: messages.rejected,
			line: 1,
			column: 1,
		},
		{
			code: '/* comment */;',
			fixed: '/* comment */',
			message: messages.rejected,
			line: 1,
			column: 14,
		},
		{
			code: '/* comment */ ; /*comment */',
			fixed: '/* comment */  /*comment */',
			message: messages.rejected,
			line: 1,
			column: 15,
		},
		{
			code: '/* comment */\n;\n/* comment */',
			fixed: '/* comment */\n\n/* comment */',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: '/* comment */\r\n;\r\n/* comment */',
			fixed: '/* comment */\r\n\r\n/* comment */',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: '/* comment */\t;\t/* comment */',
			fixed: '/* comment */\t\t/* comment */',
			message: messages.rejected,
			line: 1,
			column: 15,
		},
		{
			code: 'a {;/*c*/;/*c*/; color: red;; }',
			fixed: 'a {/*c*//*c*/ color: red; }',
			warnings: [
				{
					message: messages.rejected,
					line: 1,
					column: 29,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 4,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 10,
				},
				{
					message: messages.rejected,
					line: 1,
					column: 16,
				},
			],
		},
		{
			code: 'a { color: red;; }',
			fixed: 'a { color: red; }',
			message: messages.rejected,
			line: 1,
			column: 16,
		},
		{
			code: 'a { color: red; ; }',
			fixed: 'a { color: red;  }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: red;  ; }',
			fixed: 'a { color: red;   }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: red;\n; }',
			fixed: 'a { color: red;\n }',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: red;\n\n; }',
			fixed: 'a { color: red;\n\n }',
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: 'a { color: red;\r\n; }',
			fixed: 'a { color: red;\r\n }',
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: 'a { color: red;\r\n\r\n; }',
			fixed: 'a { color: red;\r\n\r\n }',
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: 'a { color: red;\t; }',
			fixed: 'a { color: red;\t }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: red;\t\t; }',
			fixed: 'a { color: red;\t\t }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: red ;; }',
			fixed: 'a { color: red ; }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: red  ;; }',
			fixed: 'a { color: red  ; }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a { color: red   ;; }',
			fixed: 'a { color: red   ; }',
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: 'a { color: red\n;; }',
			fixed: 'a { color: red\n; }',
			message: messages.rejected,
			line: 2,
			column: 2,
		},
		{
			code: 'a { color: red\n\n;; }',
			fixed: 'a { color: red\n\n; }',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a { color: red\r\n;; }',
			fixed: 'a { color: red\r\n; }',
			message: messages.rejected,
			line: 2,
			column: 2,
		},
		{
			code: 'a { color: red\r\n\r\n;; }',
			fixed: 'a { color: red\r\n\r\n; }',
			message: messages.rejected,
			line: 3,
			column: 2,
		},
		{
			code: 'a { color: red\t;; }',
			fixed: 'a { color: red\t; }',
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: 'a { color: red;\t\t; }',
			fixed: 'a { color: red;\t\t }',
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'a {\n  color: #FFF;;\n  /* foo */\n  /* bar */\n}',
			fixed: 'a {\n  color: #FFF;\n  /* foo */\n  /* bar */\n}',
			message: messages.rejected,
			line: 2,
			column: 15,
		},
		{
			code: 'a {\n  /* foo */\n  /* bar */\n  color: #FFF;;\n}',
			fixed: 'a {\n  /* foo */\n  /* bar */\n  color: #FFF;\n}',
			message: messages.rejected,
			line: 4,
			column: 15,
		},
		{
			code: 'a {\n  /* foo */\n  color: #FFF;;\n  /* bar */\n}',
			fixed: 'a {\n  /* foo */\n  color: #FFF;\n  /* bar */\n}',
			message: messages.rejected,
			line: 3,
			column: 15,
		},
		{
			code: "@import 'x.css';;",
			fixed: "@import 'x.css';",
			message: messages.rejected,
			line: 1,
			column: 17,
		},
		{
			code: "@import 'x.css'; ;",
			fixed: "@import 'x.css'; ",
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: "@import 'x.css';  ;",
			fixed: "@import 'x.css';  ",
			message: messages.rejected,
			line: 1,
			column: 19,
		},
		{
			code: "@import 'x.css';\n;",
			fixed: "@import 'x.css';\n",
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: "@import 'x.css';\n\n;",
			fixed: "@import 'x.css';\n\n",
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: "@import 'x.css';\r\n;",
			fixed: "@import 'x.css';\r\n",
			message: messages.rejected,
			line: 2,
			column: 1,
		},
		{
			code: "@import 'x.css';\r\n\r\n;",
			fixed: "@import 'x.css';\r\n\r\n",
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: "@import 'x.css';\t;",
			fixed: "@import 'x.css';\t",
			message: messages.rejected,
			line: 1,
			column: 18,
		},
		{
			code: 'div a {\n  float: left;\n}\ndiv {\n  float: left;;\n}',
			fixed: 'div a {\n  float: left;\n}\ndiv {\n  float: left;\n}',
			message: messages.rejected,
			line: 5,
			column: 15,
		},
		{
			code: 'div a {\n  float: left;\n}\ndiv {\n  float: left;  ;\n}',
			fixed: 'div a {\n  float: left;\n}\ndiv {\n  float: left;  \n}',
			message: messages.rejected,
			line: 5,
			column: 17,
		},
		{
			code: 'div a {\n  float: left;\n}\ndiv {\n  float: left;\n;\n}',
			fixed: 'div a {\n  float: left;\n}\ndiv {\n  float: left;\n\n}',
			message: messages.rejected,
			line: 6,
			column: 1,
		},
		{
			code: ':root { --foo: red;; --bar: blue; }',
			fixed: ':root { --foo: red; --bar: blue; }',
			message: messages.rejected,
			line: 1,
			column: 20,
		},
		{
			code: ':root { --foo: red; --bar: blue;; }',
			fixed: ':root { --foo: red; --bar: blue; }',
			message: messages.rejected,
			line: 1,
			column: 33,
		},
		{
			code: ':root {; --foo: { color: red }; --bar: { color: blue }; --bar-foo: { color: red }; }',
			fixed: ':root { --foo: { color: red }; --bar: { color: blue }; --bar-foo: { color: red }; }',
			message: messages.rejected,
			line: 1,
			column: 8,
		},
		{
			code: ':root { --foo: { color: red };; --bar: { color: blue }; --bar-foo: { color: red }; }',
			fixed: ':root { --foo: { color: red }; --bar: { color: blue }; --bar-foo: { color: red }; }',
			message: messages.rejected,
			line: 1,
			column: 31,
		},
		{
			code: ':root { --foo: { color: red }; --bar: { color: blue };; --bar-foo: { color: red }; }',
			fixed: ':root { --foo: { color: red }; --bar: { color: blue }; --bar-foo: { color: red }; }',
			message: messages.rejected,
			line: 1,
			column: 55,
		},
		{
			code: ':root { --foo: { color: red };/* comment */;}',
			fixed: ':root { --foo: { color: red };/* comment */}',
			message: messages.rejected,
			line: 1,
			column: 44,
		},
		{
			code: ':root { --foo: { color: red };/* comment */;/* comment */}',
			fixed: ':root { --foo: { color: red };/* comment *//* comment */}',
			message: messages.rejected,
			line: 1,
			column: 44,
		},
		{
			code:
				':root { --foo: { color: red };/* comment */; --bar: { color: blue }; --bar-foo: { color: red }; }',
			fixed:
				':root { --foo: { color: red };/* comment */ --bar: { color: blue }; --bar-foo: { color: red }; }',
			message: messages.rejected,
			line: 1,
			column: 44,
		},
		{
			code:
				':root { --foo: { color: red }; --bar: { color: blue };/* comment 1 */ /* comment 2 */; --bar-foo: { color: red }; }',
			fixed:
				':root { --foo: { color: red }; --bar: { color: blue };/* comment 1 */ /* comment 2 */ --bar-foo: { color: red }; }',
			message: messages.rejected,
			line: 1,
			column: 86,
		},
		{
			code:
				':root { --foo: { color: red }; --bar: { color: blue }/* comment 1 */; /* comment 2 */; --bar-foo: { color: red }; }',
			fixed:
				':root { --foo: { color: red }; --bar: { color: blue }/* comment 1 */; /* comment 2 */ --bar-foo: { color: red }; }',
			message: messages.rejected,
			line: 1,
			column: 86,
		},
		{
			code: ':root { --foo: { color: red }; --bar: { color: blue }; --bar-foo: { color: red };; }',
			fixed: ':root { --foo: { color: red }; --bar: { color: blue }; --bar-foo: { color: red }; }',
			message: messages.rejected,
			line: 1,
			column: 82,
		},
		{
			code: 'a { --foo: { color: red }; --bar: { color: blue }; --bar-foo: { color: red };; }',
			fixed: 'a { --foo: { color: red }; --bar: { color: blue }; --bar-foo: { color: red }; }',
			message: messages.rejected,
			line: 1,
			column: 78,
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
			code: `<div>
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
;
</style>
</div>`,
			fixed: `<div>
<style>

</style>
</div>`,
			message: messages.rejected,
			line: 3,
			column: 1,
		},
		{
			code: `<div>
<style>
a {
  color: red;;
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
	config: [true],
	syntax: 'less',
	fix: true,

	accept: [
		{
			code: "@import 'x.css';",
		},
		{
			code: 'a { .mixin(); .mixin2; }',
		},
		{
			code: 'a { .mixin();; .mixin2;; }',
			description: 'ignore less mixins',
		},
	],

	reject: [
		{
			code: 'a { .mixin();\ncolor: red;; }',
			fixed: 'a { .mixin();\ncolor: red; }',
			message: messages.rejected,
			line: 2,
			column: 12,
		},
	],
});

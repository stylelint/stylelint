'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,

	accept: [
		{
			code: "@charset 'UTF-8';",
		},
		{
			code: "@CHARSET 'UTF-8';",
		},
		{
			code: "@charset 'iso-8859-15'",
		},
		{
			code: '@import url("fineprint.css") print;',
		},
		{
			code: "@import 'custom.css'",
		},
		{
			code: "@import url('landscape.css') screen and (orientation:landscape);",
		},
		{
			code: '@namespace url(http://www.w3.org/1999/xhtml);',
		},
		{
			code: '@namespace prefix url(XML-namespace-URL);',
		},
		{
			code: '@media print { body { font-size: 10pt } }',
		},
		{
			code: '@media (max-width: 960px) { body { font-size: 13px } }',
		},
		{
			code: '@media screen, print { body { line-height: 1.2 } }',
		},
		{
			code: '@supports (--foo: green) { body { color: green; } }',
		},
		{
			code: '@supports ( (perspective: 10px) or (-webkit-perspective: 10px) ) { font-size: 10pt }',
		},
		{
			code: "@counter-style win-list { system: fixed; symbols: url(gold-medal.svg); suffix: ' ';}",
		},
		{
			code:
				"@document url(http://www.w3.org/), url-prefix(http://www.w3.org/Style/), domain(mozilla.org), regexp('https:.*')",
		},
		{
			code: '@page :left { margin-left: 4cm; }',
		},
		{
			code: '@page { @top-center { content: none } }',
		},
		{
			code:
				'@font-face { font-family: MyHelvetica; src: local("Helvetica"), url(MgOpenModern.ttf); }',
		},
		{
			code:
				'@keyframes identifier { 0% { top: 0; left: 0; } 30% { top: 50px; } 68%, 100% { top: 100px; left: 100%; } }',
		},
		{
			code:
				'@-webkit-keyframes identifier { 0% { top: 0; left: 0; } 30% { top: 50px; } 68%, 100% { top: 100px; left: 100%; } }',
		},
		{
			code: '@viewport { min-width: 640px; max-width: 800px; }',
		},
		{
			code: '@viewport { orientation: landscape; }',
		},
		{
			code:
				'@counter-style winners-list { system: fixed; symbols: url(gold-medal.svg); suffix: " "; }',
		},
		{
			code: '@font-feature-values Font One { @styleset { nice-style: 12; } }',
		},
		{
			code: '.foo { color: red; @nest .parent & { color: blue; } }',
		},
	],

	reject: [
		{
			code: '@unknown-at-rule { }',
			message: messages.rejected('@unknown-at-rule'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreAtRules: ['unknown', '/^my-/', '/^YOUR-/i'] }],
	skipBasicChecks: true,

	accept: [
		{
			code: '@unknown { }',
		},
		{
			code: '@my-at-rule { }',
		},
		{
			code: '@your-at-rule { }',
		},
		{
			code: '@YOUR-at-rule { }',
		},
	],

	reject: [
		{
			code: '@uNkNoWn { }',
			message: messages.rejected('@uNkNoWn'),
			line: 1,
			column: 1,
		},
		{
			code: '@UNKNOWN { }',
			message: messages.rejected('@UNKNOWN'),
			line: 1,
			column: 1,
		},
		{
			code: '@unknown-at-rule { }',
			message: messages.rejected('@unknown-at-rule'),
			line: 1,
			column: 1,
		},
		{
			code: '@unknown { @unknown-at-rule { font-size: 14px; } }',
			message: messages.rejected('@unknown-at-rule'),
			line: 1,
			column: 12,
		},
		{
			code: '@MY-other-at-rule { }',
			message: messages.rejected('@MY-other-at-rule'),
			line: 1,
			column: 1,
		},
		{
			code: '@not-my-at-rule {}',
			message: messages.rejected('@not-my-at-rule'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreAtRules: [/^my-/] }],
	skipBasicChecks: true,

	accept: [
		{
			code: '@my-at-rule { }',
		},
	],

	reject: [
		{
			code: '@unknown-at-rule { }',
			message: messages.rejected('@unknown-at-rule'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: [true],

	accept: [
		{
			code: `
        .some-mixin() { margin: 0; }

        span { .some-mixin(); }
      `,
			description: 'ignore Less mixin',
		},
		{
			code: `
        @my-variable: #f7f8f9;
        span { background-color: @my-variable; }
      `,
			description: 'ingore Less variable',
		},
	],
});

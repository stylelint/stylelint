'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['lower'],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a:hover { color: pink; }',
		},
		{
			code: 'a:focus { color: pink; }',
		},
		{
			code: 'a:before { color: pink; }',
		},
		{
			code: 'a:BEFORE { color: pink; }',
		},
		{
			code: 'a:after { color: pink; }',
		},
		{
			code: 'a:AFTER { color: pink; }',
		},
		{
			code: 'a:first-letter { color: pink; }',
		},
		{
			code: 'a:FIRST-LETTER { color: pink; }',
		},
		{
			code: 'a:first-line { color: pink; }',
		},
		{
			code: 'a:FIRST-LINE { color: pink; }',
		},
		{
			code: 'a::before { color: pink; }',
		},
		{
			code: 'a::BEFORE { color: pink; }',
		},
		{
			code: 'a::some-pseudo-element { }',
		},
		{
			code: 'a::SOME-PSEUDO-ELEMENT { }',
		},
		{
			code: 'p:first-child:before { }',
		},
		{
			code: 'p:first-child:BEFORE { }',
		},
		{
			code: 'h1:not(h2, h3) { }',
		},
		{
			code: 'p:nth-child(3n+0) { }',
		},
		{
			code: 'p:nth-child(odd) { }',
		},
		{
			code: 'input::-moz-placeholder { color: pink; }',
		},
		{
			code: 'input::-MOZ-PLACEHOLDER { color: pink; }',
		},
		{
			code: ':root { background: #ff0000; }',
		},
		{
			code: 'a:some-pseudo-class { }',
		},
		{
			code: ':some-pseudo-class { }',
		},
		{
			code: 'input[type=file]:active::-webkit-file-upload-button { }',
		},
		{
			code: 'input[type=file]:active::-WEBKIT-FILE-UPLOAD-BUTTON { }',
		},
		{
			code: ':-ms-input-placeholder { }',
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
	],

	reject: [
		{
			code: 'a:Hover { color: pink; }',
			fixed: 'a:hover { color: pink; }',
			message: messages.expected(':Hover', ':hover'),
			line: 1,
			column: 2,
		},
		{
			code: '/* comment */ a:Hover { color: pink; }',
			fixed: '/* comment */ a:hover { color: pink; }',
			message: messages.expected(':Hover', ':hover'),
			line: 1,
			column: 16,
		},
		{
			code: 'a:Hover,/*comment*/ .b {color: pink;}',
			fixed: 'a:hover,/*comment*/ .b {color: pink;}',
			message: messages.expected(':Hover', ':hover'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:Hover /* comment */ { color: pink; }',
			fixed: 'a:hover /* comment */ { color: pink; }',
			message: messages.expected(':Hover', ':hover'),
			line: 1,
			column: 2,
		},
		{
			code: '.foo > /* comment */ a:Hover { color: pink; }',
			fixed: '.foo > /* comment */ a:hover { color: pink; }',
			message: messages.expected(':Hover', ':hover'),
			line: 1,
			column: 23,
		},
		{
			code: 'a:First-child:Hover { color: pink; }',
			fixed: 'a:first-child:hover { color: pink; }',
			warnings: [
				{
					message: messages.expected(':First-child', ':first-child'),
					line: 1,
					column: 2,
				},
				{
					message: messages.expected(':Hover', ':hover'),
					line: 1,
					column: 14,
				},
			],
		},
		{
			code: 'a:hOvEr { color: pink; }',
			fixed: 'a:hover { color: pink; }',
			message: messages.expected(':hOvEr', ':hover'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:HOVER { color: pink; }',
			fixed: 'a:hover { color: pink; }',
			message: messages.expected(':HOVER', ':hover'),
			line: 1,
			column: 2,
		},
		{
			code: 'p:First-child:before { }',
			fixed: 'p:first-child:before { }',
			message: messages.expected(':First-child', ':first-child'),
			line: 1,
			column: 2,
		},
		{
			code: 'p:First-child:BEFORE { }',
			fixed: 'p:first-child:BEFORE { }',
			message: messages.expected(':First-child', ':first-child'),
			line: 1,
			column: 2,
		},
		{
			code: 'h1:Not(h2, h3) { }',
			fixed: 'h1:not(h2, h3) { }',
			message: messages.expected(':Not', ':not'),
			line: 1,
			column: 3,
		},
		{
			code: 'h1:nOt(h2, h3) { }',
			fixed: 'h1:not(h2, h3) { }',
			message: messages.expected(':nOt', ':not'),
			line: 1,
			column: 3,
		},
		{
			code: 'h1:NOT(h2, h3) { }',
			fixed: 'h1:not(h2, h3) { }',
			message: messages.expected(':NOT', ':not'),
			line: 1,
			column: 3,
		},
		{
			code: ':matcheS(a, .foo) { }',
			fixed: ':matches(a, .foo) { }',
			message: messages.expected(':matcheS', ':matches'),
			line: 1,
			column: 1,
		},
		{
			code: ':Matches(a, .foo) { }',
			fixed: ':matches(a, .foo) { }',
			message: messages.expected(':Matches', ':matches'),
			line: 1,
			column: 1,
		},
		{
			code: 'a:hAs(> img) { }',
			fixed: 'a:has(> img) { }',
			message: messages.expected(':hAs', ':has'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:HAS(> img) {\n}',
			fixed: 'a:has(> img) {\n}',
			message: messages.expected(':HAS', ':has'),
			line: 1,
			column: 2,
		},
		{
			code: ':Root { background: #ff0000; }',
			fixed: ':root { background: #ff0000; }',
			message: messages.expected(':Root', ':root'),
			line: 1,
			column: 1,
		},
		{
			code: ':rOoT { background: #ff0000; }',
			fixed: ':root { background: #ff0000; }',
			message: messages.expected(':rOoT', ':root'),
			line: 1,
			column: 1,
		},
		{
			code: ':ROOT { background: #ff0000; }',
			fixed: ':root { background: #ff0000; }',
			message: messages.expected(':ROOT', ':root'),
			line: 1,
			column: 1,
		},
		{
			code: 'a:Some-pseudo-class { }',
			fixed: 'a:some-pseudo-class { }',
			message: messages.expected(':Some-pseudo-class', ':some-pseudo-class'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:sOmE-pSeUdO-cLaSs { }',
			fixed: 'a:some-pseudo-class { }',
			message: messages.expected(':sOmE-pSeUdO-cLaSs', ':some-pseudo-class'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:SOME-PSEUDO-CLASS { }',
			fixed: 'a:some-pseudo-class { }',
			message: messages.expected(':SOME-PSEUDO-CLASS', ':some-pseudo-class'),
			line: 1,
			column: 2,
		},
		{
			code: ':Some-pseudo-class { }',
			fixed: ':some-pseudo-class { }',
			message: messages.expected(':Some-pseudo-class', ':some-pseudo-class'),
			line: 1,
			column: 1,
		},
		{
			code: ':sOmE-pSeUdO-cLaSs { }',
			fixed: ':some-pseudo-class { }',
			message: messages.expected(':sOmE-pSeUdO-cLaSs', ':some-pseudo-class'),
			line: 1,
			column: 1,
		},
		{
			code: ':SOME-PSEUDO-CLASS { }',
			fixed: ':some-pseudo-class { }',
			message: messages.expected(':SOME-PSEUDO-CLASS', ':some-pseudo-class'),
			line: 1,
			column: 1,
		},
		{
			code: 'input[type=file]:Active::-webkit-file-upload-button { }',
			fixed: 'input[type=file]:active::-webkit-file-upload-button { }',
			message: messages.expected(':Active', ':active'),
			line: 1,
			column: 17,
		},
		{
			code: 'input[type=file]:Active::-WEBKIT-FILE-UPLOAD-BUTTON { }',
			fixed: 'input[type=file]:active::-WEBKIT-FILE-UPLOAD-BUTTON { }',
			message: messages.expected(':Active', ':active'),
			line: 1,
			column: 17,
		},
		{
			code: ':-Ms-input-placeholder { }',
			fixed: ':-ms-input-placeholder { }',
			message: messages.expected(':-Ms-input-placeholder', ':-ms-input-placeholder'),
			line: 1,
			column: 1,
		},
		{
			code: ':-mS-iNpUt-PlAcEhOlDer { }',
			fixed: ':-ms-input-placeholder { }',
			message: messages.expected(':-mS-iNpUt-PlAcEhOlDer', ':-ms-input-placeholder'),
			line: 1,
			column: 1,
		},
		{
			code: ':-MS-INPUT-PLACEHOLDER { }',
			fixed: ':-ms-input-placeholder { }',
			message: messages.expected(':-MS-INPUT-PLACEHOLDER', ':-ms-input-placeholder'),
			line: 1,
			column: 1,
		},
		{
			code: 'a::FIRST-LETTER, a:FIRST {color: pink;}',
			fixed: 'a::FIRST-LETTER, a:first {color: pink;}',
			message: messages.expected(':FIRST', ':first'),
			line: 1,
			column: 19,
		},
		{
			code: 'a::FIRST-LETTER:Hover, a:FIRST {color: pink;}',
			fixed: 'a::FIRST-LETTER:hover, a:first {color: pink;}',
			warnings: [
				{
					message: messages.expected(':Hover', ':hover'),
					line: 1,
					column: 16,
				},
				{
					message: messages.expected(':FIRST', ':first'),
					line: 1,
					column: 25,
				},
			],
		},
		{
			code: 'a::FIRST-LETTER:Hover,/*comment*/ a:FIRST {color: pink;}',
			fixed: 'a::FIRST-LETTER:hover,/*comment*/ a:first {color: pink;}',
			warnings: [
				{
					message: messages.expected(':Hover', ':hover'),
					line: 1,
					column: 16,
				},
				{
					message: messages.expected(':FIRST', ':first'),
					line: 1,
					column: 36,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a:HOVER { color: pink; }',
		},
		{
			code: 'a:FOCUS { color: pink; }',
		},
		{
			code: 'a:before { color: pink; }',
		},
		{
			code: 'a:BEFORE { color: pink; }',
		},
		{
			code: 'a:after { color: pink; }',
		},
		{
			code: 'a:AFTER { color: pink; }',
		},
		{
			code: 'a:first-letter { color: pink; }',
		},
		{
			code: 'a:FIRST-LETTER { color: pink; }',
		},
		{
			code: 'a:first-line { color: pink; }',
		},
		{
			code: 'a:FIRST-LINE { color: pink; }',
		},
		{
			code: 'a::before { color: pink; }',
		},
		{
			code: 'a::BEFORE { color: pink; }',
		},
		{
			code: 'a::some-pseudo-element { }',
		},
		{
			code: 'a::SOME-PSEUDO-ELEMENT { }',
		},
		{
			code: 'p:FIRST-CHILD:before { }',
		},
		{
			code: 'p:FIRST-CHILD:BEFORE { }',
		},
		{
			code: 'h1:NOT(h2, h3) { }',
		},
		{
			code: 'p:NTH-CHILD(3n+0) { }',
		},
		{
			code: 'p:NTH-CHILD(odd) { }',
		},
		{
			code: 'input::-moz-placeholder { color: pink; }',
		},
		{
			code: 'input::-MOZ-PLACEHOLDER { color: pink; }',
		},
		{
			code: ':ROOT { background: #ff0000; }',
		},
		{
			code: 'a:SOME-PSEUDO-CLASS { }',
		},
		{
			code: ':SOME-PSEUDO-CLASS { }',
		},
		{
			code: 'input[type=file]:ACTIVE::-webkit-file-upload-button { }',
		},
		{
			code: 'input[type=file]:ACTIVE::-WEBKIT-FILE-UPLOAD-BUTTON { }',
		},
		{
			code: ':-MS-INPUT-PLACEHOLDER { }',
		},
	],

	reject: [
		{
			code: 'a:Hover { color: pink; }',
			fixed: 'a:HOVER { color: pink; }',
			message: messages.expected(':Hover', ':HOVER'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:hOvEr { color: pink; }',
			fixed: 'a:HOVER { color: pink; }',
			message: messages.expected(':hOvEr', ':HOVER'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:hover { color: pink; }',
			fixed: 'a:HOVER { color: pink; }',
			message: messages.expected(':hover', ':HOVER'),
			line: 1,
			column: 2,
		},
		{
			code: 'p:First-child:before { }',
			fixed: 'p:FIRST-CHILD:before { }',
			message: messages.expected(':First-child', ':FIRST-CHILD'),
			line: 1,
			column: 2,
		},
		{
			code: 'p:First-child:BEFORE { }',
			fixed: 'p:FIRST-CHILD:BEFORE { }',
			message: messages.expected(':First-child', ':FIRST-CHILD'),
			line: 1,
			column: 2,
		},
		{
			code: 'h1:Not(h2, h3) { }',
			fixed: 'h1:NOT(h2, h3) { }',
			message: messages.expected(':Not', ':NOT'),
			line: 1,
			column: 3,
		},
		{
			code: 'h1:nOt(h2, h3) { }',
			fixed: 'h1:NOT(h2, h3) { }',
			message: messages.expected(':nOt', ':NOT'),
			line: 1,
			column: 3,
		},
		{
			code: 'h1:not(h2, h3) { }',
			fixed: 'h1:NOT(h2, h3) { }',
			message: messages.expected(':not', ':NOT'),
			line: 1,
			column: 3,
		},
		{
			code: ':Root { background: #ff0000; }',
			fixed: ':ROOT { background: #ff0000; }',
			message: messages.expected(':Root', ':ROOT'),
			line: 1,
			column: 1,
		},
		{
			code: ':rOoT { background: #ff0000; }',
			fixed: ':ROOT { background: #ff0000; }',
			message: messages.expected(':rOoT', ':ROOT'),
			line: 1,
			column: 1,
		},
		{
			code: ':root { background: #ff0000; }',
			fixed: ':ROOT { background: #ff0000; }',
			message: messages.expected(':root', ':ROOT'),
			line: 1,
			column: 1,
		},
		{
			code: 'a:Some-pseudo-class { }',
			fixed: 'a:SOME-PSEUDO-CLASS { }',
			message: messages.expected(':Some-pseudo-class', ':SOME-PSEUDO-CLASS'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:sOmE-pSeUdO-cLaSs { }',
			fixed: 'a:SOME-PSEUDO-CLASS { }',
			message: messages.expected(':sOmE-pSeUdO-cLaSs', ':SOME-PSEUDO-CLASS'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:some-pseudo-class { }',
			fixed: 'a:SOME-PSEUDO-CLASS { }',
			message: messages.expected(':some-pseudo-class', ':SOME-PSEUDO-CLASS'),
			line: 1,
			column: 2,
		},
		{
			code: ':Some-pseudo-class { }',
			fixed: ':SOME-PSEUDO-CLASS { }',
			message: messages.expected(':Some-pseudo-class', ':SOME-PSEUDO-CLASS'),
			line: 1,
			column: 1,
		},
		{
			code: ':sOmE-pSeUdO-cLaSs { }',
			fixed: ':SOME-PSEUDO-CLASS { }',
			message: messages.expected(':sOmE-pSeUdO-cLaSs', ':SOME-PSEUDO-CLASS'),
			line: 1,
			column: 1,
		},
		{
			code: ':some-pseudo-class { }',
			fixed: ':SOME-PSEUDO-CLASS { }',
			message: messages.expected(':some-pseudo-class', ':SOME-PSEUDO-CLASS'),
			line: 1,
			column: 1,
		},
		{
			code: 'input[type=file]:Active::-webkit-file-upload-button { }',
			fixed: 'input[type=file]:ACTIVE::-webkit-file-upload-button { }',
			message: messages.expected(':Active', ':ACTIVE'),
			line: 1,
			column: 17,
		},
		{
			code: 'input[type=file]:Active::-WEBKIT-FILE-UPLOAD-BUTTON { }',
			fixed: 'input[type=file]:ACTIVE::-WEBKIT-FILE-UPLOAD-BUTTON { }',
			message: messages.expected(':Active', ':ACTIVE'),
			line: 1,
			column: 17,
		},
		{
			code: ':-Ms-input-placeholder { }',
			fixed: ':-MS-INPUT-PLACEHOLDER { }',
			message: messages.expected(':-Ms-input-placeholder', ':-MS-INPUT-PLACEHOLDER'),
			line: 1,
			column: 1,
		},
		{
			code: ':-mS-iNpUt-PlAcEhOlDer { }',
			fixed: ':-MS-INPUT-PLACEHOLDER { }',
			message: messages.expected(':-mS-iNpUt-PlAcEhOlDer', ':-MS-INPUT-PLACEHOLDER'),
			line: 1,
			column: 1,
		},
		{
			code: ':-ms-input-placeholder { }',
			fixed: ':-MS-INPUT-PLACEHOLDER { }',
			message: messages.expected(':-ms-input-placeholder', ':-MS-INPUT-PLACEHOLDER'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['lower'],
	skipBasicChecks: true,
	syntax: 'scss',

	accept: [
		{
			code: ':#{$variable} {}',
		},
		{
			code: ':#{$VARIABLE} {}',
		},
		{
			code: 'a:#{$variable} {}',
		},
	],
});

testRule({
	ruleName,
	config: ['lower'],
	skipBasicChecks: true,
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a:hover { color: pink; }',
		},
		{
			code: 'a:focus { color: pink; }',
		},
		{
			code: 'a:before { color: pink; }',
		},
		{
			code: 'a:BEFORE { color: pink; }',
		},
		{
			code: 'a:after { color: pink; }',
		},
		{
			code: 'a:AFTER { color: pink; }',
		},
		{
			code: 'a:first-letter { color: pink; }',
		},
		{
			code: 'a:FIRST-LETTER { color: pink; }',
		},
		{
			code: 'a:first-line { color: pink; }',
		},
		{
			code: 'a:FIRST-LINE { color: pink; }',
		},
		{
			code: 'a::before { color: pink; }',
		},
		{
			code: 'a::BEFORE { color: pink; }',
		},
		{
			code: 'a::some-pseudo-element { }',
		},
		{
			code: 'a::SOME-PSEUDO-ELEMENT { }',
		},
		{
			code: 'p:first-child:before { }',
		},
		{
			code: 'p:first-child:BEFORE { }',
		},
		{
			code: 'h1:not(h2, h3) { }',
		},
		{
			code: 'p:nth-child(3n+0) { }',
		},
		{
			code: 'p:nth-child(odd) { }',
		},
		{
			code: 'input::-moz-placeholder { color: pink; }',
		},
		{
			code: 'input::-MOZ-PLACEHOLDER { color: pink; }',
		},
		{
			code: ':root { background: #ff0000; }',
		},
		{
			code: 'a:some-pseudo-class { }',
		},
		{
			code: ':some-pseudo-class { }',
		},
		{
			code: 'input[type=file]:active::-webkit-file-upload-button { }',
		},
		{
			code: 'input[type=file]:active::-WEBKIT-FILE-UPLOAD-BUTTON { }',
		},
		{
			code: ':-ms-input-placeholder { }',
		},
	],

	reject: [
		{
			code: 'a:Hover { color: pink; }',
			fixed: 'a:hover { color: pink; }',
			message: messages.expected(':Hover', ':hover'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:hOvEr { color: pink; }',
			fixed: 'a:hover { color: pink; }',
			message: messages.expected(':hOvEr', ':hover'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:HOVER { color: pink; }',
			fixed: 'a:hover { color: pink; }',
			message: messages.expected(':HOVER', ':hover'),
			line: 1,
			column: 2,
		},
		{
			code: 'p:First-child:before { }',
			fixed: 'p:first-child:before { }',
			message: messages.expected(':First-child', ':first-child'),
			line: 1,
			column: 2,
		},
		{
			code: 'p:First-child:BEFORE { }',
			fixed: 'p:first-child:BEFORE { }',
			message: messages.expected(':First-child', ':first-child'),
			line: 1,
			column: 2,
		},
		{
			code: 'h1:Not(h2, h3) { }',
			fixed: 'h1:not(h2, h3) { }',
			message: messages.expected(':Not', ':not'),
			line: 1,
			column: 3,
		},
		{
			code: 'h1:nOt(h2, h3) { }',
			fixed: 'h1:not(h2, h3) { }',
			message: messages.expected(':nOt', ':not'),
			line: 1,
			column: 3,
		},
		{
			code: 'h1:NOT(h2, h3) { }',
			fixed: 'h1:not(h2, h3) { }',
			message: messages.expected(':NOT', ':not'),
			line: 1,
			column: 3,
		},
		{
			code: ':Root { background: #ff0000; }',
			fixed: ':root { background: #ff0000; }',
			message: messages.expected(':Root', ':root'),
			line: 1,
			column: 1,
		},
		{
			code: ':rOoT { background: #ff0000; }',
			fixed: ':root { background: #ff0000; }',
			message: messages.expected(':rOoT', ':root'),
			line: 1,
			column: 1,
		},
		{
			code: ':ROOT { background: #ff0000; }',
			fixed: ':root { background: #ff0000; }',
			message: messages.expected(':ROOT', ':root'),
			line: 1,
			column: 1,
		},
		{
			code: 'a:Some-pseudo-class { }',
			fixed: 'a:some-pseudo-class { }',
			message: messages.expected(':Some-pseudo-class', ':some-pseudo-class'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:sOmE-pSeUdO-cLaSs { }',
			fixed: 'a:some-pseudo-class { }',
			message: messages.expected(':sOmE-pSeUdO-cLaSs', ':some-pseudo-class'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:SOME-PSEUDO-CLASS { }',
			fixed: 'a:some-pseudo-class { }',
			message: messages.expected(':SOME-PSEUDO-CLASS', ':some-pseudo-class'),
			line: 1,
			column: 2,
		},
		{
			code: ':Some-pseudo-class { }',
			fixed: ':some-pseudo-class { }',
			message: messages.expected(':Some-pseudo-class', ':some-pseudo-class'),
			line: 1,
			column: 1,
		},
		{
			code: ':sOmE-pSeUdO-cLaSs { }',
			fixed: ':some-pseudo-class { }',
			message: messages.expected(':sOmE-pSeUdO-cLaSs', ':some-pseudo-class'),
			line: 1,
			column: 1,
		},
		{
			code: ':SOME-PSEUDO-CLASS { }',
			fixed: ':some-pseudo-class { }',
			message: messages.expected(':SOME-PSEUDO-CLASS', ':some-pseudo-class'),
			line: 1,
			column: 1,
		},
		{
			code: 'input[type=file]:Active::-webkit-file-upload-button { }',
			fixed: 'input[type=file]:active::-webkit-file-upload-button { }',
			message: messages.expected(':Active', ':active'),
			line: 1,
			column: 17,
		},
		{
			code: 'input[type=file]:Active::-WEBKIT-FILE-UPLOAD-BUTTON { }',
			fixed: 'input[type=file]:active::-WEBKIT-FILE-UPLOAD-BUTTON { }',
			message: messages.expected(':Active', ':active'),
			line: 1,
			column: 17,
		},
		{
			code: ':-Ms-input-placeholder { }',
			fixed: ':-ms-input-placeholder { }',
			message: messages.expected(':-Ms-input-placeholder', ':-ms-input-placeholder'),
			line: 1,
			column: 1,
		},
		{
			code: ':-mS-iNpUt-PlAcEhOlDer { }',
			fixed: ':-ms-input-placeholder { }',
			message: messages.expected(':-mS-iNpUt-PlAcEhOlDer', ':-ms-input-placeholder'),
			line: 1,
			column: 1,
		},
		{
			code: ':-MS-INPUT-PLACEHOLDER { }',
			fixed: ':-ms-input-placeholder { }',
			message: messages.expected(':-MS-INPUT-PLACEHOLDER', ':-ms-input-placeholder'),
			line: 1,
			column: 1,
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	skipBasicChecks: true,
	syntax: 'scss',

	accept: [
		{
			code: ':#{$variable} {}',
		},
		{
			code: ':#{$VARIABLE} {}',
		},
		{
			code: 'a:#{$variable} {}',
		},
	],
});

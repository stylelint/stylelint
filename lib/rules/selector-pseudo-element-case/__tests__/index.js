'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['lower'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a:before { color: pink; }',
		},
		{
			code: 'a:after { color: pink; }',
		},
		{
			code: 'a:first-letter { color: pink; }',
		},
		{
			code: 'a:first-line { color: pink; }',
		},
		{
			code: "a:before, a[data-before='BEFORE'] { color: pink; }",
		},
		{
			code: 'a::before { color: pink; }',
		},
		{
			code: 'a::after { color: pink; }',
		},
		{
			code: 'a::first-letter { color: pink; }',
		},
		{
			code: 'a::first-line { color: pink; }',
		},
		{
			code: '::selection { }',
		},
		{
			code: 'a::spelling-error { color: pink; }',
		},
		{
			code: 'a::grammar-error { color: pink; }',
		},
		{
			code: 'li::marker { font-variant-numeric: tabular-nums; }',
		},
		{
			code: 'a::some-pseudo-element { }',
		},
		{
			code: 'p:first-child:before { }',
		},
		{
			code: 'h1:not(h2, h3) { }',
		},
		{
			code: 'h1:NOT(h2, h3) { }',
		},
		{
			code: 'a:focus { }',
		},
		{
			code: 'a:FOCUS { }',
		},
		{
			code: 'input::-moz-placeholder { color: pink; }',
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
		{
			code: 'html/*comment*/ { }',
		},
	],

	reject: [
		{
			code: 'a:Before { color: pink; }',
			fixed: 'a:before { color: pink; }',
			message: messages.expected(':Before', ':before'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:bEfOrE { color: pink; }',
			fixed: 'a:before { color: pink; }',
			message: messages.expected(':bEfOrE', ':before'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:BEFORE { color: pink; }',
			fixed: 'a:before { color: pink; }',
			message: messages.expected(':BEFORE', ':before'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:After { color: pink; }',
			fixed: 'a:after { color: pink; }',
			message: messages.expected(':After', ':after'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:First-letter { color: pink; }',
			fixed: 'a:first-letter { color: pink; }',
			message: messages.expected(':First-letter', ':first-letter'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:First-line { color: pink; }',
			fixed: 'a:first-line { color: pink; }',
			message: messages.expected(':First-line', ':first-line'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::Before { color: pink; }',
			fixed: 'a::before { color: pink; }',
			message: messages.expected('::Before', '::before'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::bEfOrE { color: pink; }',
			fixed: 'a::before { color: pink; }',
			message: messages.expected('::bEfOrE', '::before'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::BEFORE { color: pink; }',
			fixed: 'a::before { color: pink; }',
			message: messages.expected('::BEFORE', '::before'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::After { color: pink; }',
			fixed: 'a::after { color: pink; }',
			message: messages.expected('::After', '::after'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::First-letter { color: pink; }',
			fixed: 'a::first-letter { color: pink; }',
			message: messages.expected('::First-letter', '::first-letter'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::First-line { color: pink; }',
			fixed: 'a::first-line { color: pink; }',
			message: messages.expected('::First-line', '::first-line'),
			line: 1,
			column: 2,
		},
		{
			code: '::Selection { }',
			fixed: '::selection { }',
			message: messages.expected('::Selection', '::selection'),
			line: 1,
			column: 1,
		},
		{
			code: '::sElEcTiOn { }',
			fixed: '::selection { }',
			message: messages.expected('::sElEcTiOn', '::selection'),
			line: 1,
			column: 1,
		},
		{
			code: '::SELECTION { }',
			fixed: '::selection { }',
			message: messages.expected('::SELECTION', '::selection'),
			line: 1,
			column: 1,
		},
		{
			code: 'a::Spelling-error { color: pink; }',
			fixed: 'a::spelling-error { color: pink; }',
			message: messages.expected('::Spelling-error', '::spelling-error'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::Grammar-error { color: pink; }',
			fixed: 'a::grammar-error { color: pink; }',
			message: messages.expected('::Grammar-error', '::grammar-error'),
			line: 1,
			column: 2,
		},
		{
			code: 'li::Marker { font-variant-numeric: tabular-nums; }',
			fixed: 'li::marker { font-variant-numeric: tabular-nums; }',
			message: messages.expected('::Marker', '::marker'),
			line: 1,
			column: 3,
		},
		{
			code: 'a::Some-pseudo-element { }',
			fixed: 'a::some-pseudo-element { }',
			message: messages.expected('::Some-pseudo-element', '::some-pseudo-element'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::sOmE-pSeUdO-eLeMenT { }',
			fixed: 'a::some-pseudo-element { }',
			message: messages.expected('::sOmE-pSeUdO-eLeMenT', '::some-pseudo-element'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::SOME-PSEUDO-ELEMENT { }',
			fixed: 'a::some-pseudo-element { }',
			message: messages.expected('::SOME-PSEUDO-ELEMENT', '::some-pseudo-element'),
			line: 1,
			column: 2,
		},
		{
			code: 'p:first-child:Before { }',
			fixed: 'p:first-child:before { }',
			message: messages.expected(':Before', ':before'),
			line: 1,
			column: 14,
		},
		{
			code: 'p:First-child:Before { }',
			fixed: 'p:First-child:before { }',
			message: messages.expected(':Before', ':before'),
			line: 1,
			column: 14,
		},
		{
			code: 'p:first-child::Before { }',
			fixed: 'p:first-child::before { }',
			message: messages.expected('::Before', '::before'),
			line: 1,
			column: 14,
		},
		{
			code: 'p:First-child::Before { }',
			fixed: 'p:First-child::before { }',
			message: messages.expected('::Before', '::before'),
			line: 1,
			column: 14,
		},
		{
			code: 'input::-MOZ-PLACEHOLDER { color: pink; }',
			fixed: 'input::-moz-placeholder { color: pink; }',
			message: messages.expected('::-MOZ-PLACEHOLDER', '::-moz-placeholder'),
			line: 1,
			column: 6,
		},
		{
			code: 'a::bEfOrE/*comment*/ { color: pink; }',
			fixed: 'a::before/*comment*/ { color: pink; }',
			message: messages.expected('::bEfOrE', '::before'),
			line: 1,
			column: 2,
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
			code: '::#{$variable} {}',
		},
		{
			code: '::#{$VARIABLE} {}',
		},
		{
			code: 'a::#{$variable} {}',
		},
		{
			code: 'a::#{$variable}/*comment*/ {}',
		},
	],
});

testRule({
	ruleName,
	config: ['upper'],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a:BEFORE { color: pink; }',
		},
		{
			code: 'a:AFTER { color: pink; }',
		},
		{
			code: 'a:FIRST-LETTER { color: pink; }',
		},
		{
			code: 'a:FIRST-LINE { color: pink; }',
		},
		{
			code: "a:BEFORE, a[data-before='before'] { color: pink; }",
		},
		{
			code: 'a::BEFORE { color: pink; }',
		},
		{
			code: 'a::AFTER { color: pink; }',
		},
		{
			code: 'a::FIRST-LETTER { color: pink; }',
		},
		{
			code: 'a::FIRST-LINE { color: pink; }',
		},
		{
			code: '::SELECTION { }',
		},
		{
			code: 'a::SPELLING-ERROR { color: pink; }',
		},
		{
			code: 'a::GRAMMAR-ERROR { color: pink; }',
		},
		{
			code: 'li::MARKER { font-variant-numeric: tabular-nums; }',
		},
		{
			code: 'a::SOME-PSEUDO-ELEMENT { }',
		},
		{
			code: 'p:first-child:BEFORE { }',
		},
		{
			code: 'h1:not(h2, h3) { }',
		},
		{
			code: 'h1:NOT(h2, h3) { }',
		},
		{
			code: 'a:focus { }',
		},
		{
			code: 'a:FOCUS { }',
		},
		{
			code: 'input::-MOZ-PLACEHOLDER { color: pink; }',
		},
		{
			code: 'a:FOCUS/*comment*/ { }',
		},
	],

	reject: [
		{
			code: 'a:Before { color: pink; }',
			fixed: 'a:BEFORE { color: pink; }',
			message: messages.expected(':Before', ':BEFORE'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:bEfOrE { color: pink; }',
			fixed: 'a:BEFORE { color: pink; }',
			message: messages.expected(':bEfOrE', ':BEFORE'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:before { color: pink; }',
			fixed: 'a:BEFORE { color: pink; }',
			message: messages.expected(':before', ':BEFORE'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:After { color: pink; }',
			fixed: 'a:AFTER { color: pink; }',
			message: messages.expected(':After', ':AFTER'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:First-letter { color: pink; }',
			fixed: 'a:FIRST-LETTER { color: pink; }',
			message: messages.expected(':First-letter', ':FIRST-LETTER'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:First-line { color: pink; }',
			fixed: 'a:FIRST-LINE { color: pink; }',
			message: messages.expected(':First-line', ':FIRST-LINE'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::Before { color: pink; }',
			fixed: 'a::BEFORE { color: pink; }',
			message: messages.expected('::Before', '::BEFORE'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::bEfOrE { color: pink; }',
			fixed: 'a::BEFORE { color: pink; }',
			message: messages.expected('::bEfOrE', '::BEFORE'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::before { color: pink; }',
			fixed: 'a::BEFORE { color: pink; }',
			message: messages.expected('::before', '::BEFORE'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::After { color: pink; }',
			fixed: 'a::AFTER { color: pink; }',
			message: messages.expected('::After', '::AFTER'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::First-letter { color: pink; }',
			fixed: 'a::FIRST-LETTER { color: pink; }',
			message: messages.expected('::First-letter', '::FIRST-LETTER'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::First-line { color: pink; }',
			fixed: 'a::FIRST-LINE { color: pink; }',
			message: messages.expected('::First-line', '::FIRST-LINE'),
			line: 1,
			column: 2,
		},
		{
			code: '::Selection { }',
			fixed: '::SELECTION { }',
			message: messages.expected('::Selection', '::SELECTION'),
			line: 1,
			column: 1,
		},
		{
			code: '::sElEcTiOn { }',
			fixed: '::SELECTION { }',
			message: messages.expected('::sElEcTiOn', '::SELECTION'),
			line: 1,
			column: 1,
		},
		{
			code: '::selection { }',
			fixed: '::SELECTION { }',
			message: messages.expected('::selection', '::SELECTION'),
			line: 1,
			column: 1,
		},
		{
			code: 'a::Spelling-error { color: pink; }',
			fixed: 'a::SPELLING-ERROR { color: pink; }',
			message: messages.expected('::Spelling-error', '::SPELLING-ERROR'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::Grammar-error { color: pink; }',
			fixed: 'a::GRAMMAR-ERROR { color: pink; }',
			message: messages.expected('::Grammar-error', '::GRAMMAR-ERROR'),
			line: 1,
			column: 2,
		},
		{
			code: 'li::Marker { font-variant-numeric: tabular-nums; }',
			fixed: 'li::MARKER { font-variant-numeric: tabular-nums; }',
			message: messages.expected('::Marker', '::MARKER'),
			line: 1,
			column: 3,
		},
		{
			code: 'a::Some-pseudo-element { }',
			fixed: 'a::SOME-PSEUDO-ELEMENT { }',
			message: messages.expected('::Some-pseudo-element', '::SOME-PSEUDO-ELEMENT'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::sOmE-pSeUdO-eLeMenT { }',
			fixed: 'a::SOME-PSEUDO-ELEMENT { }',
			message: messages.expected('::sOmE-pSeUdO-eLeMenT', '::SOME-PSEUDO-ELEMENT'),
			line: 1,
			column: 2,
		},
		{
			code: 'a::some-pseudo-element { }',
			fixed: 'a::SOME-PSEUDO-ELEMENT { }',
			message: messages.expected('::some-pseudo-element', '::SOME-PSEUDO-ELEMENT'),
			line: 1,
			column: 2,
		},
		{
			code: 'p:first-child:Before { }',
			fixed: 'p:first-child:BEFORE { }',
			message: messages.expected(':Before', ':BEFORE'),
			line: 1,
			column: 14,
		},
		{
			code: 'p:First-child:Before { }',
			fixed: 'p:First-child:BEFORE { }',
			message: messages.expected(':Before', ':BEFORE'),
			line: 1,
			column: 14,
		},
		{
			code: 'p:first-child::Before { }',
			fixed: 'p:first-child::BEFORE { }',
			message: messages.expected('::Before', '::BEFORE'),
			line: 1,
			column: 14,
		},
		{
			code: 'p:First-child::Before { }',
			fixed: 'p:First-child::BEFORE { }',
			message: messages.expected('::Before', '::BEFORE'),
			line: 1,
			column: 14,
		},
		{
			code: 'input::-moz-placeholder { color: pink; }',
			fixed: 'input::-MOZ-PLACEHOLDER { color: pink; }',
			message: messages.expected('::-moz-placeholder', '::-MOZ-PLACEHOLDER'),
			line: 1,
			column: 6,
		},
		{
			code: '::Selection/*comment*/ { }',
			fixed: '::SELECTION/*comment*/ { }',
			message: messages.expected('::Selection', '::SELECTION'),
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
			code: '::#{$variable} {}',
		},
		{
			code: '::#{$VARIABLE} {}',
		},
		{
			code: 'a::#{$variable} {}',
		},
	],
});

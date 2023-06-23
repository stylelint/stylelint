'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a:hover { }',
		},
		{
			code: 'a:Hover { }',
		},
		{
			code: 'a:hOvEr { }',
		},
		{
			code: 'a:HOVER { }',
		},
		{
			code: 'a:focus-visible { }',
		},
		{
			code: 'a:before { }',
		},
		{
			code: 'a::before { }',
		},
		{
			code: ':modal { }',
		},
		{
			code: "input:not([type='submit']) { }",
		},
		{
			code: ':matches(section, article, aside, nav) h1 { }',
		},
		{
			code: 'a:has(> img) { }',
		},
		{
			code: 'section:has(h1, h2, h3, h4, h5, h6) { }',
		},
		{
			code: ':root { }',
		},
		{
			code: 'p:has(img):not(:has(:not(img))) { }',
		},
		{
			code: 'div.sidebar:has(*:nth-child(5)):not(:has(*:nth-child(6))) { }',
		},
		{
			code: 'div :nth-child(2 of .widget) { }',
		},
		{
			code: 'a:hover::before { }',
		},
		{
			code: 'a:-moz-placeholder { }',
		},
		{
			code: 'a,\nb > .foo:hover { }',
		},
		{
			code: ':--heading { }',
		},
		{
			code: '::-webkit-scrollbar-thumb:window-inactive { }',
		},
		{
			code: '::selection:window-inactive { }',
		},
		{
			code: '@page :first { }',
		},
		{
			code: '@page :blank:left { }',
		},
		{
			code: '@page foo:left { }',
		},
		{
			code: 'body:not(div):not(span) {}',
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
			code: '::-webkit-scrollbar-button:horizontal:decrement {}',
			description: 'webkit scrollbar multiple pseudo classes',
		},
		{
			code: '.test::-webkit-scrollbar-button:horizontal:decrement {}',
			description: 'non-standalone webkit scrollbar multiple pseudo classes',
		},
		{
			code: 'a:defined { }',
			description:
				'represents any element that has been defined; includes any standard element built into the browser, and custom elements that have been successfully defined (i.e. with the CustomElementRegistry.define() method).',
		},
		{
			code: '*:is(*) { }',
			description:
				'takes a selector list as its argument, and selects any element that can be selected by one of the selectors in that list',
		},
	],

	reject: [
		{
			code: 'a:unknown { }',
			message: messages.rejected(':unknown'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a:Unknown { }',
			message: messages.rejected(':Unknown'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a:uNkNoWn { }',
			message: messages.rejected(':uNkNoWn'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a:UNKNOWN { }',
			message: messages.rejected(':UNKNOWN'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a:pseudo-class { }',
			message: messages.rejected(':pseudo-class'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: 'body:not(div):noot(span) {}',
			message: messages.rejected(':noot'),
			line: 1,
			column: 14,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: 'a:unknown::before { }',
			message: messages.rejected(':unknown'),
			line: 1,
			column: 2,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: 'a,\nb > .foo:error { }',
			message: messages.rejected(':error'),
			line: 2,
			column: 9,
			endLine: 2,
			endColumn: 15,
		},
		{
			code: '::-webkit-scrollbar-button:horizontal:unknown {}',
			message: messages.rejected(':unknown'),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 46,
		},
		{
			code: ':first { }',
			message: messages.rejected(':first'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: ':slotted {}',
			message: messages.rejected(':slotted'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: ':placeholder {}',
			message: messages.rejected(':placeholder'),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: '@page :blank:unknown { }',
			message: messages.rejected(':unknown'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '@page foo:unknown { }',
			message: messages.rejected(':unknown'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: ':horizontal:decrement {}',
			warnings: [
				{
					message: messages.rejected(':horizontal'),
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
				},
				{
					message: messages.rejected(':decrement'),
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-scss',

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
		{
			code: '@directive ":foo";',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: 'a { &:extend(.extended); }',
		},
		{
			code: 'a { &:extend(.extended all); }',
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignorePseudoClasses: ['unknown', '/^my-/', /^YOUR-/i] }],

	accept: [
		{
			code: 'a:unknown { }',
		},
		{
			code: 'a:my-pseudo { }',
		},
		{
			code: 'a:YOUR-pseudo { }',
		},
		{
			code: 'a:your-pseudo { }',
		},
		{
			code: '@page :unknown { }',
		},
	],

	reject: [
		{
			code: 'a:uNkNoWn { }',
			message: messages.rejected(':uNkNoWn'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:UNKNOWN { }',
			message: messages.rejected(':UNKNOWN'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:MY-other-pseudo { }',
			message: messages.rejected(':MY-other-pseudo'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:pseudo-class { }',
			message: messages.rejected(':pseudo-class'),
			line: 1,
			column: 2,
		},
		{
			code: 'a:not-my-pseudo { }',
			message: messages.rejected(':not-my-pseudo'),
			line: 1,
			column: 2,
		},
		{
			code: '@page :not-my-pseudo { }',
			message: messages.rejected(':not-my-pseudo'),
			line: 1,
			column: 7,
		},
	],
});

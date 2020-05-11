'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,

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
				'represents any element that has been defined; includes any standard element built in to the browser, and custom elements that have been successfully defined (i.e. with the CustomElementRegistry.define() method).',
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
		},
		{
			code: 'a:Unknown { }',
			message: messages.rejected(':Unknown'),
			line: 1,
			column: 2,
		},
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
			code: 'a:pseudo-class { }',
			message: messages.rejected(':pseudo-class'),
			line: 1,
			column: 2,
		},
		{
			code: 'body:not(div):noot(span) {}',
			message: messages.rejected(':noot'),
			line: 1,
			column: 14,
		},
		{
			code: 'a:unknown::before { }',
			message: messages.rejected(':unknown'),
			line: 1,
			column: 2,
		},
		{
			code: 'a,\nb > .foo:error { }',
			message: messages.rejected(':error'),
			line: 2,
			column: 9,
		},
		{
			code: '::-webkit-unknown:window-inactive { }',
			message: messages.rejected(':window-inactive'),
			line: 1,
			column: 18,
		},
		{
			code: '::-webkit-scrollbar-button:horizontal:unknown {}',
			message: messages.rejected(':unknown'),
			line: 1,
			column: 38,
		},
		{
			code: ':first { }',
			message: messages.rejected(':first'),
			line: 1,
			column: 1,
		},
		{
			code: '@page :blank:unknown { }',
			message: messages.rejected(':unknown'),
			line: 1,
			column: 13,
		},
		{
			code: '@page foo:unknown { }',
			message: messages.rejected(':unknown'),
			line: 1,
			column: 10,
		},
		{
			code: ':horizontal:decrement {}',
			warnings: [
				{
					message: messages.rejected(':horizontal'),
					line: 1,
					column: 1,
				},
				{
					message: messages.rejected(':decrement'),
					line: 1,
					column: 12,
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: [true],
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
		{
			code: '@directive ":foo";',
		},
	],
});

testRule({
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'less',

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
	config: [true, { ignorePseudoClasses: ['unknown', '/^my-/', '/^YOUR-/i'] }],
	skipBasicChecks: true,

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

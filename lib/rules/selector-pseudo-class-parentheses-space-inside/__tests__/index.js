'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['always'],
	fix: true,

	accept: [
		{
			code: "input:not( [type='submit'] ) { }",
		},
		{
			code: "input:not( [type='submit'], [type='text'] ) { }",
		},
		{
			code: "input:not(  [type='submit'], [type='text']  ) { }",
		},
		{
			code: 'p:lang( it ) { }',
		},
		{
			code: 'section:not( :has( h1, h2 ) ) { }',
		},
		{
			code: "input:not( [type='radio'] ):not( [type='checkbox'] ) { }",
		},
		{
			code: 'a:hover:not( .active ) { }',
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
			code: 'a[b=#{c}] { }',
			description: 'ignore "invalid" selector (see #3130)',
		},
	],

	reject: [
		{
			code: "input:not([type='submit'] ) { }",
			fixed: "input:not( [type='submit'] ) { }",
			message: messages.expectedOpening,
			line: 1,
			column: 11,
		},
		{
			code: "input:not( [type='submit']) { }",
			fixed: "input:not( [type='submit'] ) { }",
			message: messages.expectedClosing,
			line: 1,
			column: 26,
		},
		{
			code: "input:not([type='submit'], [type='text'] ) { }",
			fixed: "input:not( [type='submit'], [type='text'] ) { }",
			message: messages.expectedOpening,
			line: 1,
			column: 11,
		},
		{
			code: "input:not( [type='submit'], [type='text']) { }",
			fixed: "input:not( [type='submit'], [type='text'] ) { }",
			message: messages.expectedClosing,
			line: 1,
			column: 41,
		},
		{
			code: "input:not(  [type='submit']) { }",
			fixed: "input:not(  [type='submit'] ) { }",
			message: messages.expectedClosing,
			line: 1,
			column: 27,
		},
		{
			code: 'section:not(:has( h1, h2 ) ) { }',
			fixed: 'section:not( :has( h1, h2 ) ) { }',
			message: messages.expectedOpening,
			line: 1,
			column: 13,
		},
		{
			code: 'section:not( :has( h1, h2 )) { }',
			fixed: 'section:not( :has( h1, h2 ) ) { }',
			message: messages.expectedClosing,
			line: 1,
			column: 27,
		},
		{
			code: 'section:not( :has(h1, h2 ) ) { }',
			fixed: 'section:not( :has( h1, h2 ) ) { }',
			message: messages.expectedOpening,
			line: 1,
			column: 19,
		},
		{
			code: ':matches( a, ul, :has(h1, h2 ) ) { }',
			fixed: ':matches( a, ul, :has( h1, h2 ) ) { }',
			message: messages.expectedOpening,
			line: 1,
			column: 23,
		},
		{
			code: 'section:not( :has( h1, h2) ) { }',
			fixed: 'section:not( :has( h1, h2 ) ) { }',
			message: messages.expectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: 'section:not(:has(h1, h2)) { }',
			fixed: 'section:not( :has( h1, h2 ) ) { }',
			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 13,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 24,
				},
				{
					message: messages.expectedOpening,
					line: 1,
					column: 18,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 23,
				},
			],
		},
		{
			code: "input:not([type='radio'] ):not( [type='checkbox'] ) { }",
			fixed: "input:not( [type='radio'] ):not( [type='checkbox'] ) { }",
			message: messages.expectedOpening,
			line: 1,
			column: 11,
		},
		{
			code: "input:not( [type='radio']):not( [type='checkbox'] ) { }",
			fixed: "input:not( [type='radio'] ):not( [type='checkbox'] ) { }",
			message: messages.expectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: "input:not( [type='radio'] ):not([type='checkbox'] ) { }",
			fixed: "input:not( [type='radio'] ):not( [type='checkbox'] ) { }",
			message: messages.expectedOpening,
			line: 1,
			column: 33,
		},
		{
			code: "input:not( [type='radio'] ):not( [type='checkbox']) { }",
			fixed: "input:not( [type='radio'] ):not( [type='checkbox'] ) { }",
			message: messages.expectedClosing,
			line: 1,
			column: 50,
		},
		{
			code: 'a:hover:not(.active ) { }',
			fixed: 'a:hover:not( .active ) { }',
			message: messages.expectedOpening,
			line: 1,
			column: 13,
		},
		{
			code: 'a:hover:not( .active) { }',
			fixed: 'a:hover:not( .active ) { }',
			message: messages.expectedClosing,
			line: 1,
			column: 20,
		},
		{
			code: 'section:not(/**/:has(/**/h1, h2/**/)/**/) { }',
			fixed: 'section:not( /**/:has( /**/h1, h2/**/ )/**/ ) { }',
			warnings: [
				{
					message: messages.expectedOpening,
					line: 1,
					column: 13,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 40,
				},
				{
					message: messages.expectedOpening,
					line: 1,
					column: 22,
				},
				{
					message: messages.expectedClosing,
					line: 1,
					column: 35,
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
			code: "input:not([type='submit']) { }",
		},
		{
			code: "input:not([type='submit'], [type='text']) { }",
		},
		{
			code: "input:not([type='submit'], [type='text']) { }",
		},
		{
			code: 'p:lang(it) { }',
		},
		{
			code: 'section:not(:has(h1, h2)) { }',
		},
		{
			code: "input:not([type='radio']):not([type='checkbox']) { }",
		},
		{
			code: 'a:hover:not(.active) { }',
		},
		{
			code: ':matches(a, ul, :has(h1, h2)) { }',
		},
	],

	reject: [
		{
			code: "input:not([type='submit'] ) { }",
			fixed: "input:not([type='submit']) { }",
			message: messages.rejectedClosing,
			line: 1,
			column: 26,
		},
		{
			code: "input:not( [type='submit']) { }",
			fixed: "input:not([type='submit']) { }",
			message: messages.rejectedOpening,
			line: 1,
			column: 11,
		},
		{
			code: "input:not([type='submit'], [type='text'] ) { }",
			fixed: "input:not([type='submit'], [type='text']) { }",
			message: messages.rejectedClosing,
			line: 1,
			column: 41,
		},
		{
			code: "input:not( [type='submit'], [type='text']) { }",
			fixed: "input:not([type='submit'], [type='text']) { }",
			message: messages.rejectedOpening,
			line: 1,
			column: 11,
		},
		{
			code: "input:not(  [type='submit']) { }",
			fixed: "input:not([type='submit']) { }",
			message: messages.rejectedOpening,
			line: 1,
			column: 11,
		},
		{
			code: 'section:not( :has(h1, h2)) { }',
			fixed: 'section:not(:has(h1, h2)) { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 13,
		},
		{
			code: 'section:not(:has( h1, h2)) { }',
			fixed: 'section:not(:has(h1, h2)) { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 18,
		},
		{
			code: 'section:not(:has(h1, h2) ) { }',
			fixed: 'section:not(:has(h1, h2)) { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: 'section:not(:has(h1, h2 )) { }',
			fixed: 'section:not(:has(h1, h2)) { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 24,
		},
		{
			code: 'section:not( :has( h1, h2 ) ) { }',
			fixed: 'section:not(:has(h1, h2)) { }',
			warnings: [
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 13,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 28,
				},
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 19,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 26,
				},
			],
		},
		{
			code: "input:not( [type='radio']):not([type='checkbox']) { }",
			fixed: "input:not([type='radio']):not([type='checkbox']) { }",
			message: messages.rejectedOpening,
			line: 1,
			column: 11,
		},
		{
			code: "input:not([type='radio'] ):not([type='checkbox']) { }",
			fixed: "input:not([type='radio']):not([type='checkbox']) { }",
			message: messages.rejectedClosing,
			line: 1,
			column: 25,
		},
		{
			code: "input:not([type='radio']):not( [type='checkbox']) { }",
			fixed: "input:not([type='radio']):not([type='checkbox']) { }",
			message: messages.rejectedOpening,
			line: 1,
			column: 31,
		},
		{
			code: "input:not([type='radio']):not([type='checkbox'] ) { }",
			fixed: "input:not([type='radio']):not([type='checkbox']) { }",
			message: messages.rejectedClosing,
			line: 1,
			column: 48,
		},
		{
			code: 'a:hover:not( .active) { }',
			fixed: 'a:hover:not(.active) { }',
			message: messages.rejectedOpening,
			line: 1,
			column: 13,
		},
		{
			code: 'a:hover:not(.active ) { }',
			fixed: 'a:hover:not(.active) { }',
			message: messages.rejectedClosing,
			line: 1,
			column: 20,
		},
		{
			skip: true,
			code: 'section:not( /**/ :has( /**/ h1, h2 /**/ ) /**/ ) { }',
			fixed: 'section:not(/**/ :has(/**/ h1, h2 /**/) /**/) { }',
			warnings: [
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 13,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 48,
				},
				{
					message: messages.rejectedOpening,
					line: 1,
					column: 24,
				},
				{
					message: messages.rejectedClosing,
					line: 1,
					column: 41,
				},
			],
		},
	],
});

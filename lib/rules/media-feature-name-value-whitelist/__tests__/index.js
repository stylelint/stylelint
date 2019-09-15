'use strict';

const rule = require('..');
const { messages, ruleName } = rule;

testRule(rule, {
	ruleName,
	config: [
		{
			'min-width': ['768px', '$sm'],
			'/resolution/': ['/dpcm$/'], // Only dpcm unit
			color: [], // Test boolean context
			width: [], // Test range context
		},
	],

	accept: [
		{
			code: '@media screen and (min-width: 768px) {}',
			description: 'Specified media feature',
		},
		{
			code: '@media screen and  (   min-width  :   768px ) {}',
			description: 'Whitespace',
		},
		{
			code: '@media screen and (max-width: 1000px) {}',
			description: 'Unspecified media feature',
		},
		{
			code: '@media screen and ( min-resolution :  2dpcm ) {}',
			description: 'Regex feature name and Regex value',
		},
		{
			code: '@media screen and (resolution: 10.1dpcm) {}',
			description: 'Floating point value',
		},
		{
			code: '@media screen and (min-width: $sm) {}',
			description: 'Non-standard syntax in whitelist',
		},
		{
			code: '@media (color) {}',
			description: 'Boolean context, media feature in whitelist',
		},
		{
			code: '@media (update) {}',
			description: 'Boolean context, media feature NOT in whitelist',
		},
		{
			code: '@media (update /* pw:ned */) {}',
			description: 'Boolean context with colon in comments',
		},
		{
			code: '@media screen and (width <= 768px) {}',
			description: 'Range context, media feature in whitelist',
		},
		{
			code: '@media screen and (height <= 768px) {}',
			description: 'Range context, media feature NOT in whitelist',
		},
	],

	reject: [
		{
			code: '@media screen and (min-width: 1000px) {}',
			message: messages.rejected('min-width', '1000px'),
			line: 1,
			column: 31,
		},
		{
			code: '@media screen (min-width: 768px) and (min-width: 1000px) {}',
			description: 'Media feature multiple',
			message: messages.rejected('min-width', '1000px'),
			line: 1,
			column: 50,
		},
		{
			code: '@media screen (min-width: 768px)\nand (min-width: 1000px) {}',
			description: 'Media feature multiline',
			message: messages.rejected('min-width', '1000px'),
			line: 2,
			column: 17,
		},
		{
			code: '@media screen and (min-width: 768PX) {}',
			description: 'Case sensitive',
			message: messages.rejected('min-width', '768PX'),
			line: 1,
			column: 31,
		},
		{
			code: '@media screen and (min-width: $md) {}',
			description: 'Non-standard syntax NOT in whitelist',
			message: messages.rejected('min-width', '$md'),
			line: 1,
			column: 31,
		},
		{
			code: '@media screen and (min-resolution:  2dpi) {}',
			message: messages.rejected('min-resolution', '2dpi'),
			line: 1,
			column: 37,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		{
			'/resolution/': [/dpcm$/], // Only dpcm unit
		},
	],

	accept: [
		{
			code: '@media screen and (min-width: 768px) {}',
			description: 'Specified media feature',
		},
		{
			code: '@media screen and ( min-resolution :  2dpcm ) {}',
			description: 'Regex feature name and Regex value',
		},
		{
			code: '@media screen and (resolution: 10.1dpcm) {}',
			description: 'Floating point value',
		},
	],

	reject: [
		{
			code: '@media screen and (min-resolution:  2dpi) {}',
			message: messages.rejected('min-resolution', '2dpi'),
			line: 1,
			column: 37,
		},
	],
});

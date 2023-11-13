import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: [
		{
			'min-width': ['768px'],
			'/resolution/': '/dpcm$/', // Only dpcm unit
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
			code: '@media screen and (-webkit-resolution: 10.1dpcm) {}',
			description: 'Prefixed media feature',
		},
		{
			code: '@media (color) {}',
			description: 'Boolean context, media feature in allowed list',
		},
		{
			code: '@media (update) {}',
			description: 'Boolean context, media feature NOT in allowed list',
		},
		{
			code: '@media (update /* pw:need */) {}',
			description: 'Boolean context with colon in comments',
		},
		{
			code: '@media screen and (min-width <= 768px) {}',
			description: 'Range context, media feature in allowed list',
		},
	],

	reject: [
		{
			code: '@media screen and (min-width: 1000px) {}',
			message: messages.rejected('min-width', '1000px'),
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: '@media screen and (min-width: 768px) and (min-width: 1000px) {}',
			description: 'Media feature multiple',
			message: messages.rejected('min-width', '1000px'),
			line: 1,
			column: 54,
			endLine: 1,
			endColumn: 60,
		},
		{
			code: '@media screen and (min-width: 768px)\nand (min-width: 1000px) {}',
			description: 'Media feature multiline',
			message: messages.rejected('min-width', '1000px'),
			line: 2,
			column: 17,
			endLine: 2,
			endColumn: 23,
		},
		{
			code: '@media screen and (min-width: 768PX) {}',
			description: 'Case sensitive',
			message: messages.rejected('min-width', '768PX'),
			line: 1,
			column: 31,
			endLine: 1,
			endColumn: 36,
		},
		{
			code: '@media screen and (min-resolution:  2dpi) {}',
			message: messages.rejected('min-resolution', '2dpi'),
			line: 1,
			column: 37,
			endLine: 1,
			endColumn: 41,
		},
		{
			code: '@media screen and (-webkit-min-resolution:  2dpi) {}',
			message: messages.rejected('-webkit-min-resolution', '2dpi'),
			line: 1,
			column: 45,
			endLine: 1,
			endColumn: 49,
		},
		{
			code: '@media screen and (min-width > 500px) {}',
			message: messages.rejected('min-width', '500px'),
			line: 1,
			column: 32,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: '@media screen and (400px < min-width) {}',
			message: messages.rejected('min-width', '400px'),
			line: 1,
			column: 20,
			endLine: 1,
			endColumn: 25,
		},
		{
			code: '@media (400px < min-width < 500px) and (min-width < 1200px)',
			warnings: [
				{
					message: messages.rejected('min-width', '400px'),
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 14,
				},
				{
					message: messages.rejected('min-width', '500px'),
					line: 1,
					column: 29,
					endLine: 1,
					endColumn: 34,
				},
				{
					message: messages.rejected('min-width', '1200px'),
					line: 1,
					column: 53,
					endLine: 1,
					endColumn: 59,
				},
			],
		},
	],
});

testRule({
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
			endLine: 1,
			endColumn: 41,
		},
		{
			code: '@media screen and (min-resolution >  2dpi) {}',
			message: messages.rejected('min-resolution', '2dpi'),
			line: 1,
			column: 38,
			endLine: 1,
			endColumn: 42,
		},
	],
});

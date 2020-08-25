'use strict';

const standalone = require('../../../standalone');
const { messages, ruleName } = require('..');

it('warns that the rule is deprecated', () => {
	const config = {
		rules: {
			[ruleName]: [{ color: [] }],
		},
	};

	const code = '';

	return standalone({ code, config }).then((output) => {
		const result = output.results[0];

		expect(result.deprecations).toHaveLength(1);
		expect(result.deprecations[0].text).toEqual(
			`'${ruleName}' has been deprecated. Instead use 'media-feature-name-value-allowed-list'.`,
		);
		expect(result.deprecations[0].reference).toEqual(
			`https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
		);
	});
});

testRule({
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
			description: 'Non-standard syntax in allowed list',
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
			code: '@media (update /* pw:ned */) {}',
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
			description: 'Non-standard syntax NOT in allowed list',
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
		{
			code: '@media screen and (min-width > 500px) {}',
			message: messages.rejected('min-width', '500px'),
			line: 1,
			column: 32,
		},
		{
			code: '@media screen and (400px < min-width) {}',
			message: messages.rejected('min-width', '400px'),
			line: 1,
			column: 20,
		},
		{
			code: '@media (400px < min-width < 500px) and (min-width < 1200px)',
			warnings: [
				{
					message: messages.rejected('min-width', '400px'),
					line: 1,
					column: 9,
				},
				{
					message: messages.rejected('min-width', '500px'),
					line: 1,
					column: 29,
				},
				{
					message: messages.rejected('min-width', '1200px'),
					line: 1,
					column: 53,
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
		},
		{
			code: '@media screen and (min-resolution >  2dpi) {}',
			message: messages.rejected('min-resolution', '2dpi'),
			line: 1,
			column: 38,
		},
	],
});

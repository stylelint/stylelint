'use strict';

// https://prettier.io/docs/en/options.html
module.exports = {
	arrowParens: 'always',
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		{
			files: ['package.json', '*.md'],
			options: {
				printWidth: 80,
				singleQuote: false,
				tabWidth: 2,
				trailingComma: 'none',
				useTabs: false,
			},
		},
	],
};

'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: 'a { --custom-property: 1 }',
		},
		{
			code: 'a { --custom-property: 1; --cUstOm-prOpErtY: 1 }',
		},
		{
			code: 'a { --custom-property: 1; color: pink; --cUstOm-prOpErtY: 1 }',
		},
		{
			code: 'a { color: var(--custom-property, --custom-property) }',
		},
		{
			code: 'a { --custom-property: pink; @media { --custom-property: orange; } }',
			description: 'nested',
		},
		{
			code:
				'a { --custom-property: pink; @media { --custom-property: orange; &::before { --custom-property: black; } } }',
			description: 'double nested',
		},
		{
			code:
				'a { --custom-property: pink; { &:hover { --custom-property: orange; --cUstOm-prOpErtY: black; } } }',
			description: 'spec nested',
		},
		{
			code:
				'a { --cUstOm-prOpErtY: pink; { &:hover { --custom-property: orange; --cUstOm-prOpErtY: black; } } }',
			description: 'spec nested',
		},
	],

	reject: [
		{
			code: 'a { --custom-property: 1; --custom-property: 2; }',
			message: messages.rejected('--custom-property'),
		},
		{
			code: 'a { --custom-property: 1; color: pink; --custom-property: 1; }',
			message: messages.rejected('--custom-property'),
		},
		{
			code: 'a { --custom-property: 1; --cUstOm-prOpErtY: 1; color: pink; --cUstOm-prOpErtY: 1; }',
			message: messages.rejected('--cUstOm-prOpErtY'),
		},
		{
			code:
				'a { --custom-property: pink; { &:hover { --custom-property: orange; --custom-property: black; } } }',
			description: 'spec nested',
			message: messages.rejected('--custom-property'),
		},
		{
			code:
				'a { --custom-property: pink; @media { --custom-property: orange; --custom-property: black; } }',
			description: 'nested',
			message: messages.rejected('--custom-property'),
		},
		{
			code:
				'@media { --custom-property: orange; .foo { --custom-property: black; --custom-property: white; } }',
			description: 'nested',
			message: messages.rejected('--custom-property'),
		},
		{
			code:
				'a { --custom-property: pink; @media { --custom-property: orange; &::before { --custom-property: black; --custom-property: white; } } }',
			description: 'double nested',
			message: messages.rejected('--custom-property'),
		},
		{
			code:
				'a { --custom-property: pink; @media { --custom-property: orange; .foo { --custom-property: black; --custom-property: white; } } }',
			description: 'double nested again',
			message: messages.rejected('--custom-property'),
		},
	],
});

testRule({
	skip: true,
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'html',

	accept: [
		{
			code: '<style>a { --custom-property: pink; }</style>',
		},
		{
			code: '<a style="--custom-property: pink;"></a>',
		},
		{
			code:
				'<style>a { --custom-property: pink; }</style><style>a { --custom-property: pink; }</style>',
		},
		{
			code: '<a style="--custom-property: pink;"></a><a style="--custom-property: pink;"></a>',
		},
		{
			code:
				'<a style="--custom-property: pink; --cUstOm-prOpErtY: pink;"></a><a style="--custom-property: pink;"></a>',
		},
	],

	reject: [
		{
			code: '<a style="--custom-property: pink; --custom-property: orange"></a>',
			message: messages.rejected('--custom-property'),
		},
		{
			code:
				'<style>p { color: pink; --custom-property: orange; --custom-property: white; }</style>',
			message: messages.rejected('--custom-property'),
		},
		{
			code: '<a style="--custom-property: orange; color: pink; --custom-property: white;"></a>',
			message: messages.rejected('--custom-property'),
		},
		{
			code:
				'<a style="--cUstOm-prOpErtY: orange; color: pink; --custom-property: white; --cUstOm-prOpErtY: black;"></a>',
			message: messages.rejected('--cUstOm-prOpErtY'),
		},
	],
});

testRule({
	skip: true,
	ruleName,
	config: [true],
	skipBasicChecks: true,
	syntax: 'css-in-js',

	accept: [
		{
			code:
				"import styled from 'react-emotion'\nexport default styled.div` --custom-property: pink; `;",
		},
		{
			code:
				"import styled from 'react-emotion'\nexport default styled.div` --custom-property: pink; --cUstOm-prOpErtY: pink; `;",
		},
	],
	reject: [
		{
			code:
				"import styled from 'styled-components';\nexport default styled.div` --custom-property: pink; --custom-property: orange; `;",
			message: messages.rejected('--custom-property'),
		},
		{
			code:
				"import styled from 'react-emotion'\nexport default styled.div` --custom-property: pink; --custom-property: orange; `;",
			message: messages.rejected('--custom-property'),
		},
	],
});

import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,
	config: ['always'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '[title] { }',
		},
		{
			code: 'a[target="_blank"] { }',
		},
		{
			code: 'a[ target="_blank" ] { }',
		},
		{
			code: '[class|="top"] { }',
		},
		{
			code: '[class |= "top"] { }',
		},
		{
			code: "[title~='text'] { }",
		},
		{
			code: "[data-attribute='component'] { }",
		},
		{
			code: '[frame="hsides" i] { }',
		},
		{
			code: "[frame='hsides' i] { }",
		},
		{
			code: "[data-style='value'][data-loading] { }",
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
			code: `a[href="te's't"] { }`,
			description: 'double-quoted attribute contains single quote',
		},
		{
			code: `a[href='te"s"t'] { }`,
			description: 'single-quoted attribute contains double quote',
		},
		{
			code: stripIndent`
                /* stylelint-disable-next-line selector-attribute-quotes */
                a[title=flower], /* stylelint-disable-next-line selector-attribute-quotes */
                a[class^=top],
                /* stylelint-disable-next-line selector-attribute-quotes */
                a[title~=text]
                { }
            `,
		},
	],

	reject: [
		{
			code: 'a[title=flower] { }',
			fixed: 'a[title="flower"] { }',
			message: messages.expected('flower'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 15,
			fix: { range: [8, 14], text: '"flower"' },
		},
		{
			code: 'a[ title=flower ] { }',
			fixed: 'a[ title="flower" ] { }',
			message: messages.expected('flower'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 16,
			fix: { range: [9, 15], text: '"flower"' },
		},
		{
			code: '[class^=top] { }',
			fixed: '[class^="top"] { }',
			message: messages.expected('top'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 12,
			fix: { range: [8, 11], text: '"top"' },
		},
		{
			code: '[class ^= top] { }',
			fixed: '[class ^= "top"] { }',
			message: messages.expected('top'),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 14,
			fix: { range: [10, 13], text: '"top"' },
		},
		{
			code: '[frame=hsides i] { }',
			fixed: '[frame="hsides" i] { }',
			message: messages.expected('hsides'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 14,
			fix: { range: [7, 13], text: '"hsides"' },
		},
		{
			code: '[data-style=value][data-loading] { }',
			fixed: '[data-style="value"][data-loading] { }',
			message: messages.expected('value'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 18,
			fix: { range: [12, 17], text: '"value"' },
		},
		{
			code: `[href=te\\'s\\"t] { }`,
			fixed: `[href="te's\\"t"] { }`,
			message: messages.expected(`te's"t`),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 15,
			fix: { range: [6, 14], text: `"te's\\"t"` },
		},
		{
			code: '[href=\\"test\\"] { }',
			fixed: '[href="\\"test\\""] { }',
			message: messages.expected('"test"'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 15,
			fix: { range: [6, 13], text: '"\\"test\\"' },
		},
		{
			code: "[href=\\'test\\'] { }",
			fixed: `[href="'test'"] { }`,
			message: messages.expected("'test'"),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 15,
			fix: { range: [6, 14], text: `"'test'"` },
		},
		{
			code: stripIndent`
                /* a comment */
                a[title=flower], /* a comment */
                a[class^=top],
                /* a comment */
                a[title~=text]
                { }
            `,
			fixed: stripIndent`
                /* a comment */
                a[title="flower"], /* a comment */
                a[class^="top"],
                /* a comment */
                a[title~="text"]
                { }
            `,
			warnings: [
				{
					column: 9,
					endColumn: 15,
					endLine: 2,
					line: 2,
					message: messages.expected('flower'),
					fix: { range: [24, 30], text: '"flower"' },
				},
				{
					column: 10,
					endColumn: 13,
					endLine: 3,
					line: 3,
					message: messages.expected('top'),
				},
				{
					column: 10,
					endColumn: 14,
					endLine: 5,
					line: 5,
					message: messages.expected('text'),
				},
			],
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	fix: true,
	computeEditInfo: true,

	accept: [
		{
			code: '[title] { }',
		},
		{
			code: '[title=flower] { }',
		},
		{
			code: '[class^=top] { }',
		},
		{
			code: '[frame=hsides i] { }',
		},
		{
			code: '[data-style=value][data-loading] { }',
		},
		{
			code: `a[href=te\\'s\\"t] { }`,
			description: 'attribute contains inner quotes',
		},
		{
			code: '[href=\\"test\\"] { }',
			description: 'escaped double-quotes are not considered as framing quotes',
		},
		{
			code: "[href=\\'test\\'] { }",
			description: 'escaped single-quotes are not considered as framing quotes',
		},
		{
			code: `[href="te'st"] { }`,
			description: 'removing quotes would produce invalid CSS', // see: https://github.com/stylelint/stylelint/issues/4300
		},
		{
			code: `[href='te"st'] { }`,
			description: 'removing quotes would produce invalid CSS', // see: https://github.com/stylelint/stylelint/issues/4300
		},
	],

	reject: [
		{
			code: 'a[target="_blank"] { }',
			fixed: 'a[target=_blank] { }',
			message: messages.rejected('_blank'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 18,
			fix: { range: [9, 17], text: '_blank' },
		},
		{
			code: 'a[ target="_blank" ] { }',
			fixed: 'a[ target=_blank ] { }',
			message: messages.rejected('_blank'),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 19,
			fix: { range: [10, 18], text: '_blank' },
		},
		{
			code: '[class|="top"] { }',
			fixed: '[class|=top] { }',
			message: messages.rejected('top'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 14,
			fix: { range: [8, 13], text: 'top' },
		},
		{
			code: '[class |= "top"] { }',
			fixed: '[class |= top] { }',
			message: messages.rejected('top'),
			line: 1,
			column: 11,
			endLine: 1,
			endColumn: 16,
			fix: { range: [10, 15], text: 'top' },
		},
		{
			code: "[title~='text'] { }",
			fixed: '[title~=text] { }',
			message: messages.rejected('text'),
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 15,
			fix: { range: [8, 14], text: 'text' },
		},
		{
			code: "[data-attribute='component'] { }",
			fixed: '[data-attribute=component] { }',
			message: messages.rejected('component'),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 28,
			fix: { range: [16, 27], text: 'component' },
		},
		{
			code: '[frame="hsides" i] { }',
			fixed: '[frame=hsides i] { }',
			message: messages.rejected('hsides'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 16,
			fix: { range: [7, 15], text: 'hsides' },
		},
		{
			code: "[frame='hsides' i] { }",
			fixed: '[frame=hsides i] { }',
			message: messages.rejected('hsides'),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 16,
			fix: { range: [7, 15], text: 'hsides' },
		},
		{
			code: "[data-style='value'][data-loading] { }",
			fixed: '[data-style=value][data-loading] { }',
			message: messages.rejected('value'),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 20,
			fix: { range: [12, 19], text: 'value' },
		},
		{
			code: "[href='te\\'s\\'t'] { }",
			fixed: "[href=te\\'s\\'t] { }",
			message: messages.rejected("te's't"),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 17,
			fix: { range: [6, 16], text: "te\\'s\\'t" },
		},
		{
			code: '[href="te\\"s\\"t"] { }',
			fixed: '[href=te\\"s\\"t] { }',
			message: messages.rejected('te"s"t'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 17,
			fix: { range: [6, 16], text: 'te\\"s\\"t' },
		},
		{
			code: 'a[target="_blank"], /* comment */ a { }',
			fixed: 'a[target=_blank], /* comment */ a { }',
			message: messages.rejected('_blank'),
			line: 1,
			column: 10,
			endLine: 1,
			endColumn: 18,
			fix: { range: [9, 17], text: '_blank' },
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '[class="#{$variable}"] { }',
		},
		{
			code: "[data-attribute^='#{$variable}'] { }",
		},
		{
			code: '[class=#{$variable}] { } { }',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '[class=#{$variable}] { }',
		},
		{
			code: '[data-attribute^=#{$variable}] { }',
		},
		{
			code: '[class="#{$variable}"] { }',
		},
	],
});

testRule({
	ruleName,
	config: ['always'],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '[class="@{variable}"] { }',
		},
		{
			code: "[data-attribute^='@{variable}'] { }",
		},
		{
			code: '[class=@{variable}] { }',
		},
	],
});

testRule({
	ruleName,
	config: ['never'],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '[class=@{variable}] { }',
		},
		{
			code: '[data-attribute^=@{variable}] { }',
		},
		{
			code: '[class="@{variable}"] { }',
		},
	],
});

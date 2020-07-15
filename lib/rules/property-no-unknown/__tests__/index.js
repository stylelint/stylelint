'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '.foo { color: green; }',
		},
		{
			code: '.foo { COLoR: green; }',
		},
		{
			code: '.foo { fill: black; }',
		},
		{
			code: '.foo { -webkit-align-self: center; }',
		},
		{
			code: '.foo { align-self: center; }',
		},
		{
			code: '.foo { --bg-color: white; }',
			description: 'ignore standard CSS variables',
		},
		{
			code: '.foo { -moz-align-self: center; }',
			description: 'ignore vendor prefixes',
		},
		{
			code: '.foo { *width: 100px; }',
			description: 'ignore CSS hacks',
		},
	],

	reject: [
		{
			code: '.foo { colr: blue; }',
			message: messages.rejected('colr'),
			line: 1,
			column: 8,
		},
		{
			code: '.foo { COLR: blue; }',
			message: messages.rejected('COLR'),
			line: 1,
			column: 8,
		},
		{
			code: '.foo {\n  colr: blue;\n}',
			message: messages.rejected('colr'),
			line: 2,
			column: 3,
		},
		{
			code: '.foo { *wdth: 100px; }',
			message: messages.rejected('wdth'),
			line: 1,
			column: 8,
		},
		{
			code: '.foo { --custom-property-set: { colr: blue; } }',
			message: messages.rejected('colr'),
			line: 1,
			column: 33,
		},
		{
			code: ':export { my-property: red; }',
			message: messages.rejected('my-property'),
			line: 1,
			column: 11,
		},
	],
});

testRule({
	ruleName,
	syntax: 'scss',
	config: [true],

	accept: [
		{
			code: '.foo { $bgColor: white; }',
			description: 'ignore SCSS variables',
		},
		{
			code: '.foo { namespace.$bgColor: white; }',
			description: 'ignore SCSS variables within namespace',
		},
		{
			code: '.foo { #{$prop}: black; }',
			description: 'ignore property interpolation',
		},
		{
			code: '.foo { border: { style: solid; } }',
			description: 'ignore nested properties',
		},
	],
});

testRule({
	ruleName,
	syntax: 'less',
	config: [true],

	accept: [
		{
			code: '.foo { @bgColor: white; }',
			description: 'ignore LESS variables',
		},
		{
			code: '.foo { @{prop}: black; }',
			description: 'ignore property interpolation',
		},
		{
			code: '.foo { transform+: rotate(15deg); }',
			description: 'Append property value with space usign +',
		},
		{
			code: '.foo { transform+_: rotate(15deg); }',
			description: 'Append property value with space using +_',
		},
	],
});

testRule({
	ruleName,
	config: [
		true,
		{
			ignoreProperties: ['-moz-overflow-scrolling', '/^my-/'],
			checkPrefixed: true,
		},
	],

	accept: [
		{
			code: '.foo { -webkit-overflow-scrolling: auto; }',
		},
		{
			code: '.foo { -moz-overflow-scrolling: auto; }',
		},
		{
			code: '.foo { my-property: 1; }',
		},
		{
			code: '.foo { my-other-property: 1; }',
		},
	],

	reject: [
		{
			code: '.foo { overflow-scrolling: auto; }',
			message: messages.rejected('overflow-scrolling'),
			line: 1,
			column: 8,
		},
		{
			code: '.foo { not-my-property: 1; }',
			message: messages.rejected('not-my-property'),
			line: 1,
			column: 8,
		},
	],
});

testRule({
	ruleName,
	config: [
		true,
		{
			ignoreProperties: [/^my-/],
			checkPrefixed: true,
		},
	],

	accept: [
		{
			code: '.foo { my-property: 1; }',
		},
	],

	reject: [
		{
			code: '.foo { not-my-property: 1; }',
			message: messages.rejected('not-my-property'),
			line: 1,
			column: 8,
		},
	],
});

testRule({
	ruleName,
	config: [true, { checkPrefixed: true }],

	accept: [
		{
			code: '.foo { -webkit-overflow-scrolling: auto; }',
		},
		{
			code: '.foo { -moz-box-flex: 0; }',
		},
	],

	reject: [
		{
			code: '.foo { -moz-overflow-scrolling: auto; }',
			message: messages.rejected('-moz-overflow-scrolling'),
			line: 1,
			column: 8,
		},
		{
			code: '.foo { -moz-align-self: center; }',
			message: messages.rejected('-moz-align-self'),
			line: 1,
			column: 8,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreSelectors: [':export', ':import'] }],

	accept: [
		{
			code: ':export { my-property: 1; }',
		},
	],

	reject: [
		{
			code: ':not-export { my-property: 1; }',
			message: messages.rejected('my-property'),
			line: 1,
			column: 15,
		},
		{
			// Non-regex strings must exactly match the parent selector.
			code: ':import("path/to/file.css") { my-property: 1; }',
			message: messages.rejected('my-property'),
			line: 1,
			column: 31,
		},
	],
});

testRule({
	ruleName,
	config: [true, { ignoreSelectors: ['/:export/', /^:import/] }],

	accept: [
		{
			code: ':export { my-property: 1; }',
		},
		{
			code: ':import("path/to/file.css") { my-property: 1; }',
		},
	],

	reject: [
		{
			code: ':exprat { my-property: 1; }',
			message: messages.rejected('my-property'),
			line: 1,
			column: 11,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'css-in-js',

	accept: [
		{
			code:
				"import styled from 'styled-components';\nexport default styled.div` ${/* sc-prop */ something}: papayawhip; `;",
		},
		{
			code:
				"import styled from 'styled-components';\nexport default styled.div` margin-${/* sc-custom 'left' */ rtlSwitch}: 12.5px; `;",
		},
		{
			code: 'const Component = styled.a`\n\t${rule}: 1;\n`',
		},
		{
			code: `
        import glm from 'glamorous';
        const Component = glm.a({
            overflowX: 'auto',
            overflowWrap: 'auto',
            flexDirection: 'row',
        });
      `,
		},
	],

	reject: [
		{
			code:
				"import styled from 'styled-components';\nexport default styled.div` .foo { colr: blue; } `;",
			message: messages.rejected('colr'),
			line: 2,
			column: 35,
		},
		{
			code: 'const Component = styled.a`\n\trule: 1;\n`',
			message: messages.rejected('rule'),
			line: 2,
			column: 2,
		},
		{
			code: 'const Component = styled.a`\n\trule: ${1};\n`',
			message: messages.rejected('rule'),
			line: 2,
			column: 2,
		},
		{
			code: `
        import glm from 'glamorous';
        const Component = glm.a({
            overflwX: 'auto',
        });
      `,
			message: messages.rejected('overflw-x'),
			line: 4,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'html',
	accept: [
		{
			code: '<a style="{{rule}}: 1">',
		},
	],

	reject: [
		{
			code: '<a style="rule: 1">',
			message: messages.rejected('rule'),
			line: 1,
			column: 11,
		},
		{
			code: '<a style="rule: {{1}}">',
			message: messages.rejected('rule'),
			line: 1,
			column: 11,
		},
	],
});

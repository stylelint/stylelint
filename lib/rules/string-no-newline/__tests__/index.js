'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: "a::before { content: 'one'; }",
			description: 'without newline',
		},
		{
			code: "a::before { content: 'one\\ntwo'; }",
			description: 'with escaped slash-slash-n newline',
		},
		{
			code: "a::before { content: 'one\\Atwo'; }",
			description: 'with escaped slash-A newline',
		},
		{
			code: `a::before {
      content: 'one\
      two';
    }`,

			description: 'with escaped slash at end of real line',
		},
		{
			code: `p[href^="https://"]:before {
      top: 0;
    }`,

			description: 'attribute containing double-slash',
		},
	],

	reject: [
		{
			code: "a::before { content: 'one\ntwo'; }",
			description: 'content LF',
			message: messages.rejected,
			line: 1,
			column: 26,
		},
		{
			code: "a::before { content: 'one\r\ntwo'; }",
			description: 'content CRLF',
			message: messages.rejected,
			line: 1,
			column: 26,
		},
		{
			code: "a[href^='one\r\ntwo'] { display: block; }",
			description: 'attribute CRLF',
			message: messages.rejected,
			line: 1,
			column: 12,
		},
		{
			code: "@charset 'utf-8\n';",
			description: 'atRule CRLF',
			message: messages.rejected,
			line: 1,
			column: 16,
		},
	],
});

testRule({
	ruleName,
	config: [],
	syntax: 'scss',
	skipBasicChecks: true,

	accept: [
		{
			code: "/// it's within a comment\na {}",
		},
	],
});

testRule({
	ruleName,
	config: [true],
	syntax: 'html',
	skipBasicChecks: true,

	accept: [
		{
			code: `<span
  class="
    className
  "
/>
<style>
.selector {
  --property: value;
}
</style>`,
			description: 'newline in html',
		},
		{
			code: `<p>this is fine.</p>
      <p>this isn't.</p>
      <span>this line is still affected.</span>
      <div style="ttt: auto">actual issues are still reported</div>`,
			description: 'single quotes',
		},
		{
			// https://github.com/stylelint/stylelint/issues/4489
			code: `<style>
				.highlight {
					padding: 2px;
				}
				<%- SEVERITY_COLORS.each do |severity, color| %>
				.severity.<%= severity %> {
					color: <%= color %>;
				}
				.highlight.<%= severity %> {
					background-color: <%= color.fade_out(0.4) %>;
				}
				</style>`,
			description: 'ERB templates are ignored',
		},
	],
});

'use strict';

const { messages, ruleName } = require('..');

testRule({
	ruleName,
	config: ['single'],
	skipBasicChecks: true,
	fix: true,
	accept: [
		{
			code: '',
		},
		{
			code: 'a {}',
		},
		{
			code: '@import url(foo.css);',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: "a::before { content: 'foo'; }",
		},
		{
			code: "a { background: url('foo'); }",
		},
		{
			code: "a[id='foo'] {}",
		},
		{
			code: `a::before { content: 'foo"horse"cow'; }`,
			description: 'declaration string in strings',
		},
		{
			code: `@import 'foo"horse"cow.css'`,
			description: 'at-rule string in strings',
		},
		{
			code: `a[foo='foo"horse"cow'] {}`,
			description: 'rule string in strings',
		},
		{
			code: 'a { /* "horse" */ }',
			description: 'ignores comment',
		},
		{
			code: '@charset "utf-8"',
			description: 'ignore @charset rules',
		},
		{
			code: 'a[b=#{c}][d="e"] { }',
			description: 'ignore "invalid" selector (see #3130)',
		},
	],

	reject: [
		{
			code: 'a::before { content: "foo"; }',
			fixed: "a::before { content: 'foo'; }",
			message: messages.expected('single'),
			line: 1,
			column: 22,
		},
		{
			code: 'a::before\n{\n  content: "foo";\n}',
			fixed: "a::before\n{\n  content: 'foo';\n}",
			message: messages.expected('single'),
			line: 3,
			column: 12,
		},
		{
			code: 'a[id="foo"] {}',
			fixed: "a[id='foo'] {}",
			message: messages.expected('single'),
			line: 1,
			column: 6,
		},
		{
			code: 'a[ id="foo" ] {}',
			fixed: "a[ id='foo' ] {}",
			message: messages.expected('single'),
			line: 1,
			column: 7,
		},
		{
			code: 'a\n{ background: url("foo"); }',
			fixed: "a\n{ background: url('foo'); }",
			message: messages.expected('single'),
			line: 2,
			column: 19,
		},
		{
			code: '@import "base.css"',
			fixed: "@import 'base.css'",
			message: messages.expected('single'),
			line: 1,
			column: 9,
		},
	],
});

testRule({
	ruleName,
	config: ['double'],
	skipBasicChecks: true,
	fix: true,
	accept: [
		{
			code: '',
		},
		{
			code: 'a {}',
		},
		{
			code: '@import url(foo.css);',
		},
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a::before { content: "foo"; }',
		},
		{
			code: 'a { background: url("foo"); }',
		},
		{
			code: 'a[id="foo"] {}',
		},
		{
			code: `a::before { content: "foo'horse'cow"; }`,
			description: 'declaration string in strings',
		},
		{
			code: `@import "foo'horse'cow.css"`,
			description: 'at-rule string in strings',
		},
		{
			code: `a[foo="foo'horse'cow"] {}`,
			description: 'rule string in strings',
		},
		{
			code: "a { /* 'horse' */ }",
			description: 'ignores comment',
		},
		{
			code: '@charset "utf-8"',
			description: 'ignore @charset rules',
		},
	],

	reject: [
		{
			code: "a::before { content: 'foo'; }",
			fixed: 'a::before { content: "foo"; }',
			message: messages.expected('double'),
			line: 1,
			column: 22,
		},
		{
			code: "a::before\n{\n  content: 'foo';\n}",
			fixed: 'a::before\n{\n  content: "foo";\n}',
			message: messages.expected('double'),
			line: 3,
			column: 12,
		},
		{
			code: "a[id='foo'] {}",
			fixed: 'a[id="foo"] {}',
			message: messages.expected('double'),
			line: 1,
			column: 6,
		},
		{
			code: "a { background: url('foo'); }",
			fixed: 'a { background: url("foo"); }',
			message: messages.expected('double'),
			line: 1,
			column: 21,
		},
		{
			code: "@import 'base.css'",
			fixed: '@import "base.css"',
			message: messages.expected('double'),
			line: 1,
			column: 9,
		},
	],
});

// No fix: true here because styles which require escaping aren't autofixed, only reported.
testRule({
	ruleName,
	config: ['single', { avoidEscape: false }],
	skipBasicChecks: true,
	reject: [
		{
			code: `a::before { content: "foo'horse'cow"; }`,
			description: 'declaration string in strings',
			message: messages.expected('single'),
			line: 1,
			column: 22,
		},
		{
			code: `@import "foo'horse'cow.css";`,
			description: 'at-rule string in strings',
			message: messages.expected('single'),
			line: 1,
			column: 9,
		},
		{
			code: `a[foo="foo'horse'cow"] {}`,
			description: 'rule string in strings',
			message: messages.expected('single'),
			line: 1,
			column: 7,
		},
	],
});

// No fix: true here because styles which require escaping aren't autofixed, only reported.
testRule({
	ruleName,
	config: ['double', { avoidEscape: false }],
	skipBasicChecks: true,
	reject: [
		{
			code: `a::before { content: 'foo"horse"cow'; }`,
			description: 'declaration string in strings',
			message: messages.expected('double'),
			line: 1,
			column: 22,
		},
		{
			code: `@import 'foo"horse"cow.css';`,
			description: 'at-rule string in strings',
			message: messages.expected('double'),
			line: 1,
			column: 9,
		},
		{
			code: `a[foo='foo"horse"cow'] {}`,
			description: 'rule string in strings',
			message: messages.expected('double'),
			line: 1,
			column: 7,
		},
	],
});

testRule({
	ruleName,
	config: ['double'],
	skipBasicChecks: true,
	syntax: 'scss',
	fix: true,
	accept: [
		{
			code: "a {\n  // 'horse'\n}",
			description: 'ignores single-line SCSS comment',
		},
		{
			code: '@charset "utf-8"',
			description: 'ignore @charset rules',
		},
	],

	reject: [
		{
			code: "a::before {\n  // 'horse'\n  content: 'thing'; }",
			fixed: 'a::before {\n  // \'horse\'\n  content: "thing"; }',
			description: 'pays attention when single-line SCSS comment ends',
			message: messages.expected('double'),
			line: 3,
			column: 12,
		},
		{
			code: "a::before {\n// one\n// two\n// three\n  content: 'thing'; }",
			fixed: 'a::before {\n// one\n// two\n// three\n  content: "thing"; }',
			description: 'accurate position after // comments',
			message: messages.expected('double'),
			line: 5,
			column: 12,
		},
	],
});

testRule({
	ruleName,
	config: ['double'],
	skipBasicChecks: true,
	syntax: 'less',
	fix: true,
	accept: [
		{
			code: "a {\n  // 'horse'\n}",
			description: 'ignores single-line Less comment',
		},
	],

	reject: [
		{
			code: "a::before {\n  // 'horse'\n  content: 'thing'; }",
			fixed: 'a::before {\n  // \'horse\'\n  content: "thing"; }',
			description: 'pays attention when single-line Less comment ends',
			message: messages.expected('double'),
			line: 3,
			column: 12,
		},
		{
			code: "a::before {\n// one\n// two\n// three\n  content: 'thing'; }",
			fixed: 'a::before {\n// one\n// two\n// three\n  content: "thing"; }',
			description: 'accurate position after // comments',
			message: messages.expected('double'),
			line: 5,
			column: 12,
		},
	],
});

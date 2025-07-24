const { testRule } = require("stylelint-test-rule-tape");
const rule = require("..");

testRule({
	ruleName: "block-no-empty",
	config: [true, { ignore: ["comments"] }],

	accept: [
		{
			code: ".selector {\n  /* comment only */\n}",
			description: "does not report block with only comment when ignore: ['comments'] is set",
		},
	],

	reject: [
		{
			code: ".selector {}",
			message: "Unexpected empty block",
			line: 1,
			column: 11,
		},
	],
});

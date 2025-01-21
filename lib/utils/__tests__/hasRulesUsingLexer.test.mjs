import hasRulesUsingLexer from '../hasRulesUsingLexer.mjs';

describe('hasRulesUsingLexer', () => {
	it('returns true when config contains a rule that uses lexer', async () => {
		const config = {
			rules: {
				'at-rule-descriptor-no-unknown': [true],
			},
		};

		expect(await hasRulesUsingLexer(config)).toBe(true);
	});

	it('returns false when config contains no lexer-based rules', async () => {
		const config = {
			rules: {
				'block-no-empty': [true],
				'no-empty-source': [true],
			},
		};

		expect(await hasRulesUsingLexer(config)).toBe(false);
	});

	it('returns true when multiple rules include at least one lexer-based rule', async () => {
		const config = {
			rules: {
				'block-no-empty': [true],
				'at-rule-prelude-no-invalid': [true],
				'no-empty-source': [true],
			},
		};

		expect(await hasRulesUsingLexer(config)).toBe(true);
	});

	it('returns false when config.rules is empty or undefined', async () => {
		expect(await hasRulesUsingLexer({})).toBe(false);
		expect(await hasRulesUsingLexer({ rules: {} })).toBe(false);
	});
});

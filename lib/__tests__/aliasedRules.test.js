'use strict';

const rules = require('../rules');

const whitelistAndBlacklistRulePrefixes = [
	'at-rule',
	'declaration-property-unit',
	'declaration-property-value',
	'function',
	'function-url-scheme',
	'media-feature-name',
	'property',
	'selector-attribute-operator',
	'selector-combinator',
	'selector-pseudo-class',
	'selector-pseudo-element',
	'unit',
];

const whitelistRulePrefixes = whitelistAndBlacklistRulePrefixes.concat([
	'media-feature-name-value',
]);

whitelistRulePrefixes.forEach((prefix) => {
	it(`aliases ${prefix}-whitelist to ${prefix}-allowed-list`, () =>
		expect(rules[`${prefix}-whitelist`].ruleName).toEqual(`${prefix}-allowed-list`));
});

const blacklistRulePrefixes = whitelistAndBlacklistRulePrefixes.concat(['comment-word']);

blacklistRulePrefixes.forEach((prefix) => {
	it(`aliases ${prefix}-blacklist to ${prefix}-disallowed-list`, () =>
		expect(rules[`${prefix}-blacklist`].ruleName).toEqual(`${prefix}-disallowed-list`));
});

const requirelistRulePrefixes = ['at-rule-property'];

requirelistRulePrefixes.forEach((prefix) => {
	it(`aliases ${prefix}-requirelist to ${prefix}-required-list`, () =>
		expect(rules[`${prefix}-requirelist`].ruleName).toEqual(`${prefix}-required-list`));
});

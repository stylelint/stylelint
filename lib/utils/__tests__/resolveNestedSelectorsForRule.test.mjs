import { describe, test } from 'node:test';

import postcss from 'postcss';

import assertItemsPartialDeepStrictEqual from '../../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import resolveNestedSelectorsForRule from '../resolveNestedSelectorsForRule.mjs';

function formatResolvedSelectors(items) {
	items.forEach((item) => {
		item.resolvedSelectors = item.resolvedSelectors.toString();
		item.selector = item.selector.toString();
	});

	return items;
}

describe('resolveNestedSelectorsForRule', () => {
	test('rule > rule', () => {
		const node = postcss.parse('a { a { color: red; } }').first.first;

		const resolvedSelectors = formatResolvedSelectors(
			resolveNestedSelectorsForRule(node, { warn: () => {} }),
		);

		assertItemsPartialDeepStrictEqual(resolvedSelectors, [
			{
				nested: true,
				resolvedSelectors: 'a a',
				selector: 'a',
			},
		]);
	});

	test('at-rule > rule', () => {
		const node = postcss.parse('@media screen { a { color: red; } }').first.first;

		const resolvedSelectors = formatResolvedSelectors(
			resolveNestedSelectorsForRule(node, { warn: () => {} }),
		);

		assertItemsPartialDeepStrictEqual(resolvedSelectors, [
			{
				nested: false,
				resolvedSelectors: 'a',
				selector: 'a',
			},
		]);
	});

	test('rule > at-rule > rule', () => {
		const node = postcss.parse('a { @media screen { a { color: red; } } }').first.first.first;

		const resolvedSelectors = formatResolvedSelectors(
			resolveNestedSelectorsForRule(node, { warn: () => {} }),
		);

		assertItemsPartialDeepStrictEqual(resolvedSelectors, [
			{
				nested: true,
				resolvedSelectors: 'a a',
				selector: 'a',
			},
		]);
	});

	test("rule selector can't be parsed", () => {
		const node = postcss.parse('a { a! { color: red; } }').first.first;

		const resolvedSelectors = formatResolvedSelectors(
			resolveNestedSelectorsForRule(node, { warn: () => {} }),
		);

		assertItemsPartialDeepStrictEqual(resolvedSelectors, []);
	});

	test("parent rule selector can't be parsed", () => {
		const node = postcss.parse('a! { a { color: red; } }').first.first;

		const resolvedSelectors = formatResolvedSelectors(
			resolveNestedSelectorsForRule(node, { warn: () => {} }),
		);

		assertItemsPartialDeepStrictEqual(resolvedSelectors, []);
	});

	test('@scope as parent with implicit nesting', () => {
		const node = postcss.parse('a { @scope (b) { c { color: red; } } }').first.first.first;

		const resolvedSelectors = formatResolvedSelectors(
			resolveNestedSelectorsForRule(node, { warn: () => {} }),
		);

		assertItemsPartialDeepStrictEqual(resolvedSelectors, [
			{
				nested: true,
				resolvedSelectors: ':where(:scope) c',
				selector: 'c',
			},
		]);
	});

	test('@scope as parent with explicit nesting', () => {
		const node = postcss.parse('a { @scope (b) { c & { color: red; } } }').first.first.first;

		const resolvedSelectors = formatResolvedSelectors(
			resolveNestedSelectorsForRule(node, { warn: () => {} }),
		);

		assertItemsPartialDeepStrictEqual(resolvedSelectors, [
			{
				nested: true,
				resolvedSelectors: 'c :where(:scope)',
				selector: 'c &',
			},
		]);
	});
});

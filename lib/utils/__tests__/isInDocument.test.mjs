import { describe, it } from 'node:test';

import postcss from 'postcss';
import postcssHtml from 'postcss-html';

import isInDocument from '../isInDocument.mjs';
import naiveCssInJs from '../../__tests__/fixtures/postcss-naive-css-in-js.cjs';

describe('isInDocument', () => {
	it('returns false for nodes not in a document', (t) => {
		const root = postcss.parse('a { color: red; }');
		const {
			first: { first: decl },
		} = root;

		t.assert.strictEqual(isInDocument(decl), false);
	});

	it('returns false for root nodes', (t) => {
		const root = postcss.parse('a { color: red; }');

		t.assert.strictEqual(isInDocument(root), false);
	});

	it('returns true for nodes directly in a document', (t) => {
		const document = postcss.document();
		const root = postcss.parse('a { color: red; }');

		document.append(root);

		t.assert.strictEqual(isInDocument(root), true);
	});

	it('returns true for nested nodes in a document', (t) => {
		const document = postcss.document();
		const root = postcss.parse('a { color: red; --custom: blue; }');

		document.append(root);

		const decls = [];

		root.walkDecls((decl) => decls.push(decl));

		t.assert.strictEqual(decls.length, 2);
		t.assert.strictEqual(isInDocument(decls[0]), true); // color: red
		t.assert.strictEqual(isInDocument(decls[1]), true); // --custom: blue
	});

	it('returns true for deeply nested nodes in a document', (t) => {
		const document = postcss.document();
		const root = postcss.parse(`
			@media (min-width: 600px) {
				a {
					color: red;
					@supports (display: grid) {
						display: grid;
					}
				}
			}
		`);

		document.append(root);

		const decls = [];

		root.walkDecls((decl) => decls.push(decl));

		t.assert.strictEqual(decls.length, 2);
		t.assert.strictEqual(isInDocument(decls[0]), true); // color: red
		t.assert.strictEqual(isInDocument(decls[1]), true); // display: grid
	});

	it('returns true for CSS-in-JS with naiveCssInJs parser', (t) => {
		const document = naiveCssInJs.parse('css` color: red; `;');
		const decls = [];

		document.walkDecls((decl) => decls.push(decl));

		t.assert.strictEqual(decls.length, 1);
		t.assert.strictEqual(isInDocument(decls[0]), true);
	});

	it('returns true for multiple CSS-in-JS blocks', (t) => {
		const document = naiveCssInJs.parse(`
			css\` color: red; \`;
			css\` font-size: 14px; --custom: blue; \`;
		`);
		const decls = [];

		document.walkDecls((decl) => decls.push(decl));

		t.assert.strictEqual(decls.length, 3);
		t.assert.strictEqual(isInDocument(decls[0]), true); // color: red
		t.assert.strictEqual(isInDocument(decls[1]), true); // font-size: 14px
		t.assert.strictEqual(isInDocument(decls[2]), true); // --custom: blue
	});

	it('returns false for nodes without parent', (t) => {
		const decl = postcss.decl({ prop: 'color', value: 'red' });

		t.assert.strictEqual(isInDocument(decl), false);
	});

	it('returns true for nodes with document property', (t) => {
		const document = postcss.document();
		const mockNode = postcss.decl({ prop: 'color', value: 'blue' });

		// Mock a node that has a document property
		mockNode.document = document;

		t.assert.strictEqual(isInDocument(mockNode), true);
	});

	it('returns false for nodes with non-document document property', (t) => {
		const mockNode = postcss.decl({ prop: 'color', value: 'blue' });

		// Mock a node that has a document property but it's not a Document
		mockNode.document = 'not-a-document';

		t.assert.strictEqual(isInDocument(mockNode), false);
	});

	it('returns true for document nodes themselves', (t) => {
		const document = postcss.document();

		t.assert.strictEqual(isInDocument(document), true);
	});

	it('handles complex nested document structures', (t) => {
		const outerDocument = postcss.document();
		const innerDocument = postcss.document();
		const root = postcss.parse('a { color: red; }');

		innerDocument.append(root);
		outerDocument.append(innerDocument);

		const decl = root.first.first;

		t.assert.strictEqual(isInDocument(decl), true);
	});

	describe('with postcss-html parser', () => {
		it('returns true for declarations in HTML style tags', (t) => {
			const document = postcssHtml.parse('<style>a { color: red; --custom: blue; }</style>');
			const decls = [];

			document.walkDecls((decl) => decls.push(decl));

			t.assert.strictEqual(decls.length, 2);
			t.assert.strictEqual(isInDocument(decls[0]), true); // color: red
			t.assert.strictEqual(isInDocument(decls[1]), true); // --custom: blue
		});

		it('returns true for declarations in HTML style attributes', (t) => {
			const document = postcssHtml.parse('<div style="color: red; font-size: 14px;">content</div>');
			const decls = [];

			document.walkDecls((decl) => decls.push(decl));

			t.assert.strictEqual(decls.length, 2);
			t.assert.strictEqual(isInDocument(decls[0]), true); // color: red
			t.assert.strictEqual(isInDocument(decls[1]), true); // font-size: 14px
		});

		it('returns true for declarations in multiple HTML style sources', (t) => {
			const document = postcssHtml.parse(`
				<style>body { margin: 0; }</style>
				<div style="color: red;">content</div>
				<style>.class { padding: 10px; }</style>
			`);
			const decls = [];

			document.walkDecls((decl) => decls.push(decl));

			t.assert.strictEqual(decls.length, 3);
			t.assert.strictEqual(isInDocument(decls[0]), true); // margin: 0
			t.assert.strictEqual(isInDocument(decls[1]), true); // color: red
			t.assert.strictEqual(isInDocument(decls[2]), true); // padding: 10px
		});

		it('returns true for deeply nested declarations in HTML', (t) => {
			const document = postcssHtml.parse(`
				<style>
					@media (min-width: 600px) {
						.container {
							display: grid;
							@supports (display: grid) {
								grid-template-columns: 1fr 1fr;
							}
						}
					}
				</style>
			`);
			const decls = [];

			document.walkDecls((decl) => decls.push(decl));

			t.assert.strictEqual(decls.length, 2);
			t.assert.strictEqual(isInDocument(decls[0]), true); // display: grid
			t.assert.strictEqual(isInDocument(decls[1]), true); // grid-template-columns
		});

		it('returns true for custom properties in HTML style attributes', (t) => {
			const document = postcssHtml.parse(
				'<div style="--theme-color: #ff0000; color: var(--theme-color);">content</div>',
			);
			const decls = [];

			document.walkDecls((decl) => decls.push(decl));

			t.assert.strictEqual(decls.length, 2);
			t.assert.strictEqual(isInDocument(decls[0]), true); // --theme-color
			t.assert.strictEqual(isInDocument(decls[1]), true); // color
		});

		it('handles edge case where root.parent might be undefined', (t) => {
			// Test cases where HTML parsers may not properly set parent relationships
			// Some parsers create Document nodes but don't always link Root.parent to Document
			const document = postcssHtml.parse('<style>a { color: red; }</style>');
			const root = document.first;
			const decl = root.first.first;

			// Verify the expected AST structure: Document -> Root -> Rule -> Declaration
			t.assert.strictEqual(document.type, 'document');
			t.assert.strictEqual(root.type, 'root');

			// In some HTML parsing scenarios, root.parent may be undefined
			// despite the root being contained within a document
			t.assert.strictEqual(root.parent, undefined);

			// Our function should still correctly detect that the declaration
			// is within a document context through alternative means
			t.assert.strictEqual(isInDocument(decl), true);
		});
	});

	describe('with postcss-html parser (inline)', () => {
		it('returns false for declarations in HTML style tags', (t) => {
			const document = postcssHtml.parse('<style>a { color: red; --custom: blue; }</style>');
			const decls = [];

			document.walkDecls((decl) => decls.push(decl));

			t.assert.strictEqual(decls.length, 2);
			t.assert.strictEqual(isInDocument(decls[0], { inline: true }), false);
			t.assert.strictEqual(isInDocument(decls[1], { inline: true }), false);
		});

		it('returns false for deeply nested declarations in HTML', (t) => {
			const document = postcssHtml.parse(`
				<style>
					@media (min-width: 600px) {
						.container {
							display: grid;
							@supports (display: grid) {
								grid-template-columns: 1fr 1fr;
							}
						}
					}
				</style>
			`);
			const decls = [];

			document.walkDecls((decl) => decls.push(decl));

			t.assert.strictEqual(decls.length, 2);
			t.assert.strictEqual(isInDocument(decls[0], { inline: true }), false);
			t.assert.strictEqual(isInDocument(decls[1], { inline: true }), false);
		});

		it('handles edge case where root.parent might be undefined', (t) => {
			// Test cases where HTML parsers may not properly set parent relationships
			// Some parsers create Document nodes but don't always link Root.parent to Document
			const document = postcssHtml.parse('<style>a { color: red; }</style>');
			const root = document.first;
			const decl = root.first.first;

			// Verify the expected AST structure: Document -> Root -> Rule -> Declaration
			t.assert.strictEqual(document.type, 'document');
			t.assert.strictEqual(root.type, 'root');

			// In some HTML parsing scenarios, root.parent may be undefined
			// despite the root being contained within a document
			t.assert.strictEqual(root.parent, undefined);

			// Our function should still correctly detect that the declaration
			// is within a document context through alternative means
			t.assert.strictEqual(isInDocument(decl, { inline: true }), false);
		});

		it('returns false for declarations in multiple HTML style sources', (t) => {
			const document = postcssHtml.parse(`
				<style>body { margin: 0; }</style>
				<div style="color: red;">content</div>
				<style>.class { padding: 10px; }</style>
			`);
			const decls = [];

			document.walkDecls((decl) => decls.push(decl));

			t.assert.strictEqual(decls.length, 3);
			t.assert.strictEqual(isInDocument(decls[0], { inline: true }), false); // margin: 0
			t.assert.strictEqual(isInDocument(decls[1], { inline: true }), true); // color: red
			t.assert.strictEqual(isInDocument(decls[2], { inline: true }), false); // padding: 10px
		});
	});
});

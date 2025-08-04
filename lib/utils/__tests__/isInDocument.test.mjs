import postcss from 'postcss';

import { isInDocument } from '../isInDocument.mjs';
import naiveCssInJs from '../../__tests__/fixtures/postcss-naive-css-in-js.cjs';

describe('isInDocument', () => {
	it('returns false for nodes not in a document', () => {
		const root = postcss.parse('a { color: red; }');
		const {
			first: { first: decl },
		} = root;

		expect(isInDocument(decl)).toBe(false);
	});

	it('returns false for root nodes', () => {
		const root = postcss.parse('a { color: red; }');

		expect(isInDocument(root)).toBe(false);
	});

	it('returns true for nodes directly in a document', () => {
		const document = postcss.document();
		const root = postcss.parse('a { color: red; }');

		document.append(root);

		expect(isInDocument(root)).toBe(true);
	});

	it('returns true for nested nodes in a document', () => {
		const document = postcss.document();
		const root = postcss.parse('a { color: red; --custom: blue; }');

		document.append(root);

		const decls = [];

		root.walkDecls((decl) => decls.push(decl));

		expect(decls).toHaveLength(2);
		expect(isInDocument(decls[0])).toBe(true); // color: red
		expect(isInDocument(decls[1])).toBe(true); // --custom: blue
	});

	it('returns true for deeply nested nodes in a document', () => {
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

		expect(decls).toHaveLength(2);
		expect(isInDocument(decls[0])).toBe(true); // color: red
		expect(isInDocument(decls[1])).toBe(true); // display: grid
	});

	it('returns true for CSS-in-JS with naiveCssInJs parser', () => {
		const document = naiveCssInJs.parse('css` color: red; `;');
		const decls = [];

		document.walkDecls((decl) => decls.push(decl));

		expect(decls).toHaveLength(1);
		expect(isInDocument(decls[0])).toBe(true);
	});

	it('returns true for multiple CSS-in-JS blocks', () => {
		const document = naiveCssInJs.parse(`
			css\` color: red; \`;
			css\` font-size: 14px; --custom: blue; \`;
		`);
		const decls = [];

		document.walkDecls((decl) => decls.push(decl));

		expect(decls).toHaveLength(3);
		expect(isInDocument(decls[0])).toBe(true); // color: red
		expect(isInDocument(decls[1])).toBe(true); // font-size: 14px
		expect(isInDocument(decls[2])).toBe(true); // --custom: blue
	});

	it('returns false for nodes without parent', () => {
		const decl = postcss.decl({ prop: 'color', value: 'red' });

		expect(isInDocument(decl)).toBe(false);
	});

	it('returns true for nodes with document property', () => {
		const document = postcss.document();
		const mockNode = postcss.decl({ prop: 'color', value: 'blue' });

		// Mock a node that has a document property
		mockNode.document = document;

		expect(isInDocument(mockNode)).toBe(true);
	});

	it('returns false for nodes with non-document document property', () => {
		const mockNode = postcss.decl({ prop: 'color', value: 'blue' });

		// Mock a node that has a document property but it's not a Document
		mockNode.document = 'not-a-document';

		expect(isInDocument(mockNode)).toBe(false);
	});

	it('returns true for document nodes themselves', () => {
		const document = postcss.document();

		expect(isInDocument(document)).toBe(true);
	});

	it('handles complex nested document structures', () => {
		const outerDocument = postcss.document();
		const innerDocument = postcss.document();
		const root = postcss.parse('a { color: red; }');

		innerDocument.append(root);
		outerDocument.append(innerDocument);

		const decl = root.first.first;

		expect(isInDocument(decl)).toBe(true);
	});
});

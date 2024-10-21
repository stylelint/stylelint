import declarationRawsBetweenIndex from '../declarationRawsBetweenIndex.mjs';
import postcss from 'postcss';

describe('declarationRawsBetweenIndex', () => {
	it('has no spaces before the colon', () => {
		expect(declarationRawsBetweenIndex(decl('a { a:b }'))).toBe(1);
	});

	it('has a space before the colon', () => {
		expect(declarationRawsBetweenIndex(decl('a { a :b}'))).toBe(1);
	});

	it('has multiple characters before the colon', () => {
		expect(declarationRawsBetweenIndex(decl('a { a  :b }'))).toBe(1);
	});

	it('has a newline before the colon', () => {
		expect(declarationRawsBetweenIndex(decl('a { a\n:b }'))).toBe(1);
	});

	it('has a comment before the colon', () => {
		expect(declarationRawsBetweenIndex(decl('a { a/**/:b }'))).toBe(1);
	});

	it('has "aa" as property', () => {
		expect(declarationRawsBetweenIndex(decl('a { aa:b }'))).toBe(2);
	});
});

function decl(css) {
	const list = [];

	postcss.parse(css).walkDecls((d) => list.push(d));

	return list[0];
}

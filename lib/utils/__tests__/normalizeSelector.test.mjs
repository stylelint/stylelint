import normalizeSelector from '../normalizeSelector.mjs';
import parseSelector from '../parseSelector.mjs';

/** @type {import('stylelint').PostcssResult} */
const mockResult = {};

it('orders selectors', () => {
	expect(normalizeSelector(parseSelector('.foo'), mockResult).string).toBe('.foo');
	expect(normalizeSelector(parseSelector('.foo,.bar'), mockResult).string).toBe('.bar,.foo');

	expect(normalizeSelector(parseSelector(':is(b,a)'), mockResult).string).toBe(':is(a,b)');
	expect(
		normalizeSelector(parseSelector(':is(:a(a,b),:b(c,b),:b(a,b),:a(b,c))'), mockResult).string,
	).toBe(':is(:a(a,b),:a(b,c),:b(a,b),:b(b,c))');
	expect(normalizeSelector(parseSelector(':is(b,a),:is(a,c)'), mockResult).string).toBe(
		':is(a,b),:is(a,c)',
	);
	expect(normalizeSelector(parseSelector(':is(a,c),:is(b,a)'), mockResult).string).toBe(
		':is(a,b),:is(a,c)',
	);

	expect(normalizeSelector(parseSelector('::is(b,a)'), mockResult).string).toBe('::is(a,b)');
	expect(
		normalizeSelector(parseSelector('::is(::a(a,b),::b(c,b),::b(a,b),::a(b,c))'), mockResult)
			.string,
	).toBe('::is(::a(a,b),::a(b,c),::b(a,b),::b(b,c))');
	expect(normalizeSelector(parseSelector('::is(b,a),::is(a,c)'), mockResult).string).toBe(
		'::is(a,b),::is(a,c)',
	);
	expect(normalizeSelector(parseSelector('::is(a,c),::is(b,a)'), mockResult).string).toBe(
		'::is(a,b),::is(a,c)',
	);
});

it('makes a unique set of selectors', () => {
	expect(normalizeSelector(parseSelector('.foo,.foo'), mockResult).string).toBe('.foo');
	expect(normalizeSelector(parseSelector('.foo,.bar,.foo'), mockResult).string).toBe('.bar,.foo');

	expect(normalizeSelector(parseSelector(':is(a,a)'), mockResult).string).toBe(':is(a)');
	expect(normalizeSelector(parseSelector(':is(a,a),:is(a)'), mockResult).string).toBe(':is(a)');
	expect(normalizeSelector(parseSelector(':is(a,a),:is(b)'), mockResult).string).toBe(
		':is(a),:is(b)',
	);
	expect(
		normalizeSelector(parseSelector(':is(:a(a,b),:b(b,a),:b(a,b),:a(a,b))'), mockResult).string,
	).toBe(':is(:a(a,b),:b(a,b))');

	expect(normalizeSelector(parseSelector('::is(a,a)'), mockResult).string).toBe('::is(a)');
	expect(
		normalizeSelector(parseSelector('::is(::a(a,b),::b(b,a),::b(a,b),::a(a,b))'), mockResult)
			.string,
	).toBe('::is(::a(a,b),::b(a,b))');
});

it('removes whitespace', () => {
	expect(normalizeSelector(parseSelector(' a , b , c '), mockResult).string).toBe('a,b,c');

	expect(normalizeSelector(parseSelector(' .a , .b , .c '), mockResult).string).toBe('.a,.b,.c');

	expect(normalizeSelector(parseSelector(' * , b , c '), mockResult).string).toBe('*,b,c');
	expect(normalizeSelector(parseSelector(' a , * , c '), mockResult).string).toBe('*,a,c');
	expect(normalizeSelector(parseSelector(' a , b , * '), mockResult).string).toBe('*,a,b');

	expect(normalizeSelector(parseSelector(' & , b , c '), mockResult).string).toBe('&,b,c');
	expect(normalizeSelector(parseSelector(' a , & , c '), mockResult).string).toBe('&,a,c');
	expect(normalizeSelector(parseSelector(' a , b , & '), mockResult).string).toBe('&,a,b');

	expect(
		normalizeSelector(parseSelector(' :focus , :focus-visible , :hover '), mockResult).string,
	).toBe(':focus,:focus-visible,:hover');
	expect(
		normalizeSelector(parseSelector(' :is( a , b ) , :is( c , d ) , :is( e , f ) '), mockResult)
			.string,
	).toBe(':is(a,b),:is(c,d),:is(e,f)');

	expect(
		normalizeSelector(parseSelector(' ::after , ::before , ::first-line '), mockResult).string,
	).toBe('::after,::before,::first-line');
	expect(
		normalizeSelector(parseSelector(' ::a( a , b ) , ::b( c , d ) , ::c( e , f ) '), mockResult)
			.string,
	).toBe('::a(a,b),::b(c,d),::c(e,f)');

	expect(
		normalizeSelector(parseSelector(' [ a = b ] , [ c = d ] , [ e = f ] '), mockResult).string,
	).toBe('[a=b],[c=d],[e=f]');
	expect(
		normalizeSelector(parseSelector(' [ a = b i ] , [ c = d i ] , [ e = f i ] '), mockResult)
			.string,
	).toBe('[a=b i],[c=d i],[e=f i]');
	expect(
		normalizeSelector(parseSelector(' [ a = "b" i ] , [ c = "d" i ] , [ e = "f" i ] '), mockResult)
			.string,
	).toBe('[a="b"i],[c="d"i],[e="f"i]');

	expect(normalizeSelector(parseSelector(' *|a , svg|a , *|* '), mockResult).string).toBe(
		'*|*,*|a,svg|a',
	);
});

it('does not remove descendant operators', () => {
	expect(normalizeSelector(parseSelector(' a  b '), mockResult).string).toBe('a b');
	expect(normalizeSelector(parseSelector(' a  >  b  c   '), mockResult).string).toBe('a>b c');
});

it('removes comments', () => {
	expect(normalizeSelector(parseSelector(' a/* a comment */ b '), mockResult).string).toBe('a b');
	expect(
		normalizeSelector(
			parseSelector(
				'/* a comment */:is(/* a comment */a/* a comment */,/* a comment */b/* a comment */)/* a comment */',
			),
			mockResult,
		).string,
	).toBe(':is(a,b)');
});

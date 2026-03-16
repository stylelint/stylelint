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

it('sorts class names and ids', () => {
	expect(normalizeSelector(parseSelector('.foo.bar'), mockResult).string).toBe('.bar.foo');
	expect(normalizeSelector(parseSelector('#foo#bar'), mockResult).string).toBe('#bar#foo');
	expect(normalizeSelector(parseSelector('.foo#bar'), mockResult).string).toBe('#bar.foo');
});

it('sorts with combinator', () => {
	expect(normalizeSelector(parseSelector('.bar.foo > .foo#bar'), mockResult).string).toBe(
		'.bar.foo>#bar.foo',
	);
	expect(normalizeSelector(parseSelector('.bar.foo + .foo#bar'), mockResult).string).toBe(
		'.bar.foo+#bar.foo',
	);
	expect(normalizeSelector(parseSelector('.bar.foo ~ .foo#bar'), mockResult).string).toBe(
		'.bar.foo~#bar.foo',
	);
});

it('sorts pseudo and pseudo-element', () => {
	expect(normalizeSelector(parseSelector('.bar.foo::before:hover {}'), mockResult).string).toBe(
		'.bar.foo::before:hover {}',
	);

	expect(normalizeSelector(parseSelector('a:hover:focus {}'), mockResult).string).toBe(
		'a:focus:hover {}',
	);
});

it('sorts attribute selectors', () => {
	expect(normalizeSelector(parseSelector('a[foo]#baz.bar {}'), mockResult).string).toBe(
		'a#baz.bar[foo] {}',
	);

	expect(
		normalizeSelector(parseSelector('div[foo]#bar.baz:hover::before'), mockResult).string,
	).toBe('div#bar.baz[foo]:hover::before');

	expect(normalizeSelector(parseSelector('[foo]#bar.baz::before:hover'), mockResult).string).toBe(
		'#bar.baz[foo]::before:hover',
	);
});

it('sorts universal selector with other selectors', () => {
	expect(normalizeSelector(parseSelector('*.foo.bar'), mockResult).string).toBe('*.bar.foo');
});

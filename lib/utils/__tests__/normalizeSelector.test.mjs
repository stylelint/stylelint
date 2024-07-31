import normalizeSelector from '../normalizeSelector.mjs';
import parseSelector from '../parseSelector.mjs';

it('orders selectors', () => {
	expect(normalizeSelector(parseSelector('.foo')).toString()).toBe('.foo');
	expect(normalizeSelector(parseSelector('.foo,.bar')).toString()).toBe('.bar,.foo');

	expect(normalizeSelector(parseSelector(':is(b,a)')).toString()).toBe(':is(a,b)');
	expect(normalizeSelector(parseSelector(':is(:a(a,b),:b(c,b),:b(a,b),:a(b,c))')).toString()).toBe(
		':is(:a(a,b),:a(b,c),:b(a,b),:b(b,c))',
	);
	expect(normalizeSelector(parseSelector(':is(b,a),:is(a,c)')).toString()).toBe(
		':is(a,b),:is(a,c)',
	);
	expect(normalizeSelector(parseSelector(':is(a,c),:is(b,a)')).toString()).toBe(
		':is(a,b),:is(a,c)',
	);

	expect(normalizeSelector(parseSelector('::is(b,a)')).toString()).toBe('::is(a,b)');
	expect(
		normalizeSelector(parseSelector('::is(::a(a,b),::b(c,b),::b(a,b),::a(b,c))')).toString(),
	).toBe('::is(::a(a,b),::a(b,c),::b(a,b),::b(b,c))');
	expect(normalizeSelector(parseSelector('::is(b,a),::is(a,c)')).toString()).toBe(
		'::is(a,b),::is(a,c)',
	);
	expect(normalizeSelector(parseSelector('::is(a,c),::is(b,a)')).toString()).toBe(
		'::is(a,b),::is(a,c)',
	);
});

it('makes a unique set of selectors', () => {
	expect(normalizeSelector(parseSelector('.foo,.foo')).toString()).toBe('.foo');
	expect(normalizeSelector(parseSelector('.foo,.bar,.foo')).toString()).toBe('.bar,.foo');

	expect(normalizeSelector(parseSelector(':is(a,a)')).toString()).toBe(':is(a)');
	expect(normalizeSelector(parseSelector(':is(a,a),:is(a)')).toString()).toBe(':is(a)');
	expect(normalizeSelector(parseSelector(':is(a,a),:is(b)')).toString()).toBe(':is(a),:is(b)');
	expect(normalizeSelector(parseSelector(':is(:a(a,b),:b(b,a),:b(a,b),:a(a,b))')).toString()).toBe(
		':is(:a(a,b),:b(a,b))',
	);

	expect(normalizeSelector(parseSelector('::is(a,a)')).toString()).toBe('::is(a)');
	expect(
		normalizeSelector(parseSelector('::is(::a(a,b),::b(b,a),::b(a,b),::a(a,b))')).toString(),
	).toBe('::is(::a(a,b),::b(a,b))');
});

it('removes whitespace', () => {
	expect(normalizeSelector(parseSelector(' a , b , c ')).toString()).toBe('a,b,c');

	expect(normalizeSelector(parseSelector(' .a , .b , .c ')).toString()).toBe('.a,.b,.c');

	expect(normalizeSelector(parseSelector(' * , b , c ')).toString()).toBe('*,b,c');
	expect(normalizeSelector(parseSelector(' a , * , c ')).toString()).toBe('*,a,c');
	expect(normalizeSelector(parseSelector(' a , b , * ')).toString()).toBe('*,a,b');

	expect(normalizeSelector(parseSelector(' & , b , c ')).toString()).toBe('&,b,c');
	expect(normalizeSelector(parseSelector(' a , & , c ')).toString()).toBe('&,a,c');
	expect(normalizeSelector(parseSelector(' a , b , & ')).toString()).toBe('&,a,b');

	expect(normalizeSelector(parseSelector(' :focus , :focus-visible , :hover ')).toString()).toBe(
		':focus,:focus-visible,:hover',
	);
	expect(
		normalizeSelector(parseSelector(' :is( a , b ) , :is( c , d ) , :is( e , f ) ')).toString(),
	).toBe(':is(a,b),:is(c,d),:is(e,f)');

	expect(normalizeSelector(parseSelector(' ::after , ::before , ::first-line ')).toString()).toBe(
		'::after,::before,::first-line',
	);
	expect(
		normalizeSelector(parseSelector(' ::a( a , b ) , ::b( c , d ) , ::c( e , f ) ')).toString(),
	).toBe('::a(a,b),::b(c,d),::c(e,f)');

	expect(normalizeSelector(parseSelector(' [ a = b ] , [ c = d ] , [ e = f ] ')).toString()).toBe(
		'[a=b],[c=d],[e=f]',
	);
	expect(
		normalizeSelector(parseSelector(' [ a = b i ] , [ c = d i ] , [ e = f i ] ')).toString(),
	).toBe('[a=b i],[c=d i],[e=f i]');
	expect(
		normalizeSelector(parseSelector(' [ a = "b" i ] , [ c = "d" i ] , [ e = "f" i ] ')).toString(),
	).toBe('[a="b"i],[c="d"i],[e="f"i]');

	expect(normalizeSelector(parseSelector(' *|a , svg|a , *|* ')).toString()).toBe('*|*,*|a,svg|a');
});

it('does not remove descendant operators', () => {
	expect(normalizeSelector(parseSelector(' a  b ')).toString()).toBe('a b');
	expect(normalizeSelector(parseSelector(' a  >  b  c   ')).toString()).toBe('a>b c');
});

it('removes comments', () => {
	expect(normalizeSelector(parseSelector(' a/* a comment */ b ')).toString()).toBe('a b');
	expect(
		normalizeSelector(
			parseSelector(
				'/* a comment */:is(/* a comment */a/* a comment */,/* a comment */b/* a comment */)/* a comment */',
			),
		).toString(),
	).toBe(':is(a,b)');
});

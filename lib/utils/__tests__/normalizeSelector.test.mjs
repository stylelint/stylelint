import { it } from 'node:test';

import normalizeSelector from '../normalizeSelector.mjs';
import parseSelector from '../parseSelector.mjs';

/** @type {import('stylelint').PostcssResult} */
const mockResult = {};

it('orders selectors', (t) => {
	t.assert.strictEqual(normalizeSelector(parseSelector('.foo'), mockResult).string, '.foo');
	t.assert.strictEqual(
		normalizeSelector(parseSelector('.foo,.bar'), mockResult).string,
		'.bar,.foo',
	);

	t.assert.strictEqual(normalizeSelector(parseSelector(':is(b,a)'), mockResult).string, ':is(a,b)');
	t.assert.strictEqual(
		normalizeSelector(parseSelector(':is(:a(a,b),:b(c,b),:b(a,b),:a(b,c))'), mockResult).string,
		':is(:a(a,b),:a(b,c),:b(a,b),:b(b,c))',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector(':is(b,a),:is(a,c)'), mockResult).string,
		':is(a,b),:is(a,c)',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector(':is(a,c),:is(b,a)'), mockResult).string,
		':is(a,b),:is(a,c)',
	);

	t.assert.strictEqual(
		normalizeSelector(parseSelector('::is(b,a)'), mockResult).string,
		'::is(a,b)',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector('::is(::a(a,b),::b(c,b),::b(a,b),::a(b,c))'), mockResult)
			.string,
		'::is(::a(a,b),::a(b,c),::b(a,b),::b(b,c))',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector('::is(b,a),::is(a,c)'), mockResult).string,
		'::is(a,b),::is(a,c)',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector('::is(a,c),::is(b,a)'), mockResult).string,
		'::is(a,b),::is(a,c)',
	);
});

it('makes a unique set of selectors', (t) => {
	t.assert.strictEqual(normalizeSelector(parseSelector('.foo,.foo'), mockResult).string, '.foo');
	t.assert.strictEqual(
		normalizeSelector(parseSelector('.foo,.bar,.foo'), mockResult).string,
		'.bar,.foo',
	);

	t.assert.strictEqual(normalizeSelector(parseSelector(':is(a,a)'), mockResult).string, ':is(a)');
	t.assert.strictEqual(
		normalizeSelector(parseSelector(':is(a,a),:is(a)'), mockResult).string,
		':is(a)',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector(':is(a,a),:is(b)'), mockResult).string,
		':is(a),:is(b)',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector(':is(:a(a,b),:b(b,a),:b(a,b),:a(a,b))'), mockResult).string,
		':is(:a(a,b),:b(a,b))',
	);

	t.assert.strictEqual(normalizeSelector(parseSelector('::is(a,a)'), mockResult).string, '::is(a)');
	t.assert.strictEqual(
		normalizeSelector(parseSelector('::is(::a(a,b),::b(b,a),::b(a,b),::a(a,b))'), mockResult)
			.string,
		'::is(::a(a,b),::b(a,b))',
	);
});

it('removes whitespace', (t) => {
	t.assert.strictEqual(normalizeSelector(parseSelector(' a , b , c '), mockResult).string, 'a,b,c');

	t.assert.strictEqual(
		normalizeSelector(parseSelector(' .a , .b , .c '), mockResult).string,
		'.a,.b,.c',
	);

	t.assert.strictEqual(normalizeSelector(parseSelector(' * , b , c '), mockResult).string, '*,b,c');
	t.assert.strictEqual(normalizeSelector(parseSelector(' a , * , c '), mockResult).string, '*,a,c');
	t.assert.strictEqual(normalizeSelector(parseSelector(' a , b , * '), mockResult).string, '*,a,b');

	t.assert.strictEqual(normalizeSelector(parseSelector(' & , b , c '), mockResult).string, '&,b,c');
	t.assert.strictEqual(normalizeSelector(parseSelector(' a , & , c '), mockResult).string, '&,a,c');
	t.assert.strictEqual(normalizeSelector(parseSelector(' a , b , & '), mockResult).string, '&,a,b');

	t.assert.strictEqual(
		normalizeSelector(parseSelector(' :focus , :focus-visible , :hover '), mockResult).string,
		':focus,:focus-visible,:hover',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector(' :is( a , b ) , :is( c , d ) , :is( e , f ) '), mockResult)
			.string,
		':is(a,b),:is(c,d),:is(e,f)',
	);

	t.assert.strictEqual(
		normalizeSelector(parseSelector(' ::after , ::before , ::first-line '), mockResult).string,
		'::after,::before,::first-line',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector(' ::a( a , b ) , ::b( c , d ) , ::c( e , f ) '), mockResult)
			.string,
		'::a(a,b),::b(c,d),::c(e,f)',
	);

	t.assert.strictEqual(
		normalizeSelector(parseSelector(' [ a = b ] , [ c = d ] , [ e = f ] '), mockResult).string,
		'[a=b],[c=d],[e=f]',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector(' [ a = b i ] , [ c = d i ] , [ e = f i ] '), mockResult)
			.string,
		'[a=b i],[c=d i],[e=f i]',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector(' [ a = "b" i ] , [ c = "d" i ] , [ e = "f" i ] '), mockResult)
			.string,
		'[a="b"i],[c="d"i],[e="f"i]',
	);

	t.assert.strictEqual(
		normalizeSelector(parseSelector(' *|a , svg|a , *|* '), mockResult).string,
		'*|*,*|a,svg|a',
	);
});

it('does not remove descendant operators', (t) => {
	t.assert.strictEqual(normalizeSelector(parseSelector(' a  b '), mockResult).string, 'a b');
	t.assert.strictEqual(
		normalizeSelector(parseSelector(' a  >  b  c   '), mockResult).string,
		'a>b c',
	);
});

it('removes comments', (t) => {
	t.assert.strictEqual(
		normalizeSelector(parseSelector(' a/* a comment */ b '), mockResult).string,
		'a b',
	);
	t.assert.strictEqual(
		normalizeSelector(
			parseSelector(
				'/* a comment */:is(/* a comment */a/* a comment */,/* a comment */b/* a comment */)/* a comment */',
			),
			mockResult,
		).string,
		':is(a,b)',
	);
});

it('sorts class names and ids', (t) => {
	t.assert.strictEqual(normalizeSelector(parseSelector('.foo.bar'), mockResult).string, '.bar.foo');
	t.assert.strictEqual(normalizeSelector(parseSelector('#foo#bar'), mockResult).string, '#bar#foo');
	t.assert.strictEqual(normalizeSelector(parseSelector('.foo#bar'), mockResult).string, '#bar.foo');
});

it('sorts with combinator', (t) => {
	t.assert.strictEqual(
		normalizeSelector(parseSelector('.bar.foo > .foo#bar'), mockResult).string,
		'.bar.foo>#bar.foo',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector('.bar.foo + .foo#bar'), mockResult).string,
		'.bar.foo+#bar.foo',
	);
	t.assert.strictEqual(
		normalizeSelector(parseSelector('.bar.foo ~ .foo#bar'), mockResult).string,
		'.bar.foo~#bar.foo',
	);
});

it('sorts pseudo and pseudo-element', (t) => {
	t.assert.strictEqual(
		normalizeSelector(parseSelector('.bar.foo::before:hover {}'), mockResult).string,
		'.bar.foo::before:hover {}',
	);

	t.assert.strictEqual(
		normalizeSelector(parseSelector('a:hover:focus {}'), mockResult).string,
		'a:focus:hover {}',
	);
});

it('sorts attribute selectors', (t) => {
	t.assert.strictEqual(
		normalizeSelector(parseSelector('a[foo]#baz.bar {}'), mockResult).string,
		'a#baz.bar[foo] {}',
	);

	t.assert.strictEqual(
		normalizeSelector(parseSelector('div[foo]#bar.baz:hover::before'), mockResult).string,
		'div#bar.baz[foo]:hover::before',
	);

	t.assert.strictEqual(
		normalizeSelector(parseSelector('[foo]#bar.baz::before:hover'), mockResult).string,
		'#bar.baz[foo]::before:hover',
	);
});

it('sorts universal selector with other selectors', (t) => {
	t.assert.strictEqual(
		normalizeSelector(parseSelector('*.foo.bar'), mockResult).string,
		'*.bar.foo',
	);
});

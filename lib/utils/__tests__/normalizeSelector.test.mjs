import assert from 'node:assert/strict';
import { it } from 'node:test';

import normalizeSelector from '../normalizeSelector.mjs';
import parseSelector from '../parseSelector.mjs';

/** @type {import('stylelint').PostcssResult} */
const mockResult = {};

it('orders selectors', () => {
	assert.equal(normalizeSelector(parseSelector('.foo'), mockResult).string, '.foo');
	assert.equal(normalizeSelector(parseSelector('.foo,.bar'), mockResult).string, '.bar,.foo');

	assert.equal(normalizeSelector(parseSelector(':is(b,a)'), mockResult).string, ':is(a,b)');
	assert.equal(
		normalizeSelector(parseSelector(':is(:a(a,b),:b(c,b),:b(a,b),:a(b,c))'), mockResult).string,
		':is(:a(a,b),:a(b,c),:b(a,b),:b(b,c))',
	);
	assert.equal(
		normalizeSelector(parseSelector(':is(b,a),:is(a,c)'), mockResult).string,
		':is(a,b),:is(a,c)',
	);
	assert.equal(
		normalizeSelector(parseSelector(':is(a,c),:is(b,a)'), mockResult).string,
		':is(a,b),:is(a,c)',
	);

	assert.equal(normalizeSelector(parseSelector('::is(b,a)'), mockResult).string, '::is(a,b)');
	assert.equal(
		normalizeSelector(parseSelector('::is(::a(a,b),::b(c,b),::b(a,b),::a(b,c))'), mockResult)
			.string,
		'::is(::a(a,b),::a(b,c),::b(a,b),::b(b,c))',
	);
	assert.equal(
		normalizeSelector(parseSelector('::is(b,a),::is(a,c)'), mockResult).string,
		'::is(a,b),::is(a,c)',
	);
	assert.equal(
		normalizeSelector(parseSelector('::is(a,c),::is(b,a)'), mockResult).string,
		'::is(a,b),::is(a,c)',
	);
});

it('makes a unique set of selectors', () => {
	assert.equal(normalizeSelector(parseSelector('.foo,.foo'), mockResult).string, '.foo');
	assert.equal(normalizeSelector(parseSelector('.foo,.bar,.foo'), mockResult).string, '.bar,.foo');

	assert.equal(normalizeSelector(parseSelector(':is(a,a)'), mockResult).string, ':is(a)');
	assert.equal(normalizeSelector(parseSelector(':is(a,a),:is(a)'), mockResult).string, ':is(a)');
	assert.equal(
		normalizeSelector(parseSelector(':is(a,a),:is(b)'), mockResult).string,
		':is(a),:is(b)',
	);
	assert.equal(
		normalizeSelector(parseSelector(':is(:a(a,b),:b(b,a),:b(a,b),:a(a,b))'), mockResult).string,
		':is(:a(a,b),:b(a,b))',
	);

	assert.equal(normalizeSelector(parseSelector('::is(a,a)'), mockResult).string, '::is(a)');
	assert.equal(
		normalizeSelector(parseSelector('::is(::a(a,b),::b(b,a),::b(a,b),::a(a,b))'), mockResult)
			.string,
		'::is(::a(a,b),::b(a,b))',
	);
});

it('removes whitespace', () => {
	assert.equal(normalizeSelector(parseSelector(' a , b , c '), mockResult).string, 'a,b,c');

	assert.equal(normalizeSelector(parseSelector(' .a , .b , .c '), mockResult).string, '.a,.b,.c');

	assert.equal(normalizeSelector(parseSelector(' * , b , c '), mockResult).string, '*,b,c');
	assert.equal(normalizeSelector(parseSelector(' a , * , c '), mockResult).string, '*,a,c');
	assert.equal(normalizeSelector(parseSelector(' a , b , * '), mockResult).string, '*,a,b');

	assert.equal(normalizeSelector(parseSelector(' & , b , c '), mockResult).string, '&,b,c');
	assert.equal(normalizeSelector(parseSelector(' a , & , c '), mockResult).string, '&,a,c');
	assert.equal(normalizeSelector(parseSelector(' a , b , & '), mockResult).string, '&,a,b');

	assert.equal(
		normalizeSelector(parseSelector(' :focus , :focus-visible , :hover '), mockResult).string,
		':focus,:focus-visible,:hover',
	);
	assert.equal(
		normalizeSelector(parseSelector(' :is( a , b ) , :is( c , d ) , :is( e , f ) '), mockResult)
			.string,
		':is(a,b),:is(c,d),:is(e,f)',
	);

	assert.equal(
		normalizeSelector(parseSelector(' ::after , ::before , ::first-line '), mockResult).string,
		'::after,::before,::first-line',
	);
	assert.equal(
		normalizeSelector(parseSelector(' ::a( a , b ) , ::b( c , d ) , ::c( e , f ) '), mockResult)
			.string,
		'::a(a,b),::b(c,d),::c(e,f)',
	);

	assert.equal(
		normalizeSelector(parseSelector(' [ a = b ] , [ c = d ] , [ e = f ] '), mockResult).string,
		'[a=b],[c=d],[e=f]',
	);
	assert.equal(
		normalizeSelector(parseSelector(' [ a = b i ] , [ c = d i ] , [ e = f i ] '), mockResult)
			.string,
		'[a=b i],[c=d i],[e=f i]',
	);
	assert.equal(
		normalizeSelector(parseSelector(' [ a = "b" i ] , [ c = "d" i ] , [ e = "f" i ] '), mockResult)
			.string,
		'[a="b"i],[c="d"i],[e="f"i]',
	);

	assert.equal(
		normalizeSelector(parseSelector(' *|a , svg|a , *|* '), mockResult).string,
		'*|*,*|a,svg|a',
	);
});

it('does not remove descendant operators', () => {
	assert.equal(normalizeSelector(parseSelector(' a  b '), mockResult).string, 'a b');
	assert.equal(normalizeSelector(parseSelector(' a  >  b  c   '), mockResult).string, 'a>b c');
});

it('removes comments', () => {
	assert.equal(normalizeSelector(parseSelector(' a/* a comment */ b '), mockResult).string, 'a b');
	assert.equal(
		normalizeSelector(
			parseSelector(
				'/* a comment */:is(/* a comment */a/* a comment */,/* a comment */b/* a comment */)/* a comment */',
			),
			mockResult,
		).string,
		':is(a,b)',
	);
});

it('sorts class names and ids', () => {
	assert.equal(normalizeSelector(parseSelector('.foo.bar'), mockResult).string, '.bar.foo');
	assert.equal(normalizeSelector(parseSelector('#foo#bar'), mockResult).string, '#bar#foo');
	assert.equal(normalizeSelector(parseSelector('.foo#bar'), mockResult).string, '#bar.foo');
});

it('sorts with combinator', () => {
	assert.equal(
		normalizeSelector(parseSelector('.bar.foo > .foo#bar'), mockResult).string,
		'.bar.foo>#bar.foo',
	);
	assert.equal(
		normalizeSelector(parseSelector('.bar.foo + .foo#bar'), mockResult).string,
		'.bar.foo+#bar.foo',
	);
	assert.equal(
		normalizeSelector(parseSelector('.bar.foo ~ .foo#bar'), mockResult).string,
		'.bar.foo~#bar.foo',
	);
});

it('sorts pseudo and pseudo-element', () => {
	assert.equal(
		normalizeSelector(parseSelector('.bar.foo::before:hover {}'), mockResult).string,
		'.bar.foo::before:hover {}',
	);

	assert.equal(
		normalizeSelector(parseSelector('a:hover:focus {}'), mockResult).string,
		'a:focus:hover {}',
	);
});

it('sorts attribute selectors', () => {
	assert.equal(
		normalizeSelector(parseSelector('a[foo]#baz.bar {}'), mockResult).string,
		'a#baz.bar[foo] {}',
	);

	assert.equal(
		normalizeSelector(parseSelector('div[foo]#bar.baz:hover::before'), mockResult).string,
		'div#bar.baz[foo]:hover::before',
	);

	assert.equal(
		normalizeSelector(parseSelector('[foo]#bar.baz::before:hover'), mockResult).string,
		'#bar.baz[foo]::before:hover',
	);
});

it('sorts universal selector with other selectors', () => {
	assert.equal(normalizeSelector(parseSelector('*.foo.bar'), mockResult).string, '*.bar.foo');
});

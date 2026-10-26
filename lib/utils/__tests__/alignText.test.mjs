import { describe, it } from 'node:test';

import { alignCenter, alignLeft, alignRight } from '../alignText.mjs';

describe('alignLeft', () => {
	it('pads on the right', (t) => {
		t.assert.strictEqual(alignLeft('ab', 4), 'ab  ');
	});

	it('pads by terminal columns', (t) => {
		t.assert.strictEqual(alignLeft('简', 4), '简  ');
	});

	it('pads with the fill', (t) => {
		t.assert.strictEqual(alignLeft(':', 4, '-'), ':---');
	});

	it('does not truncate', (t) => {
		t.assert.strictEqual(alignLeft('abcdef', 4), 'abcdef');
	});
});

describe('alignRight', () => {
	it('pads on the left', (t) => {
		t.assert.strictEqual(alignRight('ab', 4), '  ab');
	});

	it('pads by terminal columns', (t) => {
		t.assert.strictEqual(alignRight('简', 4), '  简');
	});

	it('pads with the fill', (t) => {
		t.assert.strictEqual(alignRight(':', 4, '-'), '---:');
	});

	it('does not truncate', (t) => {
		t.assert.strictEqual(alignRight('abcdef', 4), 'abcdef');
	});
});

describe('alignCenter', () => {
	it('pads on both sides', (t) => {
		t.assert.strictEqual(alignCenter('ab', 4), ' ab ');
	});

	it('gives the right side the odd column', (t) => {
		t.assert.strictEqual(alignCenter('ab', 5), ' ab  ');
	});

	it('pads an empty string to the width', (t) => {
		t.assert.strictEqual(alignCenter('', 3), '   ');
	});

	it('does not truncate', (t) => {
		t.assert.strictEqual(alignCenter('abcdef', 4), 'abcdef');
	});
});

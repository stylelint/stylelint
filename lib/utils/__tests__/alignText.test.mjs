import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { alignCenter, alignLeft, alignRight } from '../alignText.mjs';

describe('alignLeft', () => {
	it('pads on the right', () => {
		assert.equal(alignLeft('ab', 4), 'ab  ');
	});

	it('pads by terminal columns', () => {
		assert.equal(alignLeft('简', 4), '简  ');
	});

	it('pads with the fill', () => {
		assert.equal(alignLeft(':', 4, '-'), ':---');
	});

	it('does not truncate', () => {
		assert.equal(alignLeft('abcdef', 4), 'abcdef');
	});
});

describe('alignRight', () => {
	it('pads on the left', () => {
		assert.equal(alignRight('ab', 4), '  ab');
	});

	it('pads by terminal columns', () => {
		assert.equal(alignRight('简', 4), '  简');
	});

	it('pads with the fill', () => {
		assert.equal(alignRight(':', 4, '-'), '---:');
	});

	it('does not truncate', () => {
		assert.equal(alignRight('abcdef', 4), 'abcdef');
	});
});

describe('alignCenter', () => {
	it('pads on both sides', () => {
		assert.equal(alignCenter('ab', 4), ' ab ');
	});

	it('gives the right side the odd column', () => {
		assert.equal(alignCenter('ab', 5), ' ab  ');
	});

	it('pads an empty string to the width', () => {
		assert.equal(alignCenter('', 3), '   ');
	});

	it('does not truncate', () => {
		assert.equal(alignCenter('abcdef', 4), 'abcdef');
	});
});

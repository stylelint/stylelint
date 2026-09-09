import { alignCenter, alignLeft, alignRight } from '../alignText.mjs';

describe('alignLeft', () => {
	it('pads on the right', () => {
		expect(alignLeft('ab', 4)).toBe('ab  ');
	});

	it('pads by terminal columns', () => {
		expect(alignLeft('简', 4)).toBe('简  ');
	});

	it('pads with the fill', () => {
		expect(alignLeft(':', 4, '-')).toBe(':---');
	});

	it('does not truncate', () => {
		expect(alignLeft('abcdef', 4)).toBe('abcdef');
	});
});

describe('alignRight', () => {
	it('pads on the left', () => {
		expect(alignRight('ab', 4)).toBe('  ab');
	});

	it('pads by terminal columns', () => {
		expect(alignRight('简', 4)).toBe('  简');
	});

	it('pads with the fill', () => {
		expect(alignRight(':', 4, '-')).toBe('---:');
	});

	it('does not truncate', () => {
		expect(alignRight('abcdef', 4)).toBe('abcdef');
	});
});

describe('alignCenter', () => {
	it('pads on both sides', () => {
		expect(alignCenter('ab', 4)).toBe(' ab ');
	});

	it('gives the right side the odd column', () => {
		expect(alignCenter('ab', 5)).toBe(' ab  ');
	});

	it('pads an empty string to the width', () => {
		expect(alignCenter('', 3)).toBe('   ');
	});

	it('does not truncate', () => {
		expect(alignCenter('abcdef', 4)).toBe('abcdef');
	});
});

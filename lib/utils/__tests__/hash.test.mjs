import hash from '../hash.mjs';

describe('hash()', () => {
	it('returns the expected value', () => {
		expect(hash('foo')).toBe('rL0Y20zC-F');
	});

	it('returns a 10-character string', () => {
		expect(hash('foo')).toHaveLength(10);
		expect(hash('')).toHaveLength(10);
		expect(hash('a very long string that exceeds normal length')).toHaveLength(10);
	});

	it('returns consistent results for the same input', () => {
		expect(hash('foo')).toBe(hash('foo'));
	});

	it('returns different results for different inputs', () => {
		expect(hash('foo')).not.toBe(hash('bar'));
	});
});

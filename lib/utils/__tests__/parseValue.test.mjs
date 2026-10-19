import parseValue from '../parseValue.mjs';

describe('parseValue', () => {
	it('parses a value with the positions of its nodes', () => {
		expect(parseValue('1px solid red')).toMatchObject({
			type: 'Value',
			loc: { start: { offset: 0 }, end: { offset: 13 } },
		});
	});

	it('returns undefined for a value that cannot be parsed', () => {
		expect(parseValue(')')).toBeUndefined();
	});
});

import { atKeywords, nestingSupportedAtKeywords } from '../atKeywords.js';

describe('atKeywords', () => {
	it('nestingSupportedAtKeywords is a subset of all atKeywords', () => {
		for (const keyword of nestingSupportedAtKeywords) {
			expect(atKeywords).toContain(keyword);
		}
	});
});

import getImportantPosition from '../getImportantPosition.mjs';

describe('getImportantPosition', () => {
	it('returns a position of "!important"', () => {
		expect(getImportantPosition('color: pink !important')).toEqual({ index: 12, endIndex: 22 });
	});

	it('returns a position of "!important" with upper-case', () => {
		expect(getImportantPosition('color: pink !IMPORTANT')).toEqual({ index: 12, endIndex: 22 });
	});

	it('returns a position of "!important" including whitespaces', () => {
		expect(getImportantPosition('color: pink !   important')).toEqual({ index: 12, endIndex: 25 });
	});

	it('returns a position of "!important" including whitespaces with upper-case', () => {
		expect(getImportantPosition('color: pink !   IMPORTANT')).toEqual({ index: 12, endIndex: 25 });
	});

	it('returns undefined if no "!important"', () => {
		expect(getImportantPosition('color: pink')).toBeUndefined();
	});

	it('returns undefined if just a "important"', () => {
		expect(getImportantPosition('color: important')).toBeUndefined();
	});

	it('returns undefined if just a typo of "!important"', () => {
		expect(getImportantPosition('color: !importanttt')).toBeUndefined();
	});
});

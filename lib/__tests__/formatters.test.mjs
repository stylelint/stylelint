import stylelint from '../index.mjs';

it('formatters are exposed on stylelint object', () => {
	expect(typeof stylelint.formatters.json).toBe('function');
});

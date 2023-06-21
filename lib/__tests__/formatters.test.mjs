import stylelint from '../index.js';

it('formatters are exposed on stylelint object', () => {
	expect(typeof stylelint.formatters.json).toBe('function');
});

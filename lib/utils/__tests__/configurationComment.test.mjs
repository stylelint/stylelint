import postcss from 'postcss';

import { extractConfigurationComment, isConfigurationComment } from '../configurationComment.js';

test('extractConfigurationComment', () => {
	expect(extractConfigurationComment(comment('stylelint-disable'))).toBe('-disable');
	expect(extractConfigurationComment(comment('stylelint-disable '))).toBe('-disable');
	expect(extractConfigurationComment(comment('stylelint-disable\t'))).toBe('-disable');
	expect(extractConfigurationComment(comment('stylelint-disable --'))).toBe('-disable');

	expect(extractConfigurationComment(comment(''))).toBe('');
	expect(extractConfigurationComment(comment(' '))).toBe('');
	expect(extractConfigurationComment(comment('\t'))).toBe('');

	expect(extractConfigurationComment(comment('stylelint-disable'), 'stylelint-2')).toBe(
		'stylelint-disable',
	);
	expect(extractConfigurationComment(comment('stylelint-2-disable'), 'stylelint-2')).toBe(
		'-disable',
	);
});

test('isConfigurationComment', () => {
	expect(isConfigurationComment(comment('stylelint-disable'))).toBe(true);
	expect(isConfigurationComment(comment('stylelint-disable-line'))).toBe(true);
	expect(isConfigurationComment(comment('stylelint-disable-next-line'))).toBe(true);
	expect(isConfigurationComment(comment('stylelint-enable'))).toBe(true);

	expect(isConfigurationComment(comment('stylelint-'))).toBe(false);
	expect(isConfigurationComment(comment('stylelint-disable-'))).toBe(false);
	expect(isConfigurationComment(comment('stylelint-disable-lineee'))).toBe(false);
	expect(isConfigurationComment(comment('stylelint-disable-next'))).toBe(false);
	expect(isConfigurationComment(comment('stylelint-enable-'))).toBe(false);
	expect(isConfigurationComment(comment(''))).toBe(false);
	expect(isConfigurationComment(comment(' '))).toBe(false);
	expect(isConfigurationComment(comment('\t'))).toBe(false);

	expect(isConfigurationComment(comment('stylelint-disable'), 'stylelint-2')).toBe(false);
	expect(isConfigurationComment(comment('stylelint-2-disable'), 'stylelint-2')).toBe(true);
});

function comment(text) {
	return postcss.comment({ text });
}

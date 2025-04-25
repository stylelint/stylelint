import postcss from 'postcss';

import { extractConfigurationComment, isConfigurationComment } from '../configurationComment.mjs';

test('extractConfigurationComment', () => {
	expect(extractConfigurationComment('stylelint-disable')).toBe('-disable');
	expect(extractConfigurationComment('stylelint-disable ')).toBe('-disable');
	expect(extractConfigurationComment('stylelint-disable\t')).toBe('-disable');
	expect(extractConfigurationComment('stylelint-disable --')).toBe('-disable');

	expect(extractConfigurationComment('')).toBe('');
	expect(extractConfigurationComment(' ')).toBe('');
	expect(extractConfigurationComment('\t')).toBe('');

	expect(extractConfigurationComment('stylelint-disable', 'stylelint-2')).toBe('stylelint-disable');
	expect(extractConfigurationComment('stylelint-2-disable', 'stylelint-2')).toBe('-disable');
});

test('isConfigurationComment', () => {
	expect(isConfigurationComment('stylelint-disable')).toBe(true);
	expect(isConfigurationComment('stylelint-disable-line')).toBe(true);
	expect(isConfigurationComment('stylelint-disable-next-line')).toBe(true);
	expect(isConfigurationComment('stylelint-enable')).toBe(true);

	expect(isConfigurationComment('stylelint-')).toBe(false);
	expect(isConfigurationComment('stylelint-disable-')).toBe(false);
	expect(isConfigurationComment('stylelint-disable-lineee')).toBe(false);
	expect(isConfigurationComment('stylelint-disable-next')).toBe(false);
	expect(isConfigurationComment('stylelint-enable-')).toBe(false);
	expect(isConfigurationComment('')).toBe(false);
	expect(isConfigurationComment(' ')).toBe(false);
	expect(isConfigurationComment('\t')).toBe(false);

	expect(isConfigurationComment('stylelint-disable', 'stylelint-2')).toBe(false);
	expect(isConfigurationComment('stylelint-2-disable', 'stylelint-2')).toBe(true);
});

test('isConfigurationComment for Comment node', () => {
	const commentNode = (text) => postcss.comment({ text });

	expect(isConfigurationComment(commentNode('stylelint-disable'))).toBe(true);
	expect(isConfigurationComment(commentNode('foo'))).toBe(false);
	expect(isConfigurationComment(commentNode('stylelint-2-disable'), 'stylelint-2')).toBe(true);

	// Non-comment node
	expect(isConfigurationComment(postcss.atRule())).toBe(false);
});

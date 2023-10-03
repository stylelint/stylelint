import postcss from 'postcss';
import postcssPlugin from '../postcssPlugin.mjs';

it('`defaultSeverity` option set to warning', async () => {
	const config = {
		defaultSeverity: 'warning',
		rules: {
			'block-no-empty': true,
		},
	};

	const result = await postcss([postcssPlugin(config)]).process('a {}', { from: undefined });

	expect(result.warnings()).toMatchObject([
		expect.objectContaining({
			text: expect.stringContaining('block-no-empty'),
			severity: 'warning',
		}),
	]);
});

it('`defaultSeverity` option set to warning, and a functional severity returns `null`', async () => {
	const config = {
		defaultSeverity: 'warning',
		rules: {
			'block-no-empty': [
				true,
				{
					severity: () => null,
				},
			],
		},
	};

	const result = await postcss([postcssPlugin(config)]).process('a {}', { from: undefined });

	expect(result.warnings()).toMatchObject([
		expect.objectContaining({
			text: expect.stringContaining('block-no-empty'),
			severity: 'warning',
		}),
	]);
});

it('`defaultSeverity` option is absent, and a functional severity returns `null`', async () => {
	const config = {
		rules: {
			'block-no-empty': [
				true,
				{
					severity: () => null,
				},
			],
		},
	};

	const result = await postcss([postcssPlugin(config)]).process('a {}', { from: undefined });

	expect(result.warnings()).toMatchObject([
		expect.objectContaining({
			text: expect.stringContaining('block-no-empty'),
			severity: 'error',
		}),
	]);
});

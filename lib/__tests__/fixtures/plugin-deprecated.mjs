import stylelint from '../../index.mjs';

const ruleName = 'plugin/deprecated';

const deprecated = () => (root, result) => {
	// Not a rule deprecation, so it's only reported in the results
	result.warn('Some deprecation', { stylelintType: 'deprecation' });
};

deprecated.ruleName = ruleName;
deprecated.meta = { deprecated: true };

export default stylelint.createPlugin(ruleName, deprecated);

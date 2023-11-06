import jestPreset from 'jest-preset-stylelint';

const { getTestRule, getTestRuleConfigs } = jestPreset;

const loadLint = () => import('./lib/index.mjs').then((m) => m.default.lint);

global.testRule = getTestRule({ loadLint });
global.testRuleConfigs = getTestRuleConfigs({ loadLint });

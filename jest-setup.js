'use strict';

const getTestRule = require('jest-preset-stylelint/getTestRule');
const stylelint = require('./lib');

jest.mock('./lib/utils/getOsEol', () => () => '\n');

global.testRule = getTestRule(stylelint);

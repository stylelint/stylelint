'use strict';

const conditionallyCheckColorHexCase = require('./plugin-conditionally-check-color-hex-case');
const warnAboutFoo = require('./plugin-warn-about-foo');

module.exports = [conditionallyCheckColorHexCase, warnAboutFoo];

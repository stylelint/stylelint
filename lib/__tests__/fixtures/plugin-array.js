'use strict';

const conditionallyCheckColorNamed = require('./plugin-conditionally-check-color-named');
const warnAboutFoo = require('./plugin-warn-about-foo');

module.exports = [conditionallyCheckColorNamed, warnAboutFoo];

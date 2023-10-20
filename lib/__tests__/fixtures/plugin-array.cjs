'use strict';

const conditionallyCheckColorNamed = require('./plugin-conditionally-check-color-named.cjs');
const warnAboutFoo = require('./plugin-warn-about-foo.cjs');

module.exports = [conditionallyCheckColorNamed, warnAboutFoo];

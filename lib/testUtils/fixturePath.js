'use strict';

const path = require('path');

/**
 * @param {...string} parts
 * @param {string} base
 * @returns {string}
 * @todo replace base argument by callsite or parent-module
 */
module.exports = (base, ...parts) => path.join(base, 'fixtures', ...parts);

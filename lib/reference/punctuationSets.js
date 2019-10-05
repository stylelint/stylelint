'use strict';

/** @type {{mediaFeaturePunctuation: Set<string>, nonSpaceCombinators: Set<string>}} */
const punctuationSets = {};

punctuationSets.mediaFeaturePunctuation = new Set([':', '=', '>', '>=', '<', '<=']);

punctuationSets.nonSpaceCombinators = new Set(['>', '+', '~', '>>>', '/deep/']);

module.exports = punctuationSets;

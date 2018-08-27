/* @flow */
"use strict";

const _ = require("lodash");
const chalk = require("chalk");
const EOL = require("os").EOL;
const leven = require("leven");

/*:: type allowedOptionsType = { [key: string]: { alias?: string } }*/

const buildAllowedOptions = (allowedOptions /*: allowedOptionsType */) => {
  let options = Object.keys(allowedOptions);
  options = options.reduce((opts, opt) => {
    const alias = allowedOptions[opt].alias;
    if (alias) {
      opts.push(alias);
    }
    return opts;
  }, options);
  options.sort();
  return options;
};

const suggest = (all /*: string[]*/, invalid /*: string*/) => {
  const sameLength = all.filter(option => option.length === invalid.length);
  let suggestion = sameLength.find(option => leven(option, invalid) <= 1);
  if (!suggestion) {
    suggestion = sameLength.find(option => leven(option, invalid) <= 2);
  }
  if (!suggestion) {
    suggestion = all.find(option => leven(option, invalid) <= 2);
  }
  if (!suggestion) {
    suggestion = all.find(option => leven(option, invalid) <= 3);
  }
  return suggestion;
};

const cliOption = (opt /*: string*/) =>
  opt.length === 1 ? `"-${opt}"` : `"--${_.kebabCase(opt)}"`;

const buildMessageLine = (invalid /*: string*/, suggestion /*: ?string*/) => {
  let line = `Invalid option ${chalk.red(cliOption(invalid))}.`;
  if (suggestion) {
    line += ` Did you mean ${chalk.cyan(cliOption(suggestion))}?`;
  }
  return line + EOL;
};

module.exports = function checkInvalidCLIOptions(
  allowedOptions /*: { [key: string]: any }*/,
  inputOptions /*: { [key: string]: any }*/
) /*: string*/ {
  const allOptions = buildAllowedOptions(allowedOptions);

  return Object.keys(inputOptions)
    .map(opt => _.kebabCase(opt))
    .filter(opt => !allOptions.includes(opt))
    .reduce((msg, invalid) => {
      const suggestion = suggest(allOptions, invalid);
      return msg + buildMessageLine(invalid, suggestion);
    }, "");
};

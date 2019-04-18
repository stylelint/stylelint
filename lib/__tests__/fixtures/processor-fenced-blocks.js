"use strict";

const execall = require("execall");

module.exports = function() {
  const options =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  const specialMessage = options.specialMessage || "was processed";

  return {
    code(input) {
      const blocks = execall(/```start([\s\S]+?)```end/g, input);
      const toLint = blocks.map(match => match.subMatches[0]).join("\n\n");

      return toLint;
    },
    result(stylelintResult) {
      return Object.assign({}, stylelintResult, { specialMessage });
    }
  };
};

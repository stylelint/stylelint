"use strict";

const fs = require("fs");
const jison = require("jison-gho");

let parser;

module.exports = function(exp) {
  if (!parser) {
    const parserConfig = fs.readFileSync(
      require.resolve("./parser.jison"),
      "utf8"
    );

    parser = new jison.Parser(parserConfig);
  }

  return parser.parse(exp);
};

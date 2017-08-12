/* @flow */
"use strict";

module.exports = function(statement /*: postcss$node*/) /*: boolean*/ {
  const parentNode = statement.parent;

  return (
    parentNode !== undefined &&
    parentNode.type !== "root" &&
    statement === parentNode.first
  );
};

/* @flow */
"use strict";

/**
 * Compute levenshtein distance, see https://en.wikipedia.org/wiki/Levenshtein_distance for more info
 * @param {string} firstStr first string
 * @param {string} secondStr second string
 * @param {number} [maxDistance=99] maximum distance, if distance is greater then returns -1
 * @returns {number} computed distance
 */
module.exports = function levenshteinDistance(
  firstStr /*: string*/,
  secondStr /*: string*/,
  maxDistance /*: number*/ = 99
) /*: number*/ {
  if (Math.abs(firstStr.length - secondStr.length) > maxDistance) return -1;

  if (firstStr.length === 0 || secondStr.length === 0)
    return firstStr.length || secondStr.length;

  let line = new Uint32Array(firstStr.length + 1);

  for (let i = 0; i < line.length; i++) {
    line[i] = i;
  }

  for (let i = 0; i < secondStr.length; i++) {
    const newLine = line.slice();

    newLine[0] = i + 1;
    let min = newLine[0];

    for (let j = 1; j < line.length; j++) {
      newLine[j] = Math.min(
        line[j - 1] + (secondStr[i] === firstStr[j - 1] ? 0 : 1),
        line[j] + 1,
        newLine[j - 1] + 1
      );

      if (newLine[j] < min) min = newLine[j];
    }

    if (min > maxDistance) {
      return -1;
    }

    line = newLine;
  }

  return line[line.length - 1] > maxDistance ? -1 : line[line.length - 1];
};

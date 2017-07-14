/* flow */
"use strict";

const isAfterCommentLine = require("../isAfterCommentLine");
const postcss = require("postcss");

describe("isAfterCommentLine", () => {
  it("returns true when after a single-line comment", () => {
    const root = postcss.parse(`
      /* comment */
      foo {}
    `);
    expect(isAfterCommentLine(root.nodes[1])).toBe(true);
  });

  it("returns true when after a multi-line comment", () => {
    const root = postcss.parse(`
      /* comment
         and more comment */
      foo {}
    `);
    expect(isAfterCommentLine(root.nodes[1])).toBe(true);
  });

  it("returns false when after a shared-line comment", () => {
    const root = postcss.parse(`
      bar {} /* comment */
      foo {}
    `);
    expect(isAfterCommentLine(root.nodes[2])).toBe(false);
  });

  it("returns false when after a non-comment node", () => {
    const root = postcss.parse(`
      bar {}
      foo {}
    `);
    expect(isAfterCommentLine(root.nodes[1])).toBe(false);
  });

  it("returns false when after no nodes", () => {
    const root = postcss.parse(`
      foo {}
    `);
    expect(isAfterCommentLine(root.nodes[0])).toBe(false);
  });
});

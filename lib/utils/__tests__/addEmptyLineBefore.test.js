"use strict";

const addEmptyLineBefore = require("../addEmptyLineBefore");
const postcss = require("postcss");

describe("addEmptyLineBefore", () => {
  it("adds single newline to the newline at the beginning", () => {
    return postcss()
      .process("a {}\n  b{}", { from: undefined })
      .then(result => {
        addEmptyLineBefore(result.root.nodes[1], "\n");
        expect(result.root.toString()).toBe("a {}\n\n  b{}");
      });
  });

  it("adds single newline to newline at the beginning with CRLF", () => {
    return postcss()
      .process("a {}\r\n  b{}", { from: undefined })
      .then(result => {
        addEmptyLineBefore(result.root.nodes[1], "\r\n");
        expect(result.root.toString()).toBe("a {}\r\n\r\n  b{}");
      });
  });

  it("adds single newline to newline at the end", () => {
    return postcss()
      .process("a {}\t\nb{}", { from: undefined })
      .then(result => {
        addEmptyLineBefore(result.root.nodes[1], "\n");
        expect(result.root.toString()).toBe("a {}\t\n\nb{}");
      });
  });

  it("adds single newline to newline at the end with CRLF", () => {
    return postcss()
      .process("a {}\t\r\nb{}", { from: undefined })
      .then(result => {
        addEmptyLineBefore(result.root.nodes[1], "\r\n");
        expect(result.root.toString()).toBe("a {}\t\r\n\r\nb{}");
      });
  });

  it("adds single newline to newline in the middle", () => {
    return postcss()
      .process("a {}  \n\tb{}", { from: undefined })
      .then(result => {
        addEmptyLineBefore(result.root.nodes[1], "\n");
        expect(result.root.toString()).toBe("a {}  \n\n\tb{}");
      });
  });

  it("adds single newline to newline in the middle with CRLF", () => {
    return postcss()
      .process("a {}  \r\n\tb{}", { from: undefined })
      .then(result => {
        addEmptyLineBefore(result.root.nodes[1], "\r\n");
        expect(result.root.toString()).toBe("a {}  \r\n\r\n\tb{}");
      });
  });

  it("adds two newlines if there aren't any existing newlines", () => {
    return postcss()
      .process("a {}  b{}", { from: undefined })
      .then(result => {
        addEmptyLineBefore(result.root.nodes[1], "\n");
        expect(result.root.toString()).toBe("a {}\n\n  b{}");
      });
  });

  it("adds two newlines if there aren't any existing newlines with CRLF", () => {
    return postcss()
      .process("a {}  b{}", { from: undefined })
      .then(result => {
        addEmptyLineBefore(result.root.nodes[1], "\r\n");
        expect(result.root.toString()).toBe("a {}\r\n\r\n  b{}");
      });
  });
});

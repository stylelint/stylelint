"use strict";

const postcss = require("postcss");
const removeEmptyLinesBefore = require("../removeEmptyLinesBefore");

describe("removeEmptyLinesBefore", () => {
  it("removes single newline from the newline at the beginning", () => {
    return postcss()
      .process("a {}\n\n  b{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\n");
        expect(result.root.toString()).toBe("a {}\n  b{}");
      });
  });

  it("removes single newline from newline at the beginning with CRLF", () => {
    return postcss()
      .process("a {}\r\n\r\n  b{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\r\n");
        expect(result.root.toString()).toBe("a {}\r\n  b{}");
      });
  });

  it("removes single newline from newline at the end", () => {
    return postcss()
      .process("a {}\t\n\nb{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\n");
        expect(result.root.toString()).toBe("a {}\t\nb{}");
      });
  });

  it("removes single newline from newline at the end with CRLF", () => {
    return postcss()
      .process("a {}\t\r\n\r\nb{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\r\n");
        expect(result.root.toString()).toBe("a {}\t\r\nb{}");
      });
  });

  it("removes single newline from newline in the middle", () => {
    return postcss()
      .process("a {}  \n\n\tb{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\n");
        expect(result.root.toString()).toBe("a {}  \n\tb{}");
      });
  });

  it("removes single newline to newline in the middle with CRLF", () => {
    return postcss()
      .process("a {}  \r\n\r\n\tb{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\r\n");
        expect(result.root.toString()).toBe("a {}  \r\n\tb{}");
      });
  });

  it("removes two newlines if there are three newlines", () => {
    return postcss()
      .process("a {}\n\n\n  b{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\n");
        expect(result.root.toString()).toBe("a {}\n  b{}");
      });
  });

  it("removes two newlines if there are three newlines with CRLF", () => {
    return postcss()
      .process("a {}\r\n\r\n\r\n  b{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\r\n");
        expect(result.root.toString()).toBe("a {}\r\n  b{}");
      });
  });

  it("removes three newlines if there are four newlines", () => {
    return postcss()
      .process("a {}\n\n\n\n  b{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\n");
        expect(result.root.toString()).toBe("a {}\n  b{}");
      });
  });

  it("removes three newlines if there are four newlines with CRLF", () => {
    return postcss()
      .process("a {}\r\n\r\n\r\n\r\n  b{}")
      .then(result => {
        removeEmptyLinesBefore(result.root.nodes[1], "\r\n");
        expect(result.root.toString()).toBe("a {}\r\n  b{}");
      });
  });
});

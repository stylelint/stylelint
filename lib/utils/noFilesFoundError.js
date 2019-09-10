"use strict";

const isWin = process.platform === "win32";

class NoFilesFoundError extends Error {
  constructor(fileList) {
    super();

    if (typeof fileList === "string") {
      fileList = [fileList];
    }

    const pattern = fileList
      .filter(i => !i.startsWith("!"))
      .map(file => (isWin ? file.replace(/\//g, "\\") : file))
      .join(", ");

    this.message = `No files matching the pattern "${pattern}" were found.`;
  }
}

module.exports = NoFilesFoundError;

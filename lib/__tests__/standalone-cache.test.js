"use strict";

const hash = require("../utils/hash");
const path = require("path");
const standalone = require("../standalone");
const fixturesPath = path.join(__dirname, "fixtures");
const fs = require("fs");
const pify = require("pify");
const readFile = pify(fs.readFile);
const unlink = pify(fs.unlink);
const cpFile = require("cp-file");
const fileExists = require("file-exists-promise");

const cwd = process.cwd();
const invalidFile = path.join(fixturesPath, "empty-block.css");
const syntaxErrorFile = path.join(fixturesPath, "syntax_error.css");
const validFile = path.join(fixturesPath, "cache", "valid.css");
const newFileDest = path.join(fixturesPath, "cache", "newFile.css");

// Config object is getting mutated internally.
// Return new object of the same structure to
// make sure config doesn't change between runs.
function getConfig() {
  return {
    files: path.join(fixturesPath, "cache", "*.css"),
    config: {
      rules: { "block-no-empty": true, "color-no-invalid-hex": true }
    },
    cache: true
  };
}

describe("standalone cache", () => {
  const expectedCacheFilePath = path.join(cwd, ".stylelintcache");

  beforeEach(() => {
    // Initial run to warm up the cache
    return standalone(getConfig());
  });

  afterEach(() => {
    // Clean up after each test case
    return Promise.all([
      unlink(expectedCacheFilePath).catch(() => {
        // fs.unlink() throws an error if file doesn't exist and it's ok. We just
        // want to make sure it's not there for next test.
      }),
      unlink(newFileDest).catch(() => {
        // fs.unlink() throws an error if file doesn't exist and it's ok. We just
        // want to make sure it's not there for next test.
      })
    ]);
  });

  it("cache file is created at $CWD/.stylelintcache", () => {
    // Ensure cache file exists
    return fileExists(expectedCacheFilePath)
      .then(isFileExist => {
        expect(!!isFileExist).toBe(true);

        return readFile(expectedCacheFilePath, "utf8");
      })
      .then(fileContents => {
        return JSON.parse(fileContents);
      })
      .then(cacheFile => {
        // Ensure cache file contains only linted css file
        expect(typeof cacheFile[validFile] === "object").toBe(true);
        expect(typeof cacheFile[newFileDest] === "undefined").toBe(true);
      });
  });

  it("only changed files are linted", () => {
    // Add "changed" file
    return cpFile(validFile, newFileDest)
      .then(() => {
        // Next run should lint only changed files
        return standalone(getConfig());
      })
      .then(output => {
        // Ensure only changed files are linted
        const isValidFileLinted = !!output.results.find(
          file => file.source === validFile
        );
        const isNewFileLinted = !!output.results.find(
          file => file.source === newFileDest
        );

        expect(isValidFileLinted).toBe(false);
        expect(isNewFileLinted).toBe(true);

        // Ensure cache file contains linted css files
        return readFile(expectedCacheFilePath, "utf8");
      })
      .then(fileContents => {
        return JSON.parse(fileContents);
      })
      .then(cachedFiles => {
        expect(typeof cachedFiles[validFile] === "object").toBe(true);
        expect(typeof cachedFiles[newFileDest] === "object").toBe(true);
      });
  });

  it("all files are linted on config change", () => {
    const changedConfig = getConfig();

    changedConfig.config.rules["block-no-empty"] = false;

    return cpFile(validFile, newFileDest)
      .then(() => {
        // All file should be re-linted as config has changed
        return standalone(changedConfig);
      })
      .then(output => {
        // Ensure all files are re-linted
        const isValidFileLinted = !!output.results.find(
          file => file.source === validFile
        );
        const isNewFileLinted = !!output.results.find(
          file => file.source === newFileDest
        );

        expect(isValidFileLinted).toBe(true);
        expect(isNewFileLinted).toBe(true);
      });
  });

  it("invalid files are not cached", () => {
    return cpFile(invalidFile, newFileDest)
      .then(() => {
        // Should lint only changed files
        return standalone(getConfig());
      })
      .then(output => {
        expect(output.errored).toBe(true);
        // Ensure only changed files are linted
        const isValidFileLinted = !!output.results.find(
          file => file.source === validFile
        );
        const isInvalidFileLinted = !!output.results.find(
          file => file.source === newFileDest
        );

        expect(isValidFileLinted).toBe(false);
        expect(isInvalidFileLinted).toBe(true);

        // Ensure cache file doesn't contain invalid file
        return readFile(expectedCacheFilePath, "utf8");
      })
      .then(fileContents => {
        return JSON.parse(fileContents);
      })
      .then(cachedFiles => {
        expect(typeof cachedFiles[validFile] === "object").toBe(true);
        expect(typeof cachedFiles[newFileDest] === "undefined").toBe(true);
      });
  });
  it("files with syntax errors are not cached", () => {
    return cpFile(syntaxErrorFile, newFileDest)
      .then(() => {
        // Should lint only changed files
        return standalone(getConfig());
      })
      .then(() => {
        return readFile(expectedCacheFilePath, "utf8");
      })
      .then(fileContents => {
        const cachedFiles = JSON.parse(fileContents);

        expect(typeof cachedFiles[validFile] === "object").toBe(true);
        expect(typeof cachedFiles[newFileDest] === "undefined").toBe(true);
      });
  });
  it("cache file is removed when cache is disabled", () => {
    const noCacheConfig = getConfig();

    noCacheConfig.cache = false;
    let cacheFileExists = true;

    return standalone(noCacheConfig).then(() => {
      return fileExists(expectedCacheFilePath)
        .then(() => {
          throw new Error(
            `Cache file is supposed to be removed, ${expectedCacheFilePath} is found instead`
          );
        })
        .catch(() => {
          cacheFileExists = false;
          expect(cacheFileExists).toBe(false);
        });
    });
  });
  it("cache doesn't do anything if string is passed", () => {
    const config = {
      code: ".foo {}",
      codeFilename: "foo.css",
      cache: true,
      config: {
        rules: {
          "color-no-invalid-hex": true
        }
      }
    };
    let cacheFileExists = true;

    return standalone(config).then(lintResults => {
      expect(lintResults.errored).toBe(false);

      return fileExists(expectedCacheFilePath)
        .then(() => {
          throw new Error(
            `Cache file should not be created if string is passed, ${expectedCacheFilePath} is found instead`
          );
        })
        .catch(() => {
          cacheFileExists = false;
          expect(cacheFileExists).toBe(false);
        });
    });
  });
});
describe("standalone cache uses cacheLocation", () => {
  const cacheLocationFile = path.join(fixturesPath, "cache", ".cachefile");
  const cacheLocationDir = path.join(fixturesPath, "cache");
  const expectedCacheFilePath = path.join(
    cacheLocationDir,
    `.stylelintcache_${hash(cwd)}`
  );

  afterEach(() => {
    // clean up after each test
    return Promise.all([
      unlink(expectedCacheFilePath).catch(() => {
        // fs.unlink() throws an error if file doesn't exist and it's ok. We just
        // want to make sure it's not there for next test.
      }),
      unlink(cacheLocationFile).catch(() => {
        // fs.unlink() throws an error if file doesn't exist and it's ok. We just
        // want to make sure it's not there for next test.
      })
    ]);
  });
  it("cacheLocation is a file", () => {
    const config = getConfig();

    config.cacheLocation = cacheLocationFile;

    return standalone(config)
      .then(() => {
        // Ensure cache file is created
        return fileExists(cacheLocationFile);
      })
      .then(fileStats => {
        expect(!!fileStats).toBe(true);

        // Ensure cache file contains cached entity
        return readFile(cacheLocationFile, "utf8");
      })
      .then(fileContents => {
        return JSON.parse(fileContents);
      })
      .then(cacheFile => {
        expect(typeof cacheFile[validFile] === "object").toBe(true);
      });
  });
  it("cacheLocation is a directory", () => {
    const config = getConfig();

    config.cacheLocation = cacheLocationDir;

    return standalone(config)
      .then(() => {
        return fileExists(expectedCacheFilePath);
      })
      .then(cacheFileStats => {
        // Ensure cache file is created
        expect(!!cacheFileStats).toBe(true);

        // Ensure cache file contains cached entity
        return readFile(expectedCacheFilePath, "utf8");
      })
      .then(fileContents => {
        return JSON.parse(fileContents);
      })
      .then(cacheFile => {
        expect(typeof cacheFile[validFile] === "object").toBe(true);
      });
  });
});

import path from "path"
import pluginWarnAboutFoo from "./fixtures/plugin-warn-about-foo"
import stylelint from ".."
import test from "tape"

test("createLinter().getConfigForFile", t => {
  const linter = stylelint.createLinter()
  const filepath = path.join(__dirname, "fixtures/getConfigForFile/a/b/foo.css")
  linter.getConfigForFile(filepath).then((result) => {
    t.deepEqual(result, {
      config: {
        plugins: [path.join(__dirname, "/fixtures/plugin-warn-about-foo.js")],
        rules: {
          "block-no-empty": [true],
          "plugin/warn-about-foo": ["always"],
        },
        pluginFunctions: {
          "plugin/warn-about-foo": pluginWarnAboutFoo.rule,
        },
      },
      filepath: path.join(__dirname, "fixtures/getConfigForFile/a/.stylelintrc"),
    }, "augmented config loads")
    t.end()
  }).catch(t.end)
})

test("createLinter().isPathIgnored", t => {
  const config = {
    ignoreFiles: [
      "**/*.css",
      "!**/invalid-hex.css",
    ],
    rules: { "block-no-empty": true },
  }
  const linter = stylelint.createLinter({ config })

  t.test(st => {
    linter.isPathIgnored("a.css").then((result) => {
      st.equal(result, true)
      st.end()
    }).catch(st.end)
  })

  t.test(st => {
    linter.isPathIgnored("foo/bar/baz.css").then((result) => {
      st.equal(result, true)
      st.end()
    }).catch(st.end)
  })

  t.test(st => {
    linter.isPathIgnored("foo/bar/baz.scss").then((result) => {
      st.equal(result, false)
      st.end()
    }).catch(st.end)
  })

  t.test(st => {
    linter.isPathIgnored("foo/invalid-hex.css").then((result) => {
      st.equal(result, false)
      st.end()
    }).catch(st.end)
  })

  t.end()
})

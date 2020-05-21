# Web Browser (experimental)

You can use stylelint in the browser using the experimental ES module (ESM) bundle.

The ESM bundle supports a subset of the [Node API](./node-api.md)'s functionality. The `code` and `config` options are required values.

Notably the ESM bundle has _no_ support for config files, ignore files, CLI usage, plugins or custom rules. Custom syntaxes are supported by manually passing them in to stylelint.

An example:

```html
<html>
  <head>
    <script type="module">
      import sl from "./stylelint-esm.js";

      async function run() {
        const options = {
          code: `a { color: #fff; }`,
          config: {
            rules: {
              "color-hex-length": "long"
            }
          }
        };

        const result = await sl.lint(options);
        console.log(result);
      }

      run();
    </script>
  </head>
  <body></body>
</html>
```

### Formatters

JSON formatter only. No other formatters supported (for now)

TODO: expand this section

### Syntaxes

Stylelint's default CSS syntax is available by default.

Syntax bundles can be large. Therefore custom syntaxes (SCSS, Less, CSS-in-JSS, etc) must be loaded manually. Bundles are provided for all officially supported syntaxes. [View the examples for more details](TODO).

TODO: expand this section

## Options

Stylelint's browser bundle supports a subset of the Node API's options. The following options are supported:

- [code]() (required, must be a string)
- [config](../configure.md) (required, must be an object)
- [customSyntax](../configure.md) (optional, if used it must be an object)
- [fix]()
- [maxWarnings]()
- [ignoreDisables]()
- [reportNeedlessDisables]()
- [reportInvalidScopeDisables]()

## The returned promise

The return value has the same format as [the Node API's return value]().

## Usage examples

### Example A - default syntax

Linting a plain CSS string.

```html
<html>
  <head>
    <script type="module">
      import sl from "./stylelint-esm.js";

      async function run() {
        const options = {
          code: `a { color: #fff; }`,
          config: {
            rules: {
              "color-hex-length": "long"
            }
          }
        };

        const result = await sl.lint(options);
        console.log(result);
      }

      run();
    </script>
  </head>
  <body></body>
</html>
```

### Example B - SCSS syntax

Linting an SCSS string, using the `syntax-scss` custom parser.

```html
<html>
  <head>
    <title>demo demo demo</title>
    <script type="module">
      import sl from "./stylelint-esm.js";
      import syntaxScss from "./syntax-scss.js";

      async function run() {
        const options = {
          code: `a.#{var} { color: #fff; }`,
          config: {
            rules: {
              "color-hex-length": "long"
            }
          },
          customSyntax: syntaxScss
        };

        const result = await sl.lint(options);
        console.log(result);
      }

      run();
    </script>
  </head>
  <body></body>
</html>
```

### Example C - loading syntaxes on-demand

Load any custom syntax on demand. You can [view this example online](http://stylelint-browser-bundle.netlify.app/).

```html
<html>
  <head> </head>
  <body>
    <h1>stylelint</h1>
    <p>Edit code or config to see updated results</p>
    <label for="syntax">Select syntax:</label>
    <select name="syntax" id="syntax">
      <option value="css">css</option>
      <option value="./syntax-css-in-js.js">css-in-js</option>
      <option value="./syntax-html.js">html</option>
      <option value="./syntax-less.js">less</option>
      <option value="./syntax-markdown.js">markdown</option>
      <option value="./syntax-sass.js">sass</option>
      <option value="./syntax-scss.js">scss</option>
      <option value="./syntax-sugarss.js">sugarss</option>
    </select>
    <h2>code</h2>
    <textarea id="code" style="width: 100%; height: 200px;">
a {color: #FFF; }
		</textarea
    >
    <h2>config</h2>
    <textarea id="config" style="width: 100%; height: 200px;">
{
	"rules": {
		"color-hex-length": "long",
		"at-rule-no-vendor-prefix": true
	}
}
		</textarea
    >
    <h2>results</h2>
    <code id="results" style="white-space: pre;"></code>
    <script type="module">
      import sl from "./stylelint-esm.js";

      async function main() {
        const syntaxEl = document.querySelector("#syntax");
        const codeEl = document.querySelector("#code");
        const configEl = document.querySelector("#config");
        const resultsEl = document.querySelector("#results");
        let syntaxCache = {};
        let selectedSyntax;

        syntaxEl.addEventListener("change", setSyntax);
        codeEl.addEventListener("keyup", lint);
        configEl.addEventListener("keyup", lint);

        /* Load cached or remote syntax parser */
        async function setSyntax(event) {
          selectedSyntax =
            event.target.value === "css" ? null : event.target.value;
          if (selectedSyntax === null) {
            lint();
            return;
          }

          if (syntaxCache[selectedSyntax]) {
            lint();
          } else {
            resultsEl.textContent = `Loading syntax: ${selectedSyntax}`;
            const syntax = await import(selectedSyntax);
            syntaxCache[selectedSyntax] = syntax.default;
            lint();
          }
        }

        async function lint() {
          let results;
          try {
            const options = {
              code: codeEl.value,
              config: JSON.parse(`[${configEl.value}]`)[0]
            };

            if (selectedSyntax && syntaxCache[selectedSyntax]) {
              options.customSyntax = syntaxCache[selectedSyntax];
            }
            results = await sl.lint(options);
          } catch (error) {
            resultsEl.textContent = error;
          }

          try {
            resultsEl.textContent = JSON.stringify(results, null, 4);
          } catch (error) {
            console.log("Stringify error", error); // sometimes results is too large to stringify, throwing a RangeError
            console.log(
              "showing results.output instead of full results object"
            );
            resultsEl.textContent = JSON.stringify(
              JSON.parse(results.output),
              null,
              4
            );
          }
        }

        lint();
      }

      main();
    </script>
  </body>
</html>
```

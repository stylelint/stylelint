# Writing processors

Processors are functions that hook into stylelint's pipeline, modifying code on its way into stylelint and modifying results on their way out.

*Processors can only be used with the CLI and the Node API, not with the PostCSS plugin.*

Processor modules are functions that return an object with the following properties. The properties are functions that hook into the processing of each file.

- **code**: A function that accepts two arguments, the file's code and the file's path, and returns a string for stylelint to lint.
- **result**: A function that accepts two arguments, the file's stylelint result object and the file's path, and either mutates the result object (returning nothing) or returns a new one.

Processors can enable stylelint to lint the CSS within non-stylesheet files. For example, let's say you want to lint the CSS within `<style>` tags in HTML. If you just feed stylelint your HTML code, you'll run into problems, because PostCSS does not parse HTML. Instead, you can create a processor that does the following:

- In the `code` processor function, extract CSS from the `<style>` tags in the HTML code. Return a CSS string, which is what stylelint will inspect.
- Build a sourcemap while performing that extraction, so warning positions can be tailored to match the original source HTML.
- In the `result` processor function, modify the line/column position of each warning using your sourcemap.

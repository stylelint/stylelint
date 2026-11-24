# Getting started

Quickly get started by installing and extending an appropriate shared config with your preferred package manager, e.g. [Bun](https://bun.sh/package-manager), [npm](https://docs.npmjs.com/about-npm/), [pnpm](https://pnpm.io/) or [Yarn](https://yarnpkg.com/). We used [`npm`](https://docs.npmjs.com/about-npm/) and [`npx`](https://docs.npmjs.com/cli/commands/npx) below.

## Linting CSS

Use [our `create` tool](https://www.npmjs.com/package/create-stylelint) to automatically set up Stylelint and extend [our standard config](https://www.npmjs.com/package/stylelint-config-standard):

```shell
npm create stylelint@latest
```

<details>
<summary>Alternative manual setup</summary>

1. Create a `stylelint.config.mjs` configuration file in the root of your project with the following content:
   ```js
   /** @type {import('stylelint').Config} */
   export default {
     extends: ["stylelint-config-standard"]
   };
   ```
2. Add the related dependencies:
   ```shell
   npm add -D stylelint stylelint-config-standard
   ```
3. Run Stylelint on all the CSS files in your project:
   ```shell
   npx stylelint "**/*.css"
   ```

</details>

Once you're up and running, you can [customize](customize.md) Stylelint.

## Linting CSS-like languages and CSS within containers

Extend a community config to lint:

- CSS-like languages, e.g. SCSS, Sass and Less
- CSS within containers, e.g. in HTML, CSS-in-JS and Vue SFCs

For example, to lint SCSS, extend the [SCSS community config](https://www.npmjs.com/package/stylelint-config-standard-scss):

1. Create a `stylelint.config.mjs` configuration file in the root of your project with the following content:
   ```js
   /** @type {import('stylelint').Config} */
   export default {
     extends: ["stylelint-config-standard-scss"]
   };
   ```
2. Add the related dependencies:
   ```shell
   npm add -D stylelint stylelint-config-standard-scss
   ```
3. Run Stylelint on all the SCSS files in your project:
   ```shell
   npx stylelint "**/*.scss"
   ```

The config includes the:

- [SCSS syntax](https://www.npmjs.com/package/postcss-scss) - a custom syntax to parse SCSS
- [SCSS plugin](https://www.npmjs.com/package/stylelint-scss) - a set of custom rules for SCSS

You'll find more community configs in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#readme).

### Using a custom syntax directly

If a shared config isn't available for your preferred language or container, you can install the appropriate custom syntax and use the [`customSyntax` option](options.md#customsyntax) yourself.

For example, to lint CSS within [Lit elements](https://lit.dev/) using the [Lit custom syntax](https://www.npmjs.com/package/postcss-lit):

1. Create a `stylelint.config.mjs` configuration file in the root of your project with the following content:
   ```js
   /** @type {import('stylelint').Config} */
   export default {
     extends: "stylelint-config-standard",
     customSyntax: "postcss-lit"
   };
   ```
2. Add the related dependencies:
   ```shell
   npm add -D stylelint stylelint-config-standard postcss-lit
   ```
3. Run Stylelint on all the JavaScript files in your project:
   ```shell
   npx stylelint "**/*.js"
   ```

You'll find more custom syntaxes in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#custom-syntaxes).

#### Using more than one custom syntax

To lint more than one language or container, use the [`overrides`](configure.md#overrides) property.

For example, to lint CSS files and the CSS within Lit elements, update your configuration to:

```js
/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  overrides: [
    {
      files: ["*.js"],
      customSyntax: "postcss-lit"
    }
  ]
};
```

Then run Stylelint on both your CSS and JavaScript files:

```shell
npx stylelint "**/*.{css,js}"
```

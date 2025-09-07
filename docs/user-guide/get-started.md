# Getting started

You can quickly get started by extending an appropriate shared config.

## Linting CSS

Use [npm](https://docs.npmjs.com/about-npm/) and [our `create` tool](https://www.npmjs.com/package/create-stylelint) to automatically setup Stylelint and extend [our standard config](https://www.npmjs.com/package/stylelint-config-standard):

```shell
npm create stylelint@latest
```

> [!NOTE]
> Stylelint is also compatible with the [Bun](https://bun.sh/package-manager), [pnpm](https://pnpm.io/), and [Yarn](https://yarnpkg.com/) package managers. You can use your preferred one to set up Stylelint, e.g. `bun create stylelint` or `pnpm create stylelint`.

### Manual setup

Alternatively, you can manually setup Stylelint to lint CSS.

1. Create a `stylelint.config.mjs` configuration file in the root of your project with the following content:
   ```js
   /** @type {import('stylelint').Config} */
   export default {
     extends: ["stylelint-config-standard"]
   };
   ```
2. Use [npm](https://docs.npmjs.com/about-npm/) (or your preferred package manager) to add the related dependencies:
   ```shell
   npm add -D stylelint stylelint-config-standard
   ```
3. Run Stylelint on all the CSS files in your project:
   ```shell
   npx stylelint "**/*.css"
   ```

> [!NOTE]
> The [`npx`](https://docs.npmjs.com/cli/commands/npx) command allows you to run locally installed tools.
> You can also use your preferred package manager's equivalent, e.g. `bunx stylelint "**/*.css"` or `pnpm dlx stylelint "**/*.css"`.
> We'll omit `npx` in the rest of this guide.

Once you're up and running, you can [customize](./customize.md) Stylelint.

## Linting CSS-like languages and CSS within containers

You can extend a community config to lint:

- CSS-like languages, e.g. SCSS, Sass and Less
- CSS within containers, e.g. in HTML, CSS-in-JS and Vue SFCs

For example, to lint SCSS you can extend the [SCSS community config](https://www.npmjs.com/package/stylelint-config-standard-scss):

1. Create a `stylelint.config.mjs` configuration file in the root of your project with the following content:
   ```js
   /** @type {import('stylelint').Config} */
   export default {
     extends: ["stylelint-config-standard-scss"]
   };
   ```
2. Use [npm](https://docs.npmjs.com/about-npm/) (or your preferred package manager) to add the related dependencies:
   ```shell
   npm add -D stylelint stylelint-config-standard-scss
   ```
3. Run Stylelint on all the SCSS files in your project:
   ```shell
   stylelint "**/*.scss"
   ```

The config includes the:

- [SCSS syntax](https://www.npmjs.com/package/postcss-scss) - a custom syntax to parse SCSS
- [SCSS plugin](https://www.npmjs.com/package/stylelint-scss) - a set of custom rules for SCSS

You'll find more community configs in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#readme).

### Using a custom syntax directly

If a shared config isn't available for your preferred language or container, you can install the appropriate custom syntax and use the [`customSyntax` option](../user-guide/options.md#customsyntax) yourself.

For example, to lint CSS inside of [Lit elements](https://lit.dev/) using the [Lit custom syntax](https://www.npmjs.com/package/postcss-lit):

1. Create a `stylelint.config.mjs` configuration file in the root of your project with the following content:
   ```js
   /** @type {import('stylelint').Config} */
   export default {
     extends: "stylelint-config-standard",
     customSyntax: "postcss-lit"
   };
   ```
2. Use [npm](https://docs.npmjs.com/about-npm/) (or your preferred package manager) to add the related dependencies:
   ```shell
   npm add -D stylelint stylelint-config-standard postcss-lit
   ```
3. Run Stylelint on all the JavaScript files in your project:
   ```shell
   stylelint "**/*.js"
   ```

You'll find more custom syntaxes in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#custom-syntaxes).

#### Using more than one custom syntax

If you want to lint more than one language or container, you can use the [`overrides`](configure.md#overrides) property.

For example, to lint CSS files and the CSS within Lit Elements you can update your configuration to:

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

And then run Stylelint on both your CSS and JavaScript files:

```shell
stylelint "**/*.{css,js}"
```

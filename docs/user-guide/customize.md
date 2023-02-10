# Customizing

The [standard config](https://www.npmjs.com/package/stylelint-config-standard) turns on about half of the [built-in rules](rules.md). Stylelint is capable of so much more. We recommend using the [standard config](https://www.npmjs.com/package/stylelint-config-standard) as a foundation and building on top of it.

You can use the other half of the [built-in rules](rules.md) to:

- ensure even more consistency by [disallowing things](rules.md#allowed-disallowed--required)
- manage complexity in your code by [setting limits](rules.md#max--min)

These conventions are typically specific to you and your project.

There's a lot you can do. For example, if you only want to allow:

- `%`, `deg`, `px`, `rem`, `ms` units generally
- `px` for borders
- `rem` for paddings and gaps

You can use the [`unit-allowed-list`](../../lib/rules/unit-allowed-list) and [`declaration-property-unit-allowed-list`](../../lib/rules/declaration-property-unit-allowed-list) rules:

```diff json
{
  "extends": ["stylelint-config-standard"],
+ "rules": {
+   "declaration-property-unit-allowed-list": {
+     "/^border/": ["px"],
+     "/^padding|^gap/": ["rem"]
+   },
+   "unit-allowed-list": ["%", "deg", "px", "rem", "ms"]
+ }
}
```

Or you can enforce the `hsl()` color notation using the [`color-named`](../../lib/rules/color-named), [`color-no-hex`](../../lib/rules/color-no-hex),[`function-disallowed-list`](../../lib/rules/function-disallowed-list) rules:

```diff json
{
  "extends": ["stylelint-config-standard"],
+ "rules": {
+   "color-named": "never",
+   "color-no-hex": true,
+   "function-disallowed-list": ["rgb", "hwb", "lch"]
+ }
}
```

Or you can limit the number of ID selectors using the [`selector-max-id`](../../lib/rules/selector-max-id/README.md) rule:

```diff json
{
  "extends": ["stylelint-config-standard"],
+ "rules": {
+   "selector-max-id": 0
+ }
}
```

These are just some of the things you can do with the [built-in rules](rules.md). It's possible to configure them to enforce strict conventions and keep your CSS under control.

## Custom rules

In addition to the [built-in rules](rules.md), there are custom rules that you can [plug into](configure.md#plugins) Stylelint.

Custom rules are typically written by communities to support methodologies, toolsets, non-standard CSS features, or very specific use cases.

You can add custom rules to your config by extending a shared config that includes them or by using a plugin directly. For example, you can order your properties by extending the [recess order config](https://www.npmjs.com/package/stylelint-config-recess-order), which includes the [order plugin](https://www.npmjs.com/package/stylelint-order):

```diff json
{
  "extends": [
    "stylelint-config-standard"
+   "stylelint-config-recess-order"
  ]
}
```

Or you can use [the plugin](https://www.npmjs.com/package/stylelint-order) directly if, for example, you want to alphabetize your properties:

```diff json
{
  "extends": ["stylelint-config-standard"],
+ "plugins": ["stylelint-order"],
+ "rules": {
+   "order/properties-alphabetical-order": true
+ }
}
```

Custom rules do all sorts; from enforcing [strict BEM conventions](https://www.npmjs.com/package/stylelint-selector-bem-pattern) to [strict scales for values](https://www.npmjs.com/package/@signal-noise/stylelint-scales). You'll find more shared configs and plugins of custom rules listed in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint/#readme).

You can also [write your own custom rules within a plugin](../developer-guide/plugins.md). This is particularly useful if you have specific needs or conventions you want to enforce.

## Strictness

We recommend you craft a config that strictly enforces your conventions and then use [special comments](./ignore-code.md) to disable specific rules when needed. You needn't shy away from using them as they are an integral part of Stylelint.

You can use the [`report*`](./configure.md#report) properties in your config to ensure your comments aren't useless and descriptionless:

```diff json
{
  "extends": ["stylelint-config-standard"],
+ "reportDescriptionlessDisables": true,
+ "reportInvalidScopeDisables": true,
+ "reportNeedlessDisables": true
}
```

Each of these properties is configurable if you need to add exceptions to them.

You can also use the [`reportDisables`](./configure.md#reportdisables secondary property to disallow disables on a per-rule basis.

## Using Stylelint

You can use our [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint), or one of the other integrations listed in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint/#readme), to get instant feedback in your code editor. This is the quickest way to see and resolve problems.

You don't have to use the [CLI](./cli.md) either; we also provide a [Node.js API](./node-api.md), or you can use one of the other integrations or task runners listed in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint/#readme).

Whichever you choose, there are [many options](./options.md) in Stylelint that you can use to customize how Stylelint works. For example, you'll likely want to use the [`--fix` option](options.md#fix) to automatically fix as many problems as possible:

```console
npx stylelint "**/*.css" --fix
```

You may also want to look into the:

- [`--cache` option](options.md#cache) to improve performance
- [`--formatter` option](options.md#formatter) to customize the output

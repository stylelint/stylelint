# Customizing

Stylelint is capable of so much more than what the [standard config](https://www.npmjs.com/package/stylelint-config-standard) turns on. We recommend using it as a foundation and building on top of it.

## Built-in rules

The standard config turns on most of the [built-in rules](rules.md) that avoid errors, but fewer than half of those that enforce conventions, as conventions are typically specific to you and your project.

### Avoid errors

You can catch unknown identifiers across files, such as animation names, custom properties, or custom media queries, by combining the [`referenceFiles`](configure.md#referencefiles) configuration property with the [`no-unknown-animations`](../../lib/rules/no-unknown-animations/README.md), [`no-unknown-custom-properties`](../../lib/rules/no-unknown-custom-properties/README.md), and [`no-unknown-custom-media`](../../lib/rules/no-unknown-custom-media/README.md) rules:

```diff json
 {
-  "extends": ["stylelint-config-standard"]
+  "extends": ["stylelint-config-standard"],
+  "referenceFiles": [
+    "tokens.css"
+  ],
+  "rules": {
+    "no-unknown-animations": true,
+    "no-unknown-custom-properties": true,
+    "no-unknown-custom-media": true
+  }
 }
```

### Enforce conventions

You can enforce the use of custom properties. For example, if your `tokens.css` contains:

```css
:root {
  --color-text: oklch(20% 0 0);
  --spacing-m: 1rem;
  --radii-m: 2px;
}
```

And you want to:

- require custom properties for `<color>` and `<length>` values, except `0`, `transparent` and `currentcolor`
- allow only `--spacing-*` custom properties in `margin` and `padding` properties
- allow only `--radii-*` custom properties in `border-radius`

You can combine the [`referenceFiles`](configure.md#referencefiles) configuration property with the [`value-type-custom-property-required-list`](../../lib/rules/value-type-custom-property-required-list/README.md) and [`declaration-property-custom-property-allowed-list`](../../lib/rules/declaration-property-custom-property-allowed-list/README.md) rules:

```diff json
 {
   "extends": ["stylelint-config-standard"],
   "referenceFiles": ["tokens.css"],
   "rules": {
+    "declaration-property-custom-property-allowed-list": {
+      "/^(margin|padding)/": ["/^--spacing-/"],
+      "border-radius": ["/^--radii-/"]
+    },
+    "value-type-custom-property-required-list": [
+      ["color", "length"],
+      { "ignoreProperties": { "/.+/": ["0", "transparent", "currentcolor"] } }
+    ]
   }
 }
```

Given:

```css
a {
  border-radius: var(--spacing-m);
  margin: 1rem;
}
```

`--spacing-m` is flagged by [`declaration-property-custom-property-allowed-list`](../../lib/rules/declaration-property-custom-property-allowed-list/README.md), and `1rem` by [`value-type-custom-property-required-list`](../../lib/rules/value-type-custom-property-required-list/README.md).

Many of the other rules allow you to:

- ensure even more consistency by [disallowing things](rules.md#allowed-disallowed--required)
- manage complexity in your code by [setting limits](rules.md#max--min)

For example, if you only want to allow:

- `%`, `deg`, `px`, `rem`, `ms` units generally
- `px` for borders
- `rem` for paddings and gaps

You can use the [`unit-allowed-list`](../../lib/rules/unit-allowed-list/README.md) and [`declaration-property-unit-allowed-list`](../../lib/rules/declaration-property-unit-allowed-list/README.md) rules:

```diff json
 {
-  "extends": ["stylelint-config-standard"]
+  "extends": ["stylelint-config-standard"],
+  "rules": {
+    "declaration-property-unit-allowed-list": {
+      "/^border/": ["px"],
+      "/^padding|^gap/": ["rem"]
+    },
+    "unit-allowed-list": ["%", "deg", "px", "rem", "ms"]
+  }
 }
```

Or you can enforce the `oklch()` color notation using the [`color-named`](../../lib/rules/color-named/README.md), [`color-no-hex`](../../lib/rules/color-no-hex/README.md), and [`function-disallowed-list`](../../lib/rules/function-disallowed-list/README.md) rules:

```diff json
 {
-  "extends": ["stylelint-config-standard"]
+  "extends": ["stylelint-config-standard"],
+  "rules": {
+    "color-named": "never",
+    "color-no-hex": true,
+    "function-disallowed-list": ["rgb", "hsl", "hwb", "lch"]
+  }
 }
```

Or you can limit the number of ID selectors using the [`selector-max-id`](../../lib/rules/selector-max-id/README.md) rule:

```diff json
 {
-  "extends": ["stylelint-config-standard"]
+  "extends": ["stylelint-config-standard"],
+  "rules": {
+    "selector-max-id": 0
+  }
 }
```

#### Subsets of files

You can apply rules to a subset of files using the [`overrides`](configure.md#overrides) configuration property.

For example, to disallow:

- class selectors in `tokens.css`
- type selectors in components

You can use the [`selector-max-class`](../../lib/rules/selector-max-class/README.md) and [`selector-max-type`](../../lib/rules/selector-max-type/README.md) rules:

```diff json
 {
-  "extends": ["stylelint-config-standard"]
+  "extends": ["stylelint-config-standard"],
+  "overrides": [
+    {
+      "files": ["tokens.css"],
+      "rules": {
+        "selector-max-class": 0
+      }
+    },
+    {
+      "files": ["components/**/*.css"],
+      "rules": {
+        "selector-max-type": 0
+      }
+    }
+  ]
 }
```

These are just some of the things you can do with the [built-in rules](rules.md). It's possible to configure them to enforce strict conventions and keep your CSS under control.

## Custom rules

In addition to the [built-in rules](rules.md), there are custom rules that you can [plug into](configure.md#plugins) Stylelint.

Custom rules are typically written by communities to support methodologies, toolsets, non-standard CSS features, or very specific use cases.

You can add custom rules to your config by extending a shared config that includes them or by using a plugin directly. For example, you can order your properties into groups by extending the [recess order config](https://www.npmjs.com/package/stylelint-config-recess-order):

```diff json
 {
   "extends": [
-    "stylelint-config-standard"
+    "stylelint-config-standard",
+    "stylelint-config-recess-order"
   ]
 }
```

Or alphabetize them by extending the [alphabetical order config](https://www.npmjs.com/package/stylelint-config-alphabetical-order):

```diff json
 {
   "extends": [
-    "stylelint-config-standard"
+    "stylelint-config-standard",
+    "stylelint-config-alphabetical-order"
   ]
 }
```

Or you can use the [order plugin](https://www.npmjs.com/package/stylelint-order) directly if, for example, you want to specify your own order:

```diff json
 {
-  "extends": ["stylelint-config-standard"]
+  "extends": ["stylelint-config-standard"],
+  "plugins": ["stylelint-order"],
+  "rules": {
+    "order/properties-order": [
+      "transform",
+      "top",
+      "color"
+    ]
+  }
 }
```

Custom rules do all sorts; from [helping you use Baseline effectively](https://www.npmjs.com/package/stylelint-plugin-use-baseline) to [strict scales for numeric values](https://www.npmjs.com/package/stylelint-scales). You'll find more shared configs and plugins of custom rules listed in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint/#readme).

You can also [write your own custom rules within a plugin](../developer-guide/plugins.md). This is particularly useful if you have specific needs or conventions you want to enforce.

## Strictness

We recommend you craft a config that strictly enforces your conventions, add [`overrides`](#subsets-of-files) for the ones that apply to only some files, and then use [configuration comments](./ignore-code.md) to disable specific rules when needed.

You can use the [`report*`](./configure.md#report) properties in your config to ensure your comments aren't useless and descriptionless:

```diff json
 {
-  "extends": ["stylelint-config-standard"]
+  "extends": ["stylelint-config-standard"],
+  "reportDescriptionlessDisables": true,
+  "reportInvalidScopeDisables": true,
+  "reportNeedlessDisables": true
 }
```

Each of these properties is configurable if you need to add exceptions to them.

You can also use the [`reportDisables`](./configure.md#reportdisables) secondary property to disallow disables on a per-rule basis.

## Using Stylelint

You can use our [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint), or one of the other integrations listed in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint/#readme), to get instant feedback in your code editor. This is the quickest way to see and resolve problems.

You don't have to use the [CLI](./cli.md) either; we also provide a [Node.js API](./node-api.md), or you can use one of the other integrations or task runners listed in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint/#readme).

Whichever you choose, there are [many options](./options.md) in Stylelint that you can use to customize how Stylelint works. For example, you'll likely want to use the [`--fix` option](options.md#fix) to automatically fix as many problems as possible:

```shell
stylelint "**/*.css" --fix
```

You may also want to look into the:

- [`--cache` option](options.md#cache) to improve performance
- [`--formatter` option](options.md#formatter) to customize the output

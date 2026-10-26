# function-no-unknown

Disallow unknown functions.

<!-- prettier-ignore -->
```css
a { transform: unknown(1); }
/**            ↑
 * Functions like this */
```

This rule considers functions defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

You can filter the [CSSTree Syntax Reference](https://csstree.github.io/docs/syntax/) to find out what functions are known, and use the [`languageOptions`](../../../docs/user-guide/configure.md#languageoptions) configuration property to extend it.

This rule ignores:

- double-dashed custom functions, e.g., `--custom-function()`
- vendor-prefixed functions, e.g., `-webkit-calc()`

> [!NOTE]
> We recommend only using this rule for CSS-like languages, such as SCSS and Less. For CSS, we recommend using these more capable and overlapping rules instead:
>
> - [`at-rule-descriptor-value-no-unknown`](../at-rule-descriptor-value-no-unknown/README.md)
> - [`declaration-property-value-no-unknown`](../declaration-property-value-no-unknown/README.md)

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the unknown function.

## Options

### `true`

```json
{
  "function-no-unknown": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { transform: unknown(1); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: scale(1); }
```

<!-- prettier-ignore -->
```css
a { transform: --custom-function(1); }
```

## Optional secondary options

### `ignoreFunctions`

```json
{ "ignoreFunctions": ["array", "of", "functions", "/regex/"] }
```

Ignore the specified functions.

Given:

```json
{
  "function-no-unknown": [true, { "ignoreFunctions": ["theme", "/^foo-/"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: theme(1); }
```

<!-- prettier-ignore -->
```css
a { transform: foo-func(1); }
```

# custom-property-no-missing-var-function

Disallow missing `var` function for custom properties.

<!-- prettier-ignore -->
```css
    :root { --foo: red; }
    a { color: --foo; }
/**            ↑
 *             This custom property */
```

Use this rule to avoid declarations that browsers ignore. A custom property without [`var()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/var), e.g. `--foo` alone, is a plain identifier that [most properties reject](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Syntax/Error_handling#errors_within_css_declaration_blocks).

This rule ignores properties that accept a `<custom-ident>` or `<dashed-ident>` as their whole value, e.g. `transition-property`.

You can filter the [CSSTree Syntax Reference](https://csstree.github.io/docs/syntax/) to find out what properties accept them, and use the [`languageOptions`](../../../docs/user-guide/configure.md#languageoptions) configuration property to extend it.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the custom property.

## Options

### `true`

```json
{
  "custom-property-no-missing-var-function": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
:root { --foo: red; }
a { color: --foo; }
```

<!-- prettier-ignore -->
```css
@property --foo {}
a { color: --foo; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:root { --foo: red; }
a { color: var(--foo); }
```

<!-- prettier-ignore -->
```css
@property --foo {}
a { color: var(--foo); }
```

<!-- prettier-ignore -->
```css
@property --foo {}
a { transition-property: --foo; }
```

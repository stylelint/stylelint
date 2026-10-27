# value-no-invalid

Disallow invalid values.

<!-- prettier-ignore -->
```css
a { top: calc(1px + 2); }
/**      ↑
 * Values like this */
```

You can use this rule to avoid declarations that browsers ignore. A value that can't be parsed, e.g. `calc(1px + 2)`, [invalidates the whole declaration](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Syntax/Error_handling#errors_within_css_declaration_blocks).

This rule considers values defined within the CSS specifications, up to and including Editor's Drafts, to be valid. It reports values that cannot be parsed and math expressions that add or subtract a number to a dimension or percentage.

This rule does not parse the values of custom properties, as they can contain any tokens, but it does check their math expressions.

This rule reports values that are invalid regardless of their property. You can use [`declaration-property-value-no-unknown`](../declaration-property-value-no-unknown/README.md) to disallow values that are unknown to their property.

> [!WARNING]
> This rule is only appropriate for CSS. You should not turn it on for CSS-like languages, such as SCSS or Less.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the value and the reason it is invalid.

## Options

### `true`

```json
{
  "value-no-invalid": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { top: ); }
```

<!-- prettier-ignore -->
```css
a { top: calc(1px + 2); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { top: 0; }
```

<!-- prettier-ignore -->
```css
a { top: calc(1px + 2px); }
```

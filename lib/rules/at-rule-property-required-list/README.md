# at-rule-property-required-list

Specify a list of required properties for an at-rule.

<!-- prettier-ignore -->
```css
    @font-face { font-display: swap; font-family: 'foo'; }
/**  ↑           ↑                   ↑
 *  At-rule and required property names */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`object`: `{ "at-rule-name": ["array", "of", "properties"]|"property" }`

Given:

```json
{
  "font-face": ["font-display", "font-family", "font-style"]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@font-face {
    font-family: 'foo';
    src: url('./fonts/foo.woff2') format('woff2');
}
```

<!-- prettier-ignore -->
```css
@font-face {
    font-family: 'foo';
    font-style: normal;
    src: url('./fonts/foo.woff2') format('woff2');
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@font-face {
    font-display: swap;
    font-family: 'foo';
    font-style: normal;
    src: url('./fonts/foo.woff2') format('woff2');
}
```

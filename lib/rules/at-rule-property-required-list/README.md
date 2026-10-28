# at-rule-property-required-list

Specify a list of required properties (or descriptors) for an at-rule.

<!-- prettier-ignore -->
```css
    @font-face { font-display: swap; font-family: 'foo'; }
/**  ↑           ↑                   ↑
 *  At-rule and required descriptor names */
```

Use this rule to enforce a convention. For example, require `font-display` in every `@font-face`, so that [text shows while fonts load](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-display).

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the at-rule and the required property.

## Options

### `Array<string>`

```json
{ "at-rule-name": ["array", "of", "properties", "or", "descriptors"] }
```

Given:

```json
{
  "at-rule-property-required-list": {
    "font-face": ["font-display", "font-family", "font-style"]
  }
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

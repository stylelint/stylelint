# declaration-property-value-keyword-no-deprecated

Disallow deprecated keywords for properties within declarations.

<!-- prettier-ignore -->
```css
  a { color: ThreeDDarkShadow; }
/**     ↑         ↑
 * property and value pairs like these */
```

This rule flags keywords that were removed or deprecated after being in the CSS specifications, including editor drafts, and were subsequently either:

- shipped in a stable version of a browser
- shipped by a developer channel/edition browser
- shipped but behind experimental flags
- polyfilled with some adoption before any browser actually shipped
- had an MDN page at one point in time

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule.

Prior art:

- [@isnotdefined/no-obsolete](https://www.npmjs.com/package/@isnotdefined/stylelint-plugin)

## Options

### `true`

```json
{
  "declaration-property-value-keyword-no-deprecated": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { overflow: overlay; }
```

<!-- prettier-ignore -->
```css
a { text-justify: distribute; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { overflow: auto; }
```

<!-- prettier-ignore -->
```css
a { text-justify: inter-character; }
```

## Optional secondary options

### `ignoreKeywords`

```json
{ "ignoreKeywords": ["array", "of", "keywords", "/regex/"] }
```

Given:

```json
{
  "declaration-property-value-keyword-no-deprecated": [
    true,
    { "ignoreKeywords": ["ActiveBorder", "/caption/i"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: ActiveBorder;
}
```

<!-- prettier-ignore -->
```css
a {
  color: InactiveCaptionText;
}
```

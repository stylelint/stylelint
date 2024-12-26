# declaration-property-value-keyword-no-deprecated

Disallow deprecated keywords for properties within declarations.

<!-- prettier-ignore -->
```css
  a { color: ThreeDDarkShadow; }
/**     ↑         ↑
 * property and value pairs like these */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) accept arguments.

## Options

### `true`

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

### `ignoreKeywords: ["/regex/", /regex/, "string"]`

Given:

```json
["ActiveBorder", "/caption/i"]
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

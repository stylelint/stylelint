# length-zero-no-unit

Disallow units for zero lengths.

<!-- prettier-ignore -->
```css
a { top: 0px; }
/**      ↑↑
 * This zero and this type of length unit */
```

_Lengths_ refer to distance measurements. A length is a _dimension_, which is a _number_ immediately followed by a _unit identifier_. However, for zero lengths the unit identifier is optional. The length units are: `em`, `ex`, `ch`, `vw`, `vh`, `cm`, `mm`, `in`, `pt`, `pc`, `px`, `rem`, `vmin`, and `vmax`.

This rule ignores lengths within math functions (e.g. `calc`).

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `true`

```json
{
  "length-zero-no-unit": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { top: 0px }
```

<!-- prettier-ignore -->
```css
a { top: 0.000em }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { top: 0 } /* no unit */
```

<!-- prettier-ignore -->
```css
a { transition-delay: 0s; } /* dimension */
```

<!-- prettier-ignore -->
```css
a { top: 2in; }
```

<!-- prettier-ignore -->
```css
a { top: 1.001vh }
```

## Optional secondary options

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"custom-properties"`

Ignore units for zero lengths in custom properties.

```json
{
  "length-zero-no-unit": [true, { "ignore": ["custom-properties"] }]
}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
a { --x: 0px; }
```

### `ignoreFunctions`

```json
{ "ignoreFunctions": ["array", "of", "functions", "/regex/"] }
```

Ignore units for zero lengths within the specified functions.

Given:

```json
{
  "length-zero-no-unit": [true, { "ignoreFunctions": ["var", "/^--/"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { top: var(--foo, 0px); }
```

<!-- prettier-ignore -->
```css
a { top: --bar(0px); }
```

### `ignorePreludeOfAtRules`

```json
{
  "ignorePreludeOfAtRules": ["array", "of", "at-rules", "/regex/"]
}
```

Ignore units for zero lengths within the preludes of the specified at-rules.

Given:

```json
{
  "length-zero-no-unit": [
    true,
    { "ignorePreludeOfAtRules": ["media", "/^--bar/"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (height > 0px) {}
```

<!-- prettier-ignore -->
```css
@--bar-baz 0px;
```

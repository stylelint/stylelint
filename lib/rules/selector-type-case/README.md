# selector-type-case

Specify lowercase or uppercase for type selectors.

<!-- prettier-ignore -->
```css
    a {}
/** ↑
 * This is type selector */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"lower"`

```json
{
  "selector-type-case": "lower"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
A {}
```

<!-- prettier-ignore -->
```css
LI {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}
```

<!-- prettier-ignore -->
```css
li {}
```

### `"upper"`

```json
{
  "selector-type-case": "upper"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {}
```

<!-- prettier-ignore -->
```css
li {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
A {}
```

<!-- prettier-ignore -->
```css
LI {}
```

## Optional secondary options

### `ignoreTypes`

```json
{ "ignoreTypes": ["array", "of", "types", "/regex/"] }
```

Given:

```json
{
  "selector-type-case": [
    "lower",
    { "ignoreTypes": ["$childClass", "/(p|P)arent.*/"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
myParentClass {
  color: pink;
}

$childClass {
  color: pink;
}
```

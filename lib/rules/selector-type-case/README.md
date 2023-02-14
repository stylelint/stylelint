# selector-type-case

Specify lowercase or uppercase for type selectors.

<!-- prettier-ignore -->
```css
    a {}
/** ↑
 * This is type selector */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`string`: `"lower"|"upper"`

### `"lower"`

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

### `ignoreTypes: ["/regex/", /regex/, "non-regex"]`

Given:

```json
["$childClass", "/(p|P)arent.*/"]
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

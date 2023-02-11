# declaration-block-single-line-max-declarations

Limit the number of declarations within a single-line declaration block.

<!-- prettier-ignore -->
```css
a { color: pink; top: 0; }
/** ↑            ↑
 * The number of these declarations */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

`int`: Maximum number of declarations allowed.

For example, with `1`:

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; top: 3px; }
```

<!-- prettier-ignore -->
```css
a,
b { color: pink; top: 3px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; }
```

<!-- prettier-ignore -->
```css
a,
b { color: pink; }
```

<!-- prettier-ignore -->
```css
a {
  color: pink;
  top: 3px;
}
```

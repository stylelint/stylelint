# selector-no-type

***Deprecated: Instead use the [`selector-max-type`](../selector-max-type/README.md) rule with `0` as its primary option.***

Disallow type selectors.

```css
    a {}
/** ↑
 * This type of selector */
```

## Options

### `true`

The following patterns are considered violations:

```css
a {}
```

```css
a, .foo {}
```

```css
a > [foo] {}
```

The following patterns are *not* considered violations:

```css
.foo {}
```

```css
[foo] {}
```

```css
#foo {}
```

```css
.bar > #foo {}
```

```css
#foo.bar {}
```

## Optional secondary options

### `ignore: ["compounded", "descendant"]`

#### `"compounded"`

Allow compounded type selectors -- i.e. type selectors chained with other selectors.

The following patterns are *not* considered violations:

```css
a.foo {}
```

```css
a#bar {}
```

#### `"descendant"`

Allow descendant type selectors.

The following patterns are *not* considered violations:

```css
.foo a {}
```

```css
#bar a.foo {}
```

### `ignoreTypes: ["/regex/", "string"]`

Given:

```js
["/^my-/", "custom"]
```

The following patterns are *not* considered violations:

```css
custom {}
```

```css
my-type {}
```

```css
my-other-type {}
```

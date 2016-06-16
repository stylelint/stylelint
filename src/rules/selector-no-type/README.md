# selector-no-type

Disallow type selectors.

```css
    a {}
/** ↑
 * This type of selector */
```

## Options

### `true`

The following patterns are considered warnings:

```css
a {}
```

```css
a, .foo {}
```

```css
a > [foo] {}
```

The following patterns are *not* considered warnings:

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

## Optional options

### `ignore: ["compounded", "descendant"]`

#### `"compounded"`

Allow compounded type selectors -- i.e. type selectors chained with other selectors.

The following patterns are *not* considered warnings:

```css
ul.foo {}
```

```css
ul#bar {}
```

#### `"descendant"`

Allow descendant type selectors.

The following patterns are *not* considered warnings:

```css
.foo ul {}
```

```css
#bar ul.foo {}
```

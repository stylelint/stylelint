# selector-no-type

Disallow type selectors.

```css
    a {}
/** ↑
 * This type of selector */
```

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

### `ignore: [ "descendant" ]`

Allow descendant type selectors.

For example, the following would *not* be considered warnings:

```css
.foo ul {}
```

```css
#bar ul.foo {}
```

### `ignore: [ "compounded" ]`

Allow compounded type selectors -- i.e. type selectors chained with other selectors.

For example, the following would *not* be considered warnings:

```css
ul.foo {}
```

```css
ul#bar {}
```

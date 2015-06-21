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

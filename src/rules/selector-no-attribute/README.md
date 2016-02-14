# selector-no-attribute

Disallow attribute selectors.

```css
   a[rel="external"] {}
/** ↑
 * This type of selector */
```

The following patterns are considered warnings:

```css
[foo] {}
```

```css
a[rel="external"] {}
```

```css
a,
.foo[type="text"] {}
```

```css
a > [foo] {}
```

The following patterns are *not* considered warnings:

```css
.foo {}
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

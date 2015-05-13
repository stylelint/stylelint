# number-leading-zero

Require or disallow a leading zero for fractional value less than 1.

## Options

* `string`: `"always"|"never"`

### `"always"`

There *must always* be a leading zero.

The following patterns are considered warnings:

```css
a { line-height: .5; }
```

```css
a { transform: translate(2px, .4px); }
```

```css
a { margin: .3em .123px .999999px; }
```

The following patterns are *not* considered warnings:

```css
a { line-height: 0.5; }
```

```css
a { transform: translate(2px, 0.4px); }
```

```css
a { margin: 0.3em 0.123px 0.999999px; }
```

### `"never"`

There *must never* be a leading zero.

The following patterns are considered warnings:

```css
a { line-height: 0.5; }
```

```css
a { transform: translate(2px, 0.4px); }
```

```css
a { margin: 0.3em 0.123px 0.999999px; }
```

The following patterns are *not* considered warnings:

```css
a { line-height: .5; }
```

```css
a { transform: translate(2px, .4px); }
```

```css
a { margin: .3em .123px .999999px; }
```

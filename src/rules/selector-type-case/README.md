# selector-type-case

Specify lowercase or uppercase for html selector.

```css
    a {}
/** ↑
 * This type of selector */
```

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered warnings:

```css
A { color: #fff; }
```

```css
LI { display: inline-block; }
```

The following patterns are *not* considered warnings:

```css
a { color: #000; }
```

```css
li { display: inline-block; }
```

### `"upper"`

The following patterns are considered warnings:

```css
a { color: #000; }
```

```css
li { display: inline-block; }
```

The following patterns are *not* considered warnings:

```css
A { color: #fff; }
```

```css
LI { display: inline-block; }
```


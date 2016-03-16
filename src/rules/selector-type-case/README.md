# selector-type-case

Specify lowercase or uppercase for type selector.

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
A {}
```

```css
LI {}
```

The following patterns are *not* considered warnings:

```css
a {}
```

```css
li {}
```

### `"upper"`

The following patterns are considered warnings:

```css
a {}
```

```css
li {}
```

The following patterns are *not* considered warnings:

```css
A {}
```

```css
LI {}
```


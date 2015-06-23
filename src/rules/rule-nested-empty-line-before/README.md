# rule-nested-empty-line-before

Require or disallow an empty line before nested rules.

```css
    @media {
           /* ← */
      a {} /* ↑ */
    }      /* ↑ */
/**           ↑  
 *    This line */
```

## Options

`string`: `"always"|"never"|"always-multi-line"|"never-multi-line"`

### `"always"`

There *must always* be an empty line before rules.

The following patterns are considered warnings:

```css
@media { a {} }
```

```css
@media { 
  a {} 
}
```

The following patterns are *not* considered warnings:

```css
@media {

  a {} 
}
```

### `"always-except-first"`

There *must always* be an empty line before rules, except for the first rule.

The following patterns are considered warnings:

```css
@media {

  a {} 
}
```

```css
@media {

  a {}
  b {} 
}
```

```css
@media {

  a {}

  b {} 
}
```

```css
@media {

  a {}

  b {}

  c {}
}
```

The following patterns are *not* considered warnings:

```css
@media { a {} }
```

```css
@media { 
  a {} 
}
```

```css
@media { 
  a {} 

  b {}
}
```

```css
@media {
  a {}

  b {}

  c {}
}
```

### `"never"`

There *must never* be an empty before rules.

The following patterns are considered warnings:

```css
@media { a {} }
```

```css
@media { 

  a {} 
}
```

The following patterns are *not* considered warnings:

```css
@media { 
  a {} 
}
```

### `"always-multi-line"`

There *must always* be an empty line before multi-line rules.

The following patterns are considered warnings:

```css
@media { 
  a {
    color: pink;
    top: 0;
  } 
}
```

The following patterns are *not* considered warnings:

```css
@media {

  a {
    color: pink;
    top: 0;
  } 
}
```

### `"always-multi-line-except-first"`

There *must always* be an empty line before multi-line rules, except for the first rule.

The following patterns are considered warnings:

```css
@media {

  a {
    color: pink;
    top: 0;
  } 
}
```

```css
@media {

  a {
    color: pink;
    top: 0;
  }

  b {
    color: pink;
    top: 0;
  } 
}
```

```css
@media {

  a {
    color: pink;
    top: 0;
  }
  b {
    color: pink;
    top: 0;
  } 
}
```

The following patterns are *not* considered warnings:

```css
@media { 
  a {
    color: pink;
    top: 0;
  } 
}
```

```css
@media {
  a {
    color: pink;
    top: 0;
  } 

  b {
    color: pink;
    top: 0;
  } 
}
```

### `"never-multi-line"`

There *must never* be an empty line before multi-line rules.

The following patterns are considered warnings:

```css
@media {

  a {
    color: pink;
    top: 0;
  } 
}
```

The following patterns are *not* considered warnings:

```css
@media {
  a {
    color: pink;
    top: 0;
  } 
}
```

## Optional options

### `except: ["first-nested"]`

This will reverse the primary option if the rule is the first in a block. 

For example, with `"always"`:

The following patterns are considered warnings:

```css
@media { 

  a {}

  b {}

  c {}
}
```

The following patterns are *not* considered warnings:

```css
@media {
  a {} 

  b {}

  c {}
}
```

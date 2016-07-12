# custom-property-no-empty-lines-before

Disallow empty lines before custom properties.

```css
a { 
  --foo-bar: 1px;
                      /* ← */
  --foo-baz: 2px;     /* ↑ */   
}                     /* ↑ */
/**                      ↑
  *              This line */
```

## Options

### `true`

The following patterns are considered warnings:

```css
a { 
  
  --foo-bar: 1px;
  --foo-baz: 2px; 
}
```

```css
a {
  --foo-bar: 1px;

  --foo-baz: 2px; 
}
```

The following patterns are *not* considered warnings:

```css
a { 
  --foo-bar: 1px;
  --foo-baz: 2px; 
}
```
## Optional options

### `expect: ["first-after-non-custom-property-sibling"]`

Require an empty line for first custom property after a non custom property.

The following patterns are considered warnings:

```css
.foo {
  scroll: auto;
  --foo-bar: 1px;

  --foo-baz: 2px; 
}
```

The following patterns are *not* considered warnings:

```css
.foo {
  scroll: auto;

  --foo-bar: 1px;
  --foo-baz: 2px; 
}
```

```css
.foo {
  scroll: auto;

  --foo-bar: 1px;

  display: block;
  
  --foo-baz: 2px; 
}
```

# root-no-standard-properties

Disallow standard properties inside `:root` selectors.

```css
    :root { color: #333 }
/**   ↑       ↑
 * This selector and these types of standard properties */
```

The following patterns are considered warnings:

```css
:root { color: pink; }
```

```css
a, :root { top: 0; }
```

The following patterns are *not* considered warnings:

```css
:root { --foo: 0; }
```

```css
a, :root { --foo: 0; }
```

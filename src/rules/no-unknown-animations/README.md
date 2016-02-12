# no-unknown-animations

Disallow animation names that do not correspond to a `@keyframes` declaration.

```css
.foo { animation-name: fancy-slide; }
/**                        ↑
 *       This animation name */
```

The following patterns are considered warnings:

```css
.foo { animation-name: fancy-slide; }
```

```css
.foo { animation-name: fancccy-slide; }
@keyframes fancy-slide { ... }
```

```css
.foo { animation-name: jump; }
@keyframes fancy-slide { ... }
```

The following patterns are *not* considered warnings:

```css
.foo { animation-name: fancy-slide; }
@keyframes fancy-slide { ... }
```

```css
@keyframes fancy-slide { ... }
.foo { animation-name: fancy-slide; }
```

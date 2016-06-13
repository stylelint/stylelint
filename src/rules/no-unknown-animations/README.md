# no-unknown-animations

Disallow animation names that do not correspond to a `@keyframes` declaration.

```css
.foo { animation-name: fancy-slide; }
/**                    ↑
 *   This animation name */

.foo { animation: fancy-slide 2s linear; }
/**                    ↑
 *           And this one */
```

## Options

### `true`

The following patterns are considered warnings:

```css
.foo { animation-name: fancy-slide; }
```

```css
.foo { animation: fancy-slide 2s linear; }
```

```css
.foo { animation-name: fancccy-slide; }
@keyframes fancy-slide { ... }
```

```css
.foo { animation: linear 100ms fancccy-slide; }
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

```css
@keyframes fancy-slide { ... }
.foo { animation: fancy-slide 2s linear; }
```

```css
.foo { animation: 100ms steps(12, end) fancy-slide; }
@keyframes fancy-slide { ... }
```

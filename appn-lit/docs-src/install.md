---
layout: page.11ty.ts
title: Appn ➡️ Install
---

# Install

[appn](https://www.npmjs.com/package/appn) is distributed on **npm**, so you can install it locally or use it via npm CDNs like unpkg.com.

## Local Installation

```bash
npm i appn
```

## CDN

npm CDNs like [unpkg.com]() can directly serve files that have been published to npm. This works great for standard JavaScript modules that the browser can load natively.

For this element to work from unpkg.com specifically, you need to include the `?module` query parameter, which tells unpkg.com to rewrite "bare" module specifiers to full URLs.

### HTML

```html
<script type="module" src="https://unpkg.com/appn?module"></script>
```

### JavaScript

```js
import {AppnPage} from 'https://unpkg.com/appn?module';
```

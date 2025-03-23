---
layout: page.11ty.js
title: Appn
---

# Appn

Appn is an awesome web components library.

## Get Start

```bash
npm install appn
```

```ts
import 'appn';
```

## Usage

<section class="columns">
  <div>

`<appn-page>` is just an HTML element. You can it anywhere you can use HTML!

```html
<appn-page></appn-page>
```

  </div>
  <div>

<appn-page></appn-page>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<appn-page>` can be configured with attributed in plain HTML.

```html
<appn-page name="HTML"></appn-page>
```

  </div>
  <div>

<appn-page name="HTML"></appn-page>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<appn-page>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;appn-page&gt;</h2>
    <appn-page .name=${name}></appn-page>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;appn-page&gt;</h2>
<appn-page name="lit-html"></appn-page>

  </div>
</section>

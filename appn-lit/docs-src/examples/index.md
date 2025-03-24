---
layout: example.11ty.ts
title: Appn ➡️ AppnPage Example
tags: example
name: AppnPage
description: A basic example
---

<style>
  appn-page::part(layer) {
    outline: solid 1px blue;
    width:280px;
    height:600px;
    position: relative;
  }
</style>

<appn-page pagetitle="Page Title" >
  <p>This is page content</p>
  <div  slot="footer" style="text-align:center;">This is Page Footer</div>
</appn-page>

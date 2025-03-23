---
layout: example.11ty.js
title: <appn-page> ⌲ Examples
tags: example
name: Examples
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
</appn-page>

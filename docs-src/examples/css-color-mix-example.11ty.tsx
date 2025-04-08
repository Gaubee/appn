import React from 'react';

export default class Page {
  data() {
    return {
      layout: 'example.11ty.ts',
      tags: 'example',
      name: 'CssColorMix',
      description: '<css-color-mix> basic usage',
    };
  }
  render(data) {
    const css = String.raw;
    const styleText = css`
      .block {
        width: 100px;
        height: 100px;
        background: var(--qaq);
      }
    `;
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>

        <css-color-mix var="--qaq" c1={'red'} c2={'blue'}></css-color-mix>
        <div className="block"></div>
      </>
    );
  }
}

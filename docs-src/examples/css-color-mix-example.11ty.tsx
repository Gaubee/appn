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
      .demo-frame {
        margin: 9px;
        outline: solid 1px blue;
        border-radius: 24px;
        width: 650px;
        height: 400px;
        border: 0;
      }
    `;
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>
        <iframe className="demo-frame" src="/examples/kitchen-sink/color-mix-demo-1/"></iframe>
      </>
    );
  }
}

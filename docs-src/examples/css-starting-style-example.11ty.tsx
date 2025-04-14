import React from 'react';

export default class Page {
  data() {
    return {
      layout: 'example.11ty.ts',
      tags: 'example',
      name: 'CssStartingStyle',
      description: '<css-starting-style> basic usage',
    };
  }
  render(data) {
    const css = String.raw;
    const styleText = css`
      .demo-frame {
        margin: 8px;
        outline: solid 1px blue;
        border-radius: 24px;
        width: 350px;
        height: 400px;
        border: 0;
      }
    `;
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>
        <h5>basic demo</h5>
        <iframe className="demo-frame" src="/examples/kitchen-sink/starting-style-demo-1/"></iframe>
        <h5>::slotted demo</h5>
        <iframe className="demo-frame" src="/examples/kitchen-sink/starting-style-demo-2/"></iframe>
        <h5>:host demo</h5>
        <iframe className="demo-frame" src="/examples/kitchen-sink/starting-style-demo-3/"></iframe>
      </>
    );
  }
}

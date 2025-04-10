import React from 'react';
import type {} from '../../src/react';

export default class Page {
  data() {
    return {
      layout: 'example.11ty.ts',
      tags: 'example',
      name: 'AppnNavigation',
      description: '<appn-navigation> basic usage',
    };
  }
  render(data) {
    const css = String.raw;
    const styleText = css`
      .demo-frame {
        margin: 8px;
        outline: solid 1px blue;
        border-radius: 24px;
        width: 280px;
        height: 360px;
        border: 0;
      }
    `;
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>
        <iframe className="demo-frame" src="/examples/kitchen-sink/appn-navigation-demo-1/?safe-area-inset-top=20px&safe-area-inset-bottom=22px"></iframe>
      </>
    );
  }
}

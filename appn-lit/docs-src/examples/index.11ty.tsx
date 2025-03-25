import React from 'react';

export default class Page {
  data() {
    return {
      layout: 'example.11ty.ts',
      title: 'Appn ➡️ AppnPage Example',
      tags: 'example',
      name: 'AppnPage',
      description: 'A basic example',
    };
  }
  render(data) {
    const css = String.raw;
    const styleText = css`
      appn-page::part(layer) {
        outline: solid 1px blue;
        margin: 8px;
        width: 280px;
        height: 600px;
        position: relative;
        border-radius: 24px;
        --safe-area-inset-top: 22px;
        --safe-area-inset-bottom: 20px;

        position: relative;
      }
      appn-page::part(layer)::after {
        content: ' ';
        display: block;
        position: absolute;
        width: 98px;
        height: 4px;
        border-radius: 2px;
        backdrop-filter: invert(1);
        bottom: calc((20px - 4px) * 0.38);
        left: calc((280px - 98px) / 2);
        z-index: 10;
        transition-property: all;
        transition-duration: 300ms;
        transition-timing-function: ease-out;
      }
      .item {
        background: linear-gradient(45deg, #f006, #00f6);
        height: 100px;
      }
    `;
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>

        <appn-page pagetitle="Page Title" theme="ios">
          {Array.from({length: 60}, (_, i) => (
            <div className="item">This is page content. index: {i + 1}</div>
          ))}
          <div slot="footer" style={{textAlign: 'center'}}>
            This is Page Footer
          </div>
        </appn-page>
      </>
    );
  }
}

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
      }
      .item {
        background: linear-gradient(45deg, #f006, #00f6);
      }
    `;
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>

        <appn-page pagetitle="Page Title">
          {Array.from({length: 30}, (_, i) => (
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

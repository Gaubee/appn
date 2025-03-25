import React from 'react';

export default class Page {
  data() {
    return {
      layout: 'example.11ty.ts',
      title: 'Appn ➡️ AppnScrollView Example',
      tags: 'example',
      name: 'AppnScrollView',
      description: 'A basic example',
    };
  }
  render(data) {
    const css = String.raw;
    const styleText = css`
      .scrollview {
        outline: solid 1px blue;
        margin: 8px;
        width: 300px;
        height: 300px;
        border-radius: 24px;
      }
      .item {
        background: linear-gradient(45deg, #f006, #00f6);
        height: 100px;
        width: 100%;
      }
    `;
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>

        <appn-scroll-view class="scrollview">
          {/* <appn-header slot="header">嘻嘻哈哈</appn-header> */}
          {Array.from({length: 60}, (_, i) => (
            <div className="item">This is page content. index: {i + 1}</div>
          ))}
          <div slot="footer" style={{textAlign: 'center'}}>
            This is Page Footer
          </div>
        </appn-scroll-view>
      </>
    );
  }
}

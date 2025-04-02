/// <reference path='../../src/react.ts'/>
import React from 'react';

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
      appn-page::part(layer) {
        outline: solid 1px blue;
        margin: 8px;
        width: 280px;
        height: 360px;
        position: relative;
        border-radius: 24px;
        --safe-area-inset-top: 22px;
        --safe-area-inset-bottom: 20px;

        position: relative;
      }
    `;
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>
        <appn-theme-provider theme="ios">
          <appn-navigation-provider>
            <template slot="router" data-pathname="" data-target="page1-template" />
            <template slot="router" data-pathname="page1" id="page1-template">
              <appn-page id="page1">
                <appn-header>
                  <appn-top-bar>This is Page1</appn-top-bar>
                </appn-header>
                <appn-view>
                  <appn-link to="page2">go to page2</appn-link>
                </appn-view>
              </appn-page>
            </template>
            <template slot="router" data-pathname="page2">
              <appn-page id="page2">
                <appn-header>
                  <appn-top-bar>This is Page2</appn-top-bar>
                </appn-header>
                <appn-view>
                  <appn-link to="page1" type="a">
                    go to page1
                  </appn-link>
                </appn-view>
              </appn-page>
            </template>
          </appn-navigation-provider>
        </appn-theme-provider>
      </>
    );
  }
}

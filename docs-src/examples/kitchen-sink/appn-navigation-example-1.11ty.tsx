import React from 'react';
import type {} from '../../../src/react';

export default class Page {
  data() {
    return {
      layout: 'root.11ty.ts',
      name: 'AppnNavigation',
      description: 'AppnNavigation Example 1',
    };
  }
  render(data) {
    const css = String.raw;
    const styleText = css``;
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: styleText}}></style>
        <appn-theme-provider theme="ios">
          <appn-navigation-provider>
            <template slot="router" data-pathname="" data-hash="">
              <appn-page>
                <appn-header>
                  <appn-top-bar pageTitle="Home">This is Home Page</appn-top-bar>
                </appn-header>
                <appn-view>
                  <appn-link to="#page1">go to page1</appn-link>
                  <appn-link to="#page2" type="a">
                    go to page2
                  </appn-link>
                </appn-view>
              </appn-page>
            </template>
            <template slot="router" data-hash="page1" id="page-template">
              <appn-page onactivated="this.querySelector('appn-top-bar').innerHTML =`This is ${new URL(event.detail.url).hash.replace(/^#/,'')}!!`">
                <appn-header>
                  <appn-top-bar pageTitle="Some">This is Some Page...</appn-top-bar>
                </appn-header>
                <appn-view>
                  <appn-link mode="back">go back</appn-link>
                  <appn-link to="#page1">go to page1</appn-link>
                  <appn-link to="#page2">go to page2</appn-link>
                </appn-view>
              </appn-page>
            </template>
            <template slot="router" data-hash="page2" data-target="page-template"></template>
          </appn-navigation-provider>
        </appn-theme-provider>
      </>
    );
  }
}

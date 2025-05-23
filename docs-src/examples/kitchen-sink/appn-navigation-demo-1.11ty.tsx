import React from 'react';
import type {} from '../../../src/react';
import {escapeHTML} from 'es-escape-html';

export default class Page {
  data() {
    return {
      layout: 'root.11ty.ts',
      title: 'AppnNavigation Demo 1',
    };
  }
  render(data) {
    const injectCss = () => {
      const searchParams = new URLSearchParams(location.search);
      const css = String.raw;
      const styleText = css`
        appn-navigation-provider {
          --safe-area-inset-top: ${searchParams.get('safe-area-inset-top') ?? '0px'};
          --safe-area-inset-bottom: ${searchParams.get('safe-area-inset-bottom') ?? '0px'};
          /* --safe-area-inset-left: ${searchParams.get('safe-area-inset-left') ?? '0px'};
          --safe-area-inset-right: ${searchParams.get('safe-area-inset-right') ?? '0px'}; */
        }
        .qaq {
          width: 100px;
          aspect-ratio: 1;
          background-color: rgba(255, 0, 0, 0.5);
        }
      `;
      document.getElementById('injectStyle')!.innerHTML = styleText;
    };
    return (
      <>
        <style id="injectStyle"></style>
        <script dangerouslySetInnerHTML={{__html: `(${injectCss.toString()})()`}}></script>
        <appn-theme-provider theme="ios">
          <appn-navigation-provider>
            <template slot="router" data-pathname="" data-hash="">
              <appn-page>
                <appn-header>
                  <appn-top-bar>
                    <appn-nav-back slot="start">
                      <appn-nav-back-text></appn-nav-back-text>
                    </appn-nav-back>
                    <appn-nav-title pageTitle="Home">This is Home Page</appn-nav-title>
                  </appn-top-bar>
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
              <appn-page onactivated="this.querySelector('appn-nav-title').pageTitle =`${new URL(event.detail.url).hash.replace(/^#/,'')}!!`">
                <appn-header>
                  <appn-top-bar>
                    <appn-nav-back slot="start">
                      <appn-nav-back-text></appn-nav-back-text>
                    </appn-nav-back>
                    <appn-nav-title pageTitle="Some"></appn-nav-title>
                  </appn-top-bar>
                </appn-header>
                <appn-view>
                  <appn-link mode="back">go back</appn-link>
                  <appn-link to="#page1">
                    go to&nbsp;<appn-nav-text>page1</appn-nav-text>
                  </appn-link>
                  <appn-link to="#page2">
                    go to&nbsp;<appn-nav-text>page2</appn-nav-text>
                  </appn-link>
                  <appn-link to="#page3">
                    go to&nbsp;<appn-nav-text>page3</appn-nav-text>
                  </appn-link>
                  <appn-link mode="replace" to="#page1">
                    replace as page1
                  </appn-link>
                  <appn-link mode="replace" to="#page2">
                    replace as page2
                  </appn-link>
                  <appn-link mode="replace" to="#page3">
                    replace as page3
                  </appn-link>
                  <appn-shared-contents sharedName="card">
                    <div className="qaq">QAQ</div>
                  </appn-shared-contents>
                </appn-view>
              </appn-page>
            </template>
            <template slot="router" data-hash="page2" data-target="page-template"></template>
            <template slot="router" data-hash="page3">
              <appn-page>
                <appn-header>
                  <appn-top-bar>
                    <appn-nav-back slot="start"></appn-nav-back>
                    <appn-nav-title pageTitle="Page3"></appn-nav-title>
                  </appn-top-bar>
                </appn-header>
                <appn-view>
                  <appn-shared-contents
                    sharedName="card"
                    style={{
                      alignSelf: 'center',
                    }}
                  >
                    <div
                      className="qaq"
                      style={{
                        backgroundColor: 'rgba(0, 255, 0, 0.5)',
                        color: 'blue',
                        width: '200px',
                      }}
                    >
                      QAQ
                    </div>
                  </appn-shared-contents>
                  <appn-link mode="back">
                    返回
                    <appn-nav-back-text style={{color: 'red'}}></appn-nav-back-text>
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

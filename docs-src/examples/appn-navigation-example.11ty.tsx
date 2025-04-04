/// <reference path='../../src/react.ts'/>
import React from 'react';
import type {} from '../../src/react'

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
            <template slot="router" data-pathname="" data-hash="">
              <appn-page>
                <appn-header>
                  <appn-top-bar>This is Home Page</appn-top-bar>
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
                  <appn-top-bar>This is Some Page...</appn-top-bar>
                </appn-header>
                <appn-view>
                  <appn-link mode="back">go back</appn-link>
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


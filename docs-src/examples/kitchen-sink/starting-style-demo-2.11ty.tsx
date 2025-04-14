import React from 'react';
import type {} from '../../../src/react';
export default class Page {
  data() {
    return {
      layout: 'root.11ty.ts',
      title: '@starting-style Demo 2',
      scripts: ['/components/starting-style-demo-2.ts'],
      links: ['/public/css/starting-style-demo.css'],
    };
  }
  render() {
    return (
      <>
        <code>{`<css-starting-style slotted="" selector="div.native.showing" cssText="background-color: red!important;"></css-starting-style>`}</code>
        <template id="tmp">
          <div className="native starting-style showing"></div>
          <div className="shim starting-style showing"></div>
        </template>
        <button id="btn">
          Display <code>{'<div>'}</code>'s in <code>{'<custom-div>'}</code>
        </button>
        <custom-div id="canvas"></custom-div>
      </>
    );
  }
}

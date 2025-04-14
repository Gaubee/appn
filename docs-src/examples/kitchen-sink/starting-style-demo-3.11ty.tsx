import React from 'react';
import type {} from '../../../src/react';
export default class Page {
  data() {
    return {
      layout: 'root.11ty.ts',
      title: '@starting-style Demo 3',
      scripts: ['/components/starting-style-demo-3.ts'],
      links: ['/public/css/starting-style-demo.css'],
    };
  }
  render() {
    return (
      <>
        <code>{`<css-starting-style host selector="div.native.showing" cssText="background-color: red!important;"></css-starting-style>`}</code>
        <template id="tmp">
          <custom-div className="native starting-style showing"></custom-div>
          <custom-div className="shim starting-style showing"></custom-div>
        </template>
        <button id="btn">
          Display <code>{'<custom-div>'}</code>'s in <code>{'<div>'}</code>
        </button>
        <div id="canvas"></div>
      </>
    );
  }
}

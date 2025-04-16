import React from 'react';
import type {} from '../../../src/react';
export default class Page {
  data() {
    return {
      layout: 'root.11ty.ts',
      title: '@starting-style Demo 1',
      scripts: ['/components/starting-style-demo-1.ts'],
      links: ['/public/css/starting-style-demo.css'],
    };
  }
  render() {
    const css = String.raw;

    return (
      <>
        <code>{`<css-starting-style selector=".showing" cssText="background-color: red;"></css-starting-style>`}</code>
        <css-starting-style mode="native" selector=".native.showing" cssText="background-color: red;"></css-starting-style>
        <css-starting-style mode="shim" selector=".shim.showing" cssText="background-color: red;"></css-starting-style>
        <template id="tmp">
          <div className="native starting-style showing"></div>
          <div className="shim starting-style showing"></div>
        </template>
        <button id="btn">
          Display <code>{'<div>'}</code>'s
        </button>
        <div id="canvas"></div>
      </>
    );
  }
}

import"./modulepreload-polyfill-B5Qt9EMX.js";import"./starting-style-demo-BRY0SUH6.js";import"./index-BnDskIi1.js";import"./css-color-mix-CkVeYiGO.js";class s extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const t=String.raw;this.shadowRoot.innerHTML=t`
      <slot></slot>
      <css-starting-style mode="native" host selector=".native.showing" cssText="background-color: red!important;"></css-starting-style>
      <css-starting-style mode="shim" host selector=".shim.showing" cssText="background-color: red!important;"></css-starting-style>
    `}}customElements.define("custom-div",s);

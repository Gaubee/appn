import './starting-style-demo-1';
class CustomDivHTML extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    const html = String.raw;
    this.shadowRoot!.innerHTML = html`
      <slot></slot>
      <css-starting-style mode="native" slotted="" selector="div.native.showing" cssText="background-color: red!important;"></css-starting-style>
      <css-starting-style mode="shim" slotted="" selector="div.shim.showing" cssText="background-color: red!important;"></css-starting-style>
    `;
  }
}
customElements.define('custom-div', CustomDivHTML);

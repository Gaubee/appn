import {iter_map_not_null} from '@gaubee/util';
import {html, LitElement} from 'lit';
import {customElement, property, queryAssignedElements} from 'lit/decorators.js';
@customElement('button-group')
export class HTMLButtonGroupElement extends LitElement {
  @property({type: String, reflect: true, attribute: true})
  accessor label: string = '';
  @property({type: Boolean, reflect: true, attribute: true})
  accessor disabled = false;
  @property({type: Boolean, reflect: true, attribute: true})
  accessor multiple = false;
  @queryAssignedElements({selector: 'button'})
  accessor buttons!: HTMLButtonElement[];
  @queryAssignedElements({selector: 'button[data-selected]'})
  accessor selectedButtons!: HTMLButtonElement[];
  get selectedButton() {
    const {selectedButtons} = this;
    return selectedButtons.length ? selectedButtons[0] : null;
  }
  get options() {
    return iter_map_not_null(this.buttons, (btn) => btn.dataset.value);
  }
  get value() {
    return this.selectedButton?.dataset.value ?? null;
  }
  get values() {
    return iter_map_not_null(this.selectedButtons, (btn) => btn.dataset.value);
  }
  constructor() {
    super();
    this.addEventListener('click', (e) => {
      const prev = {value: this.value, values: this.values};

      const selectedBtn = e.target;
      if (!(selectedBtn instanceof HTMLButtonElement)) {
        return;
      }
      if (!this.multiple) {
        for (const btn of this.buttons) {
          btn.removeAttribute('data-selected');
        }
      }

      if (selectedBtn.dataset.selected == null) {
        selectedBtn.dataset.selected = '';
      } else {
        selectedBtn.removeAttribute('data-selected');
      }
      const curr = {value: this.value, values: this.values};
      if (JSON.stringify(prev) !== JSON.stringify(curr)) {
        this.dispatchEvent(
          new CustomEvent('change', {
            detail: curr,
          })
        );
      }
    });
  }
  override render() {
    return html`<style>
        :host {
          display: flex;
          flex-direction: column;
        }
        fieldset {
          all: unset;
        }
        fieldset:disabled {
          background-color: light-dark(rgba(239, 239, 239, 0.3), rgba(19, 1, 1, 0.3));
          color: light-dark(rgba(16, 16, 16, 0.3), rgba(255, 255, 255, 0.3));
          border-color: light-dark(rgba(118, 118, 118, 0.3), rgba(195, 195, 195, 0.3));
        }
        .label {
          font-weight: bold;
          line-height: 2;
        }
        .buttons {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding: 4px 0;
          gap: 4px;
        }

        ::slotted(button) {
          transition-duration: 0.2s;
          transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
        ::slotted(button[data-selected]) {
          filter: drop-shadow(1px 2px 2px black);
          translate: 0 -2px;
        }
        ::slotted(button:not([data-selected])) {
          opacity: 0.6;
        }
      </style>
      <fieldset ?disabled=${this.disabled} class="buttons" part="buttons">
        <legend class="label" part="label">${this.label}</legend>
        <slot></slot>
      </fieldset>`;
  }
}

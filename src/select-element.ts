import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('select-element')
export class SelectElement extends LitElement {
  @property({ type: String }) selectedValue = '';

  static override styles = css`
    select {
      padding: 8px;
      font-size: 16px;
    }
  `;

  handleSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedValue = selectElement.value;
  }

  override render() {
    return html`
      <select @change="${this.handleSelectChange}">
        <option value="">Select an option</option>
        <option value="VM">VM</option>
        <option value="|VM|">|VM|</option>
        <option value="P">P</option>
        <option value="PP">PP</option>
        <option value="RMS">RMS</option>
      </select>
      <p>Selected value: ${this.selectedValue}</p>
    `;
  }
}
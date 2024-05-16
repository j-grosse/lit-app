import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('select-element')
export class SelectElement extends LitElement {
  @property({type: String}) selectedPower = '';
  @property({type: String}) selectedDisplayModeValue = '';
  @property({type: String}) selectedMaxValue = '';

  static override styles = css`
    .options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    select {
      padding: 8px;
      font-size: 16px;
      color: #aaa;
      border: solid 1px #aaa;
      border-radius: 2px;
    }

    select option {
      background: #aaa;
    }

    option:not(:checked) {
      background: #fff;
    }
  `;

  handleSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.id === 'option-power') {
      this.selectedPower = selectElement.value;
    } else if (selectElement.id === 'option-display-mode') {
      this.selectedDisplayModeValue = selectElement.value;
    } else if (selectElement.id === 'option-max-value') {
      this.selectedMaxValue = selectElement.value;
    }

    this.sendSelectedOptions();
  }

  sendSelectedOptions() {
    const options = {
      power: this.selectedPower,
      displayMode: this.selectedDisplayModeValue,
      maxValue: this.selectedMaxValue,
    };

    const socket = new WebSocket('ws://localhost:3000');
    socket.onopen = () => {
      socket.send(JSON.stringify(options));
    };
  }

  override render() {
    return html`
      <div class="options">
        <select id="option-power" @change="${this.handleSelectChange}">
          <option value="AC" selected>AC</option>
          <option value="DC">DC</option>
        </select>
        <!-- <p>Selected power: ${this.selectedPower}</p> -->

        <select id="option-display-mode" @change="${this.handleSelectChange}">
          <option value="VM" selected>VM</option>
          <option value="|VM|">|VM|</option>
          <option value="P">P</option>
          <option value="PP">PP</option>
          <option value="RMS">RMS</option>
        </select>
        <!-- <p>Selected display mode: ${this.selectedDisplayModeValue}</p> -->

        <select id="option-max-value" @change="${this.handleSelectChange}">
          <option value="100mV" selected>100mV</option>
          <option value="200mV">200mV</option>
          <option value="500mV">500mV</option>
          <option value="1V">1V</option>
          <option value="2V">2V</option>
          <option value="10V">10V</option>
        </select>
        <!-- <p>Selected maximum value: ${this.selectedMaxValue}</p> -->
      </div>
    `;
  }
}

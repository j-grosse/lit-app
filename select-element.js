var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let SelectElement = class SelectElement extends LitElement {
    constructor() {
        super(...arguments);
        this.selectedPower = '';
        this.selectedDisplayModeValue = '';
        this.selectedMaxValue = '';
    }
    firstUpdated() {
        this.selectedPower = 'ac';
        this.selectedDisplayModeValue = 'av';
        this.selectedMaxValue = '1';
        this.sendSelectedOptions();
        this.dispatchEvent(new CustomEvent('max-value', { detail: this.selectedMaxValue }));
    }
    handleSelectChange(event) {
        const selectElement = event.target;
        if (selectElement.id === 'option-power') {
            this.selectedPower = selectElement.value;
        }
        else if (selectElement.id === 'option-display-mode') {
            this.selectedDisplayModeValue = selectElement.value;
        }
        else if (selectElement.id === 'option-max-value') {
            this.selectedMaxValue = selectElement.value;
            // Dispatch a custom event to notify the parent component
            this.dispatchEvent(new CustomEvent('max-value-changed', { detail: this.selectedMaxValue }));
        }
        this.sendSelectedOptions();
    }
    // send changed options to server
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
    render() {
        return html `
      <div class="options">
        <select id="option-power" @change="${this.handleSelectChange}">
          <option value="dc" selected>DC</option>
          <option value="ac">AC</option>
        </select>
        <!-- <p>Selected power: ${this.selectedPower}</p> -->

        <select id="option-display-mode" @change="${this.handleSelectChange}">
          <option value="av" selected>AV</option>
          <option value="absAv">|AV|</option>
          <option value="p">P</option>
          <option value="pp">PP</option>
          <option value="rms">RMS</option>
        </select>
        <!-- <p>Selected display mode: ${this.selectedDisplayModeValue}</p> -->

        <select id="option-max-value" @change="${this.handleSelectChange}">
          <option value="0.1">100mV</option>
          <option value="0.2">200mV</option>
          <option value="0.5">500mV</option>
          <option value="1" selected>1V</option>
          <option value="2">2V</option>
          <option value="10">10V</option>
        </select>
        <!-- <p>Selected maximum value: ${this.selectedMaxValue}</p> -->
      </div>
    `;
    }
};
SelectElement.styles = css `
    .options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    select {
      font-family: Open Sans, sans-serif;
      padding: 8px;
      font-size: 16px;
      color: #8693a9;
      border: solid 1px #E1E8F9;
      border-radius: 2px;
    }

    select option {
      background: #aaa;
    }

    option:not(:checked) {
      background: #fff;
    }

    select option:checked {
      background-color: #f0f0f0;
      color: #aaa;
    }
  `;
__decorate([
    property({ type: String })
], SelectElement.prototype, "selectedPower", void 0);
__decorate([
    property({ type: String })
], SelectElement.prototype, "selectedDisplayModeValue", void 0);
__decorate([
    property({ type: String })
], SelectElement.prototype, "selectedMaxValue", void 0);
SelectElement = __decorate([
    customElement('select-element')
], SelectElement);
export { SelectElement };
//# sourceMappingURL=select-element.js.map
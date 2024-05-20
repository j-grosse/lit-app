import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {WebSocketElement} from './websocket-element';
import {GaugeElement} from './gauge-element';
import {DropdownElement} from './dropdown-element';

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
    'websocket-element': WebSocketElement;
    'gauge-element': GaugeElement;
    'dropdown-element': DropdownElement;
  }
}

@customElement('my-element')
export class MyElement extends LitElement {
  @property({type: Object}) socket: WebSocket | null = null;
  @property({type: Array}) messages: number[] = [];
  @property({type: Number}) rawValue = 1.00; // calculated from scaledValue and maxValue
  @property({type: Number}) scaledValue = 1.00; // value from messages array
  @property({type: Number}) gaugeArcValue = 180;

  @property({type: Number}) powerMode = 0;
  @property({type: Number}) displayMode = 0;
  @property({type: Number}) prevMaxValue = 1.00;
  @property({type: Number}) maxValue = 1.00;
  @property({type: String}) maxValueText = '1V'; // text to show in 2nd row below gauge

  static override styles = css`
    body {
      font-family: Open Sans, sans-serif;
      background-color: #fff;
      height: 100vh;
    }

    .heading {
      font-weight: 500;
      color: #8693a9;
      margin: 1rem;
    }

    .card {
      background-color: #fff;
      display: flex;
      flex-direction: column;
      margin: 1rem auto;
      padding: 1rem;
      border: solid 1px #aaa;
      border-radius: 4px;
      box-shadow: 4px 4px 6px #333;
    }

    .display {
      display: flex;
      gap: 1rem;
    }

    .dropdown-menus {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `;

  // run if a property is changed
  override updated() {
    // get the scaled value from the messages array (depending on the selected display mode)
    this.scaledValue =
      this.messages.length > 0 ? this.messages[this.displayMode] : 0;
      console.log('scaledValue: ', this.scaledValue);
    // calculate the corresponding arc value for the analog display
    this.gaugeArcValue = this.rawValue * (180 / this.maxValue);
    console.log('GAUGE ARC VALUE:', this.gaugeArcValue);
    // calculate the raw, unscaled value (is not transmitted in the websocket messages)
    this.rawValue = this.scaledValue * this.maxValue;

    // only send the maxValue if it has changed
    if (this.maxValue !== this.prevMaxValue) {
      this.sendMaxValue();
    }
    // store the current maxValue for comparison in the next update
    this.prevMaxValue = this.maxValue;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      'message-received' as any,
      this.handleMessageReceived
    );
  }

  // populate the messages property
  handleMessageReceived(event: CustomEvent<number[]>) {
    this.messages = event.detail;
  }

  setPowerMode(event: CustomEvent<number>) {
    this.powerMode = event.detail;
    console.log('Power mode changed to: ', this.powerMode);
  }

  setDisplayMode(event: CustomEvent<number>) {
    this.displayMode = event.detail;
  }

  // set maxValue (voltmeter range)
  setMaxValue(event: CustomEvent<number>) {
    this.maxValue = event.detail;
  }

  // set maxValueText below gauge
  setMaxValueText(event: CustomEvent<string>) {
    this.maxValueText = event.detail;
  }

  handleMaxValueChangeUnit(event: CustomEvent<string>) {
    this.maxValueWithUnit = event.detail;
    console.log('UNIT:', event.detail);
  }

  override render() {
    return html`
      <div class="card">
        <p class="heading">VOLTMETER A</p>
        <div class="display">
          <!-- Instantiate the websocket component -->
          <websocket-element
            @message-received="${this.handleMessageReceived}"
          ></websocket-element>

          <!-- use the websocket message values to set the gaugeArcValue property in the gauge-element component that changes the gauge arc css variable and thus displays the values -->

          <gauge-element
            id="myGauge"
            .gaugeArcValue=${this.gaugeArcValue}
            .rawValue=${this.rawValue}
            .scaledValue=${this.scaledValue}
            .maxValueText=${this.maxValueText}
          ></gauge-element>

          <div class="dropdown-menus">
            <dropdown-element
              .selectedOptionText=${'DC'}
              .options=${['DC', 'AC']}
              .optionValues=${[0, 1]}
              @selected-option-value="${this.setPowerMode}"
            ></dropdown-element>

            <dropdown-element
              .selectedOptionText=${'AV'}
              .options=${['AV', '|AV|', 'P', 'PP', 'RMS']}
              .optionValues=${[0, 1, 2, 3, 4]}
              @selected-option-value="${this.setDisplayMode}"
            ></dropdown-element>

            <dropdown-element
              .selectedOptionText=${'1V'}
              .options=${['100mV', '200mV', '500mV', '1V', '2V', '10V']}
              .optionValues=${[0.1, 0.2, 0.5, 1, 2, 10]}
              @selected-option-value="${this.setMaxValue}"
              @selected-option-text="${this.setMaxValueText}"
            ></dropdown-element>
          </div>
        </div>
      </div>
    `;
  }
}

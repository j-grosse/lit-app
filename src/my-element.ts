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
      background-color: #fff;
      height: 100vh;
    }

    h2 {
      font-family: Arial, sans-serif;
      margin-bottom: 1rem;
      color: #8693a9;
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

  messages: number[] = [];
  rawValue: number = 1.0;
  maxValue: number = 1.0;
  maxValueWithUnit: string = '';
  gaugeAngle: number = 180;
  gaugeArcValue: number = 180;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener(
      'message-received' as any,
      this.handleMessageReceived
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      'message-received' as any,
      this.handleMessageReceived
    );
  }

  handleMessageReceived(event: CustomEvent<number[]>) {
    const [av, absAv, p, pp, rms] = event.detail;
    // this.messages = event.detail;
    // populate the array
    this.messages = [];
    this.messages.push(av);
    this.messages.push(absAv);
    this.messages.push(p);
    this.messages.push(pp);
    this.messages.push(rms);
    console.log('MESSAGES', this.messages);
    this.requestUpdate();
  }

  override firstUpdated() {
    const gaugeElement = this.renderRoot.querySelector(
      '.gauge'
    ) as GaugeElement | null;
    if (gaugeElement) {
      gaugeElement.gaugeArcValue = this.messages[0];
      console.log('GAUGE', this.messages[0]);
    }
  }

  // updated range value dispatched by select-element component
  handleMaxValueChange(event: CustomEvent<string>) {
    const selectedMaxValue = event.detail;
    console.log('Selected max value:', selectedMaxValue);
    this.maxValue = parseFloat(selectedMaxValue);
    this.maxValueWithUnit = selectedMaxValue + 'V';
  }
  // let currentValue = this.messages[0];
  // const maxValue = parseFloat(selectedMaxValue);
  // const maxAngle = 180;
  // this.gaugeAngle = currentValue * (maxAngle / maxValue);
  // // this.gaugeAngle =  (currentValue / maxValue) *  maxAngle;
  // console.log('GAUGE ANGLE:', this.gaugeAngle);

  setInitialMaxValue(event: CustomEvent<string>) {
    const initialMaxValue = event.detail;
    const parsedMaxValue = parseFloat(initialMaxValue);
    console.log('parsedMaxValue: ', parsedMaxValue);
    this.maxValueWithUnit = initialMaxValue + 'V';

    if (!isNaN(parsedMaxValue)) {
      if (this.hasOwnProperty('maxValue')) {
        this.maxValue = parsedMaxValue;
      } else {
        console.warn('maxValue property is undefined');
      }
    }
  }

  handleMaxValueChangeUnit(event: CustomEvent<string>) {
    this.maxValueWithUnit = event.detail;
    console.log('UNIT:', event.detail);
  }

  override render() {
    const scaledValue =
      this.messages.length > 0 ? this.messages[0].valueOf() : 0;
    this.gaugeArcValue = scaledValue * (180 / this.maxValue);
    this.rawValue = scaledValue * this.maxValue;
    console.log('raw value: ', this.rawValue + 'V');
    return html`
      <div class="card">
        <h2>VOLTMETER A</h2>
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

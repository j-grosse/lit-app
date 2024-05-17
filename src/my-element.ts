import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {WebSocketElement} from './websocket-element';
import {GaugeElement} from './gauge-element';
import {SelectElement} from './select-element';
// import {TWStyles} from '../Tailwind/twlit.js';
// import '../tailwind.css';

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
    'websocket-element': WebSocketElement;
    'gauge-element': GaugeElement;
    'select-element': SelectElement;
  }
}

@customElement('my-element')
export class MyElement extends LitElement {
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
  `;

  messages: number[] = [];

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
    this.messages = event.detail;
    console.log('MESSAGES', this.messages);
    this.requestUpdate();
  }

  override firstUpdated() {
    const gaugeElement = this.renderRoot.querySelector(
      '.gauge'
    ) as GaugeElement | null;
    if (gaugeElement) {
      gaugeElement.gaugeValue = this.messages[0];
      console.log('GAUGE', this.messages[0]);
    }
  }

  override render() {
    const gaugeValue =
      this.messages && this.messages.length > 0 ? this.messages[0] : undefined;

    return html`
      <div class="card">
        <h1>VOLTMETER</h1>
        <div class="display">
          <!-- Instantiate the websocket component -->
          <websocket-element
            @message-received="${this.handleMessageReceived}"
          ></websocket-element>

          <!-- <meter
            value=${gaugeValue}
            max="2.0"
            min="0.0"
            high=".75"
            low=".25"
            optimum="0.5"
          ></meter> -->

          <gauge-element id="myGauge" .gaugeValue=${gaugeValue}></gauge-element>

          <select-element></select-element>
        </div>
      </div>
    `;
  }
}

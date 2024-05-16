import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {WebSocketElement} from './websocket-element';
import {GaugeElement} from './gauge-element';
import {SelectElement} from './select-element';

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
      background-color: #53575a;
      display: grid;
      justify-content: center;
      align-items: center;
      height: 100vh;
      /* color: red; */
    }

    h1 {
      font-family: Arial, sans-serif;
      margin: 0 auto;
      margin-bottom: 2rem;
      color: #aaa;
    }

    .card {
      /* background-color: #fff; */
      margin: 1rem;
      padding: 1rem;
      border: solid 1px #53575a;
      border-radius: 2px;
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

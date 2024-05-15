import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {WebSocketElement} from './websocket-element';
import {GaugeElement} from './gauge-element';

declare global {
  interface HTMLElementTagNameMap {
    'websocket-element': WebSocketElement;
    'gauge-element': GaugeElement;
    'my-element': MyElement;
  }
}

@customElement('my-element')
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }

    body {
      display: grid;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    svg path {
      will-change: auto;
      stroke-width: 20px;
      stroke-miterlimit: round;
      transition: stroke-dashoffset 850ms ease-in-out;
    }
  `;

  @property({type: Array})
  messages: Number[] = [];

  private socket: WebSocket | null = null;

  override firstUpdated() {
    this.connectWebSocket();
  }

  connectWebSocket() {
    this.socket = new WebSocket('ws://localhost:3000');

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      // Request initial data from the server when the connection is established
      this.socket?.send('initialData');
    };

    this.socket.onmessage = (event) => {
      // change event object data from string to array
      this.messages = JSON.parse(event.data);
      console.log(this.messages);

      if (this.messages.length > 0) {
        const gaugeElement = this.renderRoot.querySelector(
          'gauge-element'
        ) as GaugeElement;
        gaugeElement.gaugeValue = Number(this.messages[0].valueOf());
      }
      // Update the component to trigger re-rendering
      this.requestUpdate();
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  override render() {
    const gaugeValue = this.messages.length > 0 ? this.messages[0].valueOf() : 0;
    return html`
      <h1>VOLTMETER</h1>
      <!-- <websocket-element></websocket-element> -->
      ${this.messages.map((message) => html`<p>${message}</p>`)}

      <meter
      value=${this.messages[0]}
      max="2.0"
      min="0.0"
      high=".75"
      low=".25"
      optimum="0.5"
      ></meter>
      <gauge-element gaugeValue="${gaugeValue}"></gauge-element>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}

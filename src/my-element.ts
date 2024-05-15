import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {WebSocketComponent} from './websocket-component.js';

declare global {
  interface HTMLElementTagNameMap {
    'websocket-component': WebSocketComponent;
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
      // Update the component to trigger re-rendering
      this.requestUpdate();
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  override render() {
    return html`
      <h1>VOLTMETER</h1>
      <!-- <websocket-component></websocket-component> -->
      ${this.messages.map((message) => html`<p>${message}</p>`)}

      <meter
        value=${this.messages[0]}
        max="2.0"
        min="0.0"
        value="0.5"
        high=".75"
        low=".25"
        optimum="0.5"
      ></meter>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}

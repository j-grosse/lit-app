import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('websocket-element')
export class WebSocketElement extends LitElement {
  static override styles = css`
    /* Add your component styles here */
  `;

  @property({type: Array})
  messages: string[] = [];

  override connectedCallback() {
    super.connectedCallback();
    this.connectWebSocket();
  }

  connectWebSocket() {
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messages = [...this.messages, message];
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  override render() {
    return html`
      <div>${this.messages.map((message) => html`<p>${message}</p>`)}</div>
    `;
  }
}

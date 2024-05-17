import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('websocket-element')
export class WebSocketElement extends LitElement {
  static override styles = css`
    /* Add your component styles here */
  `;

@property({type: Array})
messages: number[] = [];

private socket: WebSocket | null = null;

  // override connectedCallback() {
  //   super.connectedCallback();
  //   this.connectWebSocket();
  // }

  override firstUpdated() {
    this.connectWebSocket();
  }
  
  connectWebSocket() {
    this.socket = new WebSocket('ws://localhost:3000');

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      // Request initial data from the server
      this.socket?.send('initialData');
    };

    // receive message from server
    this.socket.onmessage = (event) => {
      this.messages = JSON.parse(event.data);
      this.dispatchEvent(
        new CustomEvent('message-received', {detail: this.messages})
      );

      console.log(
        'Received message sent from server to client: ',
        this.messages
      );

      // Update the component to trigger re-rendering
      this.requestUpdate();
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  override render() {
    return html`
      <!-- ${this.messages.map((message) => html`<p>${message}</p>`)} -->
    `;
  }
}

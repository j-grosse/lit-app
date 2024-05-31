import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('websocket-element')
export class WebSocketElement extends LitElement {
  @property({type: Array}) messages: number[] = [];
  @property({type: Object}) socket: WebSocket | null = null;

  override firstUpdated() {
    this.connectWebSocket();
  }
  connectWebSocket() {
    this.socket = new WebSocket('ws://localhost:8000');

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      // Request initial data from the server
      this.socket?.send('initialData');
      this.socketIsOpen();
    };

    // receive message from server
    this.socket.onmessage = (event) => {
      this.messages = JSON.parse(event.data);
      this.dispatchEvent(
        new CustomEvent('message-received', {detail: this.messages})
      );
      console.log('Client received message from server: ', this.messages);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  socketIsOpen() {
    this.dispatchEvent(
      new CustomEvent('socket-opened', {
        detail: {
          socket: this.socket,
        },
      })
    );
  }

  override render() {
    return html`
      <!-- ${this.messages.map((message) => html`<p>${message}</p>`)} -->
    `;
  }
}

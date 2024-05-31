var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let WebSocketElement = class WebSocketElement extends LitElement {
    constructor() {
        super(...arguments);
        this.messages = [];
        this.socket = null;
    }
    firstUpdated() {
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
            this.dispatchEvent(new CustomEvent('message-received', { detail: this.messages }));
            console.log('Client received message from server: ', this.messages);
        };
        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }
    socketIsOpen() {
        this.dispatchEvent(new CustomEvent('socket-opened', {
            detail: {
                socket: this.socket,
            },
        }));
    }
    render() {
        return html `
      <!-- ${this.messages.map((message) => html `<p>${message}</p>`)} -->
    `;
    }
};
__decorate([
    property({ type: Array })
], WebSocketElement.prototype, "messages", void 0);
__decorate([
    property({ type: Object })
], WebSocketElement.prototype, "socket", void 0);
WebSocketElement = __decorate([
    customElement('websocket-element')
], WebSocketElement);
export { WebSocketElement };
//# sourceMappingURL=websocket-element.js.map
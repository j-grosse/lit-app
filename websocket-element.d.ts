import { LitElement } from 'lit';
export declare class WebSocketElement extends LitElement {
    messages: number[];
    socket: WebSocket | null;
    firstUpdated(): void;
    connectWebSocket(): void;
    socketIsOpen(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=websocket-element.d.ts.map
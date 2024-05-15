import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
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

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0;

  override render() {
    return html`
      <h1>VOLTMETER</h1>
      <meter
        value="0.5"
        max="1.0"
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

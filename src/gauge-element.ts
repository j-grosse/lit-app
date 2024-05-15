import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('gauge-element')
export class GaugeElement extends LitElement {
  // @property({type: Array})
  // gaugeValue: number[] = [];

  @property({type: Number})
  gaugeValue: 0 | number = 0;

  protected override updated(changed: PropertyValues): void {
    if (changed.has('gaugeValue')) {
      this.style.setProperty('--gauge-value', `${this.gaugeValue}deg`);
    }
  }
  // protected override updated() {
  //   // Update the CSS variable when gaugeValue changes
  //   this.style.setProperty('--gauge-value', this.gaugeValue.toString());
  // }

  static override styles = css`
    :host {
      --gauge-value: 0; /* Default value */
    }
    .gauge {
      height: 85px;
      /*overflow: hidden;*/
      position: relative;
      width: 170px;
    }

    .gauge .arc {
      background-image: radial-gradient(#fff 0, #fff 60%, transparent 60%),
        conic-gradient(
          orange 0,
          /* orange 15deg,
          #ccc 15deg, */
          orange var(--gauge-value),
          #ccc var(--gauge-value),
          #ccc 180deg,
          #fff 180deg,
          #fff 360deg
        );
      background-position: center center, center center;
      background-repeat: no-repeat;
      background-size: 100% 100%, 100% 100%;
      border-radius: 50%;
      border-style: none;
      height: 170px;
      position: relative;
      transform: rotate(-90deg);
      width: 100%;
    }
    /* .gauge .pointer {
      background: #fff;
      border: 1px solid #000;
      border-radius: 5px;
      bottom: 0;
      content: '';
      height: 6px;
      left: 0;
      position: absolute;
      transform: rotate(135deg) translateX(2px) translateY(-6px);
      transform-origin: 85px 0;
      width: 20px;
      z-index: 5;
    } */
    .gauge .mask::before,
    .gauge .mask::after {
      background-image: radial-gradient(
        transparent 0,
        transparent 50%,
        #fff 50%,
        #fff 100%
      );
      clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%);
      content: '';
      height: 18px;
      position: absolute;
      width: 18px;
    }
    .gauge .mask::before {
      left: -2px;
      bottom: 0;
    }
    .gauge .mask::after {
      bottom: 0;
      right: -2px;
    }
    .gauge .label {
      bottom: 20px;
      font-size: 16px;
      font-weight: 700;
      left: 0;
      line-height: 26px;
      position: absolute;
      text-align: center;
      width: 100%;
    }
  `;

  override render() {
    return html`
      <div class="gauge">
        <div class="arc"></div>
        <div class="pointer"></div>
        <div class="mask"></div>
        <div class="label">75% (135°)</div>
      </div>
    `;
  }
}

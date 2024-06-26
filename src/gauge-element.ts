import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('gauge-element')
export class GaugeElement extends LitElement {
  @property({type: Number}) gaugeArcValue = 180;
  @property({type: Number}) rawValue = 1.00;
  @property({type: Number}) scaledValue = 1.00;
  @property({type: String}) maxValueText = '';

  static override styles = css`
    body {
      font-family: Open Sans, sans-serif;
    }

    .gauge {
      height: 85px;
      width: 170px;
      overflow: hidden;
      position: relative;
    }

    .gauge .arc {
      background-image: radial-gradient(#fff 0, #fff 60%, transparent 60%),
        /* inner circle */
          conic-gradient(
            #f09605 0,
            #f09605 var(--gauge-arc-value),
            #e1e8f9 var(--gauge-arc-value),
            #e1e8f9 180deg,
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
      bottom: -20px;
      color: #8693a9;
      left: 0;
      line-height: 26px;
      position: absolute;
      text-align: center;
      width: 100%;
    }

    .gauge .label ul {
      list-style: none;
      padding: 0;
    }

    .gauge .label li {
      text-align: center;
      font-size: 1.5rem;
    }

    #unit {
      font-size: 0.5rem;
    }
  `;

  protected override updated(changed: PropertyValues): void {
    if (changed.has('gaugeArcValue')) {
      this.style.setProperty('--gauge-arc-value', `${this.gaugeArcValue}deg`);
    }
  }

  override render() {
    return html`
      <div class="gauge">
        <div class="arc"></div>
        <div class="pointer"></div>
        <div class="mask"></div>
        <div class="label">
          <ul>
            <li>${this.rawValue.toFixed(2)}</li>
            <li id="unit">${this.maxValueText}</li>
          </ul>
        </div>
      </div>
    `;
  }
}

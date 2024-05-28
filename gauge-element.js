var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let GaugeElement = class GaugeElement extends LitElement {
    constructor() {
        super(...arguments);
        this.gaugeArcValue = 180;
        this.rawValue = 1.00;
        this.scaledValue = 1.00;
        this.maxValueText = '';
    }
    updated(changed) {
        if (changed.has('gaugeArcValue')) {
            this.style.setProperty('--gauge-arc-value', `${this.gaugeArcValue}deg`);
        }
    }
    render() {
        return html `
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
};
GaugeElement.styles = css `
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
__decorate([
    property({ type: Number })
], GaugeElement.prototype, "gaugeArcValue", void 0);
__decorate([
    property({ type: Number })
], GaugeElement.prototype, "rawValue", void 0);
__decorate([
    property({ type: Number })
], GaugeElement.prototype, "scaledValue", void 0);
__decorate([
    property({ type: String })
], GaugeElement.prototype, "maxValueText", void 0);
GaugeElement = __decorate([
    customElement('gauge-element')
], GaugeElement);
export { GaugeElement };
//# sourceMappingURL=gauge-element.js.map
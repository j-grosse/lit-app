import { LitElement, PropertyValues } from 'lit';
export declare class GaugeElement extends LitElement {
    gaugeArcValue: number;
    rawValue: number;
    scaledValue: number;
    maxValueText: string;
    static styles: import("lit").CSSResult;
    protected updated(changed: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=gauge-element.d.ts.map
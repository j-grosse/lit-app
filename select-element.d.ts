import { LitElement } from 'lit';
export declare class SelectElement extends LitElement {
    selectedPower: string;
    selectedDisplayModeValue: string;
    selectedMaxValue: string;
    static styles: import("lit").CSSResult;
    firstUpdated(): void;
    handleSelectChange(event: Event): void;
    sendSelectedOptions(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=select-element.d.ts.map
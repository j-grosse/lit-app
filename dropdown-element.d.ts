import { LitElement } from 'lit';
export declare class DropdownElement extends LitElement {
    isDropdownActive: boolean;
    selectedOptionText: string;
    selectedOptionValue: number;
    options: string[];
    optionValues: number[];
    static styles: import("lit").CSSResult;
    firstUpdated(): void;
    handleClickOutside: (event: Event) => void;
    handleClick(): void;
    handleOptionClick(item: string, option: number): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=dropdown-element.d.ts.map
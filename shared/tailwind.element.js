import { LitElement, css, unsafeCSS } from "lit";
import style from "./tailwind.global.css";
const tailwindElement = (baseClass) => {
    class TailwindElementClass extends baseClass {
        constructor() {
            super();
        }
    }
    TailwindElementClass.styles = [
        unsafeCSS(style),
        css `
        /* Add your additional styles here */
      `
    ];
    return TailwindElementClass;
};
export const TailwindElement = tailwindElement(LitElement);
//# sourceMappingURL=tailwind.element.js.map
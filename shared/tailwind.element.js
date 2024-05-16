import { LitElement, unsafeCSS } from "lit";
import style from "./tailwind.global.css";
const tailwindElement = unsafeCSS(style);
export const TailwindElement = (style) => { var _a; return _a = class extends LitElement {
    },
    _a.styles = [tailwindElement, unsafeCSS(style)],
    _a; };
//# sourceMappingURL=tailwind.element.js.map
import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('dropdown-element')
export class DropdownElement extends LitElement {
  @property({type: Boolean}) isDropdownActive = false;
  @property({type: String}) selectedOptionText = '';
  @property({type: Number}) selectedOptionValue = 0;
  @property({type: Array}) options: string[] = [];
  @property({type: Array}) optionValues: number[] = [];

  static override styles = css`
    /* button */
    .dropbtn {
      font-family: Open Sans, sans-serif;
      background-color: #fff;
      color: #8693a9;
      font-size: 1rem;
      border: solid 1px #e1e8f9;
      border-radius: 2px;
      padding: 8px 10px;
      min-width: 160px;
      text-align: left;
      cursor: pointer;
    }

    .dropbtn svg {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-70%) rotate(0deg);
      transition: transform 0.15s;
      width: 16px;
      height: 16px;
      fill: #8693a9;
    }

    .dropdown.active .dropbtn svg {
      transform: translateY(-30%) rotate(180deg);
    }

    /* dropdown content positioning */
    .dropdown {
      position: relative;
      display: inline-block;
    }

    /* dropdown content */
    .dropdown-content {
      position: absolute;
      top: 30px;
      color: #8693a9;
      background-color: #fff;
      border: solid 1px #e1e8f9;
      min-width: 160px;
      padding: 8px 12px;
      padding: 0;
      z-index: 1;
      cursor: pointer;
      opacity: 0;
      display: none;
      transform: translateY(0px);
      transition: opacity 0.2s ease;
    }

    /* change button color when the dropdown content is shown */
    .dropdown.active .dropbtn {
      color: #f09605;
      border-color: #f09605;
    }

    .dropdown.active .dropdown-content {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }

    .dropdown-content li {
      padding: 8px 10px;
    }

    /* Change color of dropdown links on hover */
    .dropdown-content li:hover {
      color: #fff;
      background-color: #8693a9;
    }

    ul {
      list-style-type: none;
    }
  `;

  // close menu on click outside of menu
  override connectedCallback() {
    super.connectedCallback();
    this.attachShadow({mode: 'open'});
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside = (event: Event) => {
    const dropdown = this.shadowRoot?.querySelector('.dropdown');
    const target = event.target as Node;
    if (dropdown && !dropdown.contains(target)) {
      this.isDropdownActive = false;
    }
  };

  // open menu on click
  handleClick() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  handleOptionClick(item: string, option: number) {
    console.log('selected option value', option);
    // update button text
    this.selectedOptionValue = option;
    this.selectedOptionText = item;

    // close dropdown
    this.isDropdownActive = false;

    // pass selected option value and text to parent component
    this.dispatchEvent(
      new CustomEvent('selected-option-value', {
        detail: this.selectedOptionValue,
      })
    );
    this.dispatchEvent(
      new CustomEvent('selected-option-text', {
        detail: this.selectedOptionText,
      })
    );
  }

  override render() {
    return html`
      <div class="dropdown ${this.isDropdownActive ? 'active' : ''}">
        <div>
          <button class="dropbtn" @click=${this.handleClick}>
            ${this.selectedOptionText}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"
              />
            </svg>
          </button>
          <ul id="dropdown-content" class="dropdown-content">
            ${this.options.map(
              (item, index) => html`<li
                value="${this.optionValues[index]}"
                @click=${() =>
                  this.handleOptionClick(item, this.optionValues[index])}
              >
                ${item}
              </li>`
            )}
          </ul>
        </div>
      </div>
    `;
  }
}

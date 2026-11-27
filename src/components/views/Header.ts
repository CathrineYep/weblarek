import { Component } from "../base/Component";

interface IHeaderActions {
  onCartClick: () => void;
}

export class Header extends Component<any> {
  private counterElement: HTMLElement | null = null;
  private cartButton: HTMLElement | null = null;

  constructor(container: HTMLElement, actions: IHeaderActions) {
    super(container);

    this.counterElement = container.querySelector(".header__basket-counter");

    this.cartButton = container.querySelector(".header__basket");

    if (this.cartButton) {
      this.cartButton.addEventListener("click", () => {
        actions.onCartClick();
      });
    }
  }

  set counter(value: number) {
    if (this.counterElement) {
      this.counterElement.textContent = value.toString();
    }
  }
}

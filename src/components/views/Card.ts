import { Component } from "../base/Component";

export interface ICardData {
  title: string;
  price: number | null;
}

export class Card extends Component<ICardData> {
  protected titleElement: HTMLElement | null = null;
  protected priceElement: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector(".card__title");
    this.priceElement = container.querySelector(".card__price");
  }

  set title(value: string) {
    if (this.titleElement) this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (this.priceElement) {
      this.priceElement.textContent =
        value === null ? "Бесценно" : `${value} синапсов`;
    }
  }
}

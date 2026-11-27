import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";

export class Card extends Component<any> {
  protected titleElement: HTMLElement | null = null;
  protected priceElement: HTMLElement | null = null;
  protected categoryElement: HTMLElement | null = null;
  protected imageElement: HTMLImageElement | null = null;
  protected buyButton: HTMLButtonElement | null = null;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = container.querySelector(".card__title");
    this.priceElement = container.querySelector(".card__price");
    this.categoryElement = container.querySelector(".card__category");
    this.imageElement = container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    this.buyButton = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;
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

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.className = "card__category";

      const modifier = categoryMap[value as keyof typeof categoryMap];

      if (modifier) {
        this.categoryElement.classList.add(modifier);
      } else {
      }

      this.categoryElement.textContent = value;
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.imageElement.src = "";
      this.imageElement.src = value;
      this.imageElement.alt = "Товар";
    }
  }

  set text(value: string) {
    const el = this.container.querySelector(".card__text");
    if (el) el.textContent = value;
  }

  render(
    data?: Partial<{
      title: string;
      price: number | null;
      category: string;
      image: string;
      text: string;
    }>,
  ) {
    if (!data) return this.container;
    if (data.title !== undefined) this.title = data.title;
    if (data.price !== undefined) this.price = data.price;
    if (data.category !== undefined) this.category = data.category;
    if (data.image !== undefined) this.image = data.image;
    if ((data as any).text !== undefined) this.text = (data as any).text;

    return this.container;
  }
}

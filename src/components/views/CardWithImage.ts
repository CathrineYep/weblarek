import { Card, ICardData } from "./Card";
import { categoryMap } from "../../utils/constants";

export interface ICardWithImageData extends ICardData {
  category: string;
  image: string;
  text?: string;
}

export class CardWithImage extends Card {
  protected categoryElement: HTMLElement | null = null;
  protected imageElement: HTMLImageElement | null = null;
  protected buyButton: HTMLButtonElement | null = null;

  constructor(container: HTMLElement) {
    super(container);
    this.categoryElement = container.querySelector(".card__category");
    this.imageElement = container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    this.buyButton = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.className = "card__category";
      const modifier = categoryMap[value as keyof typeof categoryMap];
      if (modifier) this.categoryElement.classList.add(modifier);
      this.categoryElement.textContent = value;
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.imageElement.src = value;
      this.imageElement.alt = "Товар";
    }
  }

  set text(value: string) {
    const el = this.container.querySelector(".card__text");
    if (el) el.textContent = value;
  }
}

import { Card } from "./Card";

interface ICardBasketActions {
  onDelete: () => void;
}

export class CardBasket extends Card {
  private deleteButton: HTMLButtonElement | null = null;
  private indexEl: HTMLElement | null = null;

  constructor(container: HTMLElement, actions: ICardBasketActions) {
    super(container);

    this.deleteButton = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;
    this.indexEl = container.querySelector(".basket__item-index");

    if (this.deleteButton) {
      this.deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        actions.onDelete();
      });
    }
  }

  set index(value: number) {
    if (this.indexEl) {
      this.indexEl.textContent = value.toString();
    }
  }
}

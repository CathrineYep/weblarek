import { Card } from "./Card";

interface ICardActions {
  onBuy: () => void;
}

export class CardCatalog extends Card {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    if (actions?.onBuy) {
      this.container.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        actions.onBuy();
      });
    }
  }
}

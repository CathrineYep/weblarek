import { CardWithImage } from "./CardWithImage";

interface ICardActions {
  onBuy: () => void;
}

export class CardCatalog extends CardWithImage {
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

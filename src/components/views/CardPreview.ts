import { Card } from "./Card";

interface ICardPreviewActions {
  onToggle: () => void;
}

export class CardPreview extends Card {
  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    const realBuyButton = this.container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    if (realBuyButton) {
      this.buyButton = realBuyButton;
    }

    if (this.buyButton && actions?.onToggle) {
      this.buyButton.addEventListener("click", () => {
        actions.onToggle();
      });
    }
  }

  set text(value: string) {
    const textElement = this.container.querySelector(".card__text");
    if (textElement) textElement.textContent = value;
  }

  set button(value: string) {
    if (this.buyButton) {
      this.buyButton.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (this.buyButton) {
      this.buyButton.disabled = value;

      if (value) {
        this.buyButton.classList.remove("button_alt");
        this.buyButton.classList.add("button_alt-disabled");
      } else {
        this.buyButton.classList.remove("button_alt-disabled");
      }
    }
  }
}

import { CardWithImage } from "./CardWithImage";

interface ICardPreviewActions {
  onToggle: () => void;
}

export class CardPreview extends CardWithImage {
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

  set button(value: string) {
    if (this.buyButton) {
      this.buyButton.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (this.buyButton) {
      this.buyButton.disabled = value;

      if (value) {
        this.buyButton.classList.add("button_alt-disabled");
      } else {
        this.buyButton.classList.remove("button_alt-disabled");
      }
    }
  }
}

import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Basket extends Component<any> {
  private totalElement: HTMLElement | null = null;
  private orderButton: HTMLButtonElement | null = null;
  private itemsList: HTMLElement | null = null;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.totalElement = container.querySelector(".basket__price");
    this.orderButton = container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;
    this.itemsList = container.querySelector(".basket__list");

    if (this.orderButton) {
      this.orderButton.addEventListener("click", () => {
        this.events.emit("order:open");
      });
      this.orderButton.disabled = true;
    }
  }

  set items(cards: HTMLElement[]) {
    if (!this.itemsList) return;
    this.itemsList.replaceChildren(...cards);
  }

  set total(value: number) {
    if (this.totalElement) {
      this.totalElement.textContent = `${value} синапсов`;
    }
  }

  set isButtonDisabled(value: boolean) {
    if (this.orderButton) {
      this.orderButton.disabled = value;
    }
  }
}

import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CardBasket } from "./CardBasket";
import { cloneTemplate } from "../../utils/utils";

export class Basket extends Component<any> {
  private totalElement: HTMLElement | null = null;
  private orderButton: HTMLButtonElement | null = null;
  private itemsList: HTMLElement | null = null;
  private cardTemplate: HTMLTemplateElement | null;

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
    this.cardTemplate = document.getElementById(
      "card-basket",
    ) as HTMLTemplateElement | null;

    if (this.orderButton) {
      this.orderButton.addEventListener("click", () => {
        this.events.emit("order:open");
      });
      this.orderButton.disabled = true;
    }
  }

  set items(products: IProduct[]) {
    if (!this.itemsList || !this.cardTemplate) return;

    const cards = products.map((product, index) => {
      const cardElement = cloneTemplate(this.cardTemplate!);
      const card = new CardBasket(cardElement, {
        onDelete: () => this.events.emit("basket:remove", product),
      });
      card.title = product.title;
      card.price = product.price;
      card.index = index + 1;
      return card.render();
    });

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

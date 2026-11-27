import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CardCatalog } from "./CardCatalog";
import { cloneTemplate } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

interface IGallery {
  products: IProduct[];
}

export class Gallery extends Component<IGallery> {
  private cardTemplate: HTMLTemplateElement | null;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.cardTemplate = document.getElementById(
      "card-catalog",
    ) as HTMLTemplateElement | null;
  }

  set catalog(items: IProduct[]) {
    if (!this.cardTemplate) return;

    const cards = items.map((product) => {
      const cardElement = cloneTemplate(this.cardTemplate!);
      const card = new CardCatalog(cardElement, {
        onBuy: () => this.events.emit("card:clicked", product),
      });
      return card.render({
        title: product.title,
        price: product.price,
        image: `${CDN_URL}${product.image}`,
        category: product.category,
      });
    });

    this.container.replaceChildren(...cards);
  }
}

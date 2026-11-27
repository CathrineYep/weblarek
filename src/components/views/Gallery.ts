import { Component } from "../base/Component";

export interface IGalleryData {
  catalog: HTMLElement[];
}
export class Gallery extends Component<IGalleryData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(cards: HTMLElement[]) {
    this.container.replaceChildren(...cards);
  }
}

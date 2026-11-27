import { Component } from "../base/Component";

export class SuccessModal extends Component<any> {
  private descriptionElement: HTMLElement | null = null;
  private onCloseCallback: () => void;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);
    this.onCloseCallback = onClose;

    this.descriptionElement = container.querySelector(
      ".order-success__description",
    );

    const closeBtn = container.querySelector(".order-success__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.onCloseCallback();
      });
    }
  }

  set price(value: number) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = `Списано ${value} синапсов`;
    } else {
      console.error(
        "[SuccessModal] Не удалось найти элемент .order-success__description. Проверьте HTML.",
      );
    }
  }

  render() {
    return this.container;
  }
}

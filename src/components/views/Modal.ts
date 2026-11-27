import { Component } from "../base/Component";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  private readonly modalElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly contentContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.modalElement = container;

    const closeBtn = this.modalElement.querySelector(".modal__close");
    const content = this.modalElement.querySelector(".modal__content");

    if (!closeBtn || !content) {
      throw new Error(
        "Ошибка инициализации Modal: не найдены элементы .modal__close или .modal__content. Проверьте HTML шаблон.",
      );
    }

    this.closeButton = closeBtn as HTMLButtonElement;
    this.contentContainer = content as HTMLElement;

    this.closeButton.addEventListener("click", () => this.close());

    this.modalElement.addEventListener("click", (e) => {
      if (e.target === this.modalElement) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  render(data?: Partial<IModalData>): HTMLElement {
    const container = super.render(data);

    if (data && data.content) {
      this.content = data.content;
    }

    this.open();

    return container;
  }

  open(): void {
    this.modalElement.classList.add("modal_active");
  }

  close(): void {
    this.modalElement.classList.remove("modal_active");
  }

  isOpen(): boolean {
    return this.modalElement.classList.contains("modal_active");
  }
}

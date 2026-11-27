import { Component } from "../base/Component";

export class Form extends Component<any> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement | null;
  protected inputs: Record<
    string,
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = {};

  constructor(
    container: HTMLElement,
    protected onUserAction: (eventName: string, payload: any) => void,
  ) {
    super(container);

    this.formElement =
      (container.querySelector("form") as HTMLFormElement) || container;

    const submitBtn = this.formElement.querySelector('button[type="submit"]');
    if (!submitBtn) {
      throw new Error(
        "В шаблоне формы должна быть кнопка <button type='submit'>",
      );
    }
    this.submitButton = submitBtn as HTMLButtonElement;

    this.errorsElement =
      this.formElement.querySelector(".form__errors") ?? null;

    this.bindInputs();

    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onUserAction("form:submit", {});
    });
  }

  private bindInputs(): void {
    const fields = this.formElement.querySelectorAll("[name]");

    fields.forEach((field) => {
      const el = field as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement;
      const name = el.name;

      if (name) {
        this.inputs[name] = el;

        const handleChange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          this.onUserAction("field:change", {
            name: target.name,
            value: target.value.trim(),
          });
        };

        el.addEventListener("input", handleChange);
        el.addEventListener("change", handleChange);
      }
    });
  }

  setErrors(errors: string[]): void {
    if (this.errorsElement) {
      if (errors.length > 0) {
        this.errorsElement.textContent = errors.join(", ");
        this.errorsElement.style.display = "block";
      } else {
        this.errorsElement.textContent = "";
        this.errorsElement.style.display = "none";
      }
    }
  }

  setSubmitState(isActive: boolean): void {
    this.submitButton.disabled = !isActive;
    if (isActive) {
      this.submitButton.classList.remove("button_disabled");
    } else {
      this.submitButton.classList.add("button_disabled");
    }
  }
}

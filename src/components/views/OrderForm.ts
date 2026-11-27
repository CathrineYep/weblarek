import { Form } from "./Form";
import { TPayment } from "../../types";

export class OrderForm extends Form {
  private cardButton: HTMLButtonElement | null;
  private cashButton: HTMLButtonElement | null;

  constructor(
    container: HTMLElement,
    onUserAction: (eventName: string, payload: any) => void,
  ) {
    super(container, onUserAction);

    this.cardButton = this.formElement.querySelector('button[name="card"]');
    this.cashButton = this.formElement.querySelector('button[name="cash"]');

    this.cardButton?.addEventListener("click", () => {
      this.onUserAction("field:change", {
        name: "payment",
        value: TPayment.CARD,
      });
    });

    this.cashButton?.addEventListener("click", () => {
      this.onUserAction("field:change", {
        name: "payment",
        value: TPayment.CASH,
      });
    });
  }

  set payment(value: TPayment | null) {
    const isCard = value === TPayment.CARD;
    const isCash = value === TPayment.CASH;

    this.cardButton?.classList.toggle("button_alt-active", isCard);
    this.cashButton?.classList.toggle("button_alt-active", isCash);
  }

  set address(value: string) {
    const el = this.inputs["address"] as HTMLInputElement | undefined;
    if (el) el.value = value;
  }
}

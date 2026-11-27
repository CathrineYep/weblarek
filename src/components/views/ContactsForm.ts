import { Form } from "./Form";

export class ContactsForm extends Form {
  constructor(
    container: HTMLElement,
    onUserAction: (eventName: string, payload: any) => void,
  ) {
    super(container, onUserAction);
  }

  set email(value: string) {
    const el = this.inputs["email"] as HTMLInputElement | undefined;
    if (el) el.value = value;
  }

  set phone(value: string) {
    const el = this.inputs["phone"] as HTMLInputElement | undefined;
    if (el) el.value = value;
  }
}

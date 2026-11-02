import { IBuyer, ValidationErrors, TPayment } from "../../../types";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  updateData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address.trim();
    }

    if (data.phone !== undefined) {
      this.phone = data.phone.trim();
    }

    if (data.email !== undefined) {
      this.email = data.email.trim();
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearData(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  validateData(): ValidationErrors<IBuyer> {
    const errors: ValidationErrors<IBuyer> = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.address) {
      errors.address = "Укажите адрес";
    }

    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }

    if (!this.email) {
      errors.email = "Укажите email";
    }

    return errors;
  }
}

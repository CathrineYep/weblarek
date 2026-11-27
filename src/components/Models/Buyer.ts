import { IBuyer, ValidationErrors, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export type BuyerEvent = "data:updated" | "data:cleared" | "validation:updated";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  constructor(private events: EventEmitter) {}

  updateData(data: Partial<IBuyer>): void {
    let hasChanges = false;

    if (data.payment !== undefined && data.payment !== this.payment) {
      this.payment = data.payment;
      hasChanges = true;
    }

    if (data.address !== undefined) {
      const trimmed = data.address.trim();
      if (trimmed !== this.address) {
        this.address = trimmed;
        hasChanges = true;
      }
    }

    if (data.phone !== undefined) {
      const trimmed = data.phone.trim();
      if (trimmed !== this.phone) {
        this.phone = trimmed;
        hasChanges = true;
      }
    }

    if (data.email !== undefined) {
      const trimmed = data.email.trim();
      if (trimmed !== this.email) {
        this.email = trimmed;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this.events.emit("data:updated", data);

      this.events.emit("validation:updated", {
        errors: this.getErrors(),
        isValid: this.isValid(),
      });
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

  isValid(): boolean {
    const errors = this.validateData();
    return Object.keys(errors).length === 0;
  }

  getErrors(): ValidationErrors<IBuyer> {
    return this.validateData();
  }

  clearData(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";

    this.events.emit("data:cleared");
  }

  validateData(): ValidationErrors<IBuyer> {
    const errors: ValidationErrors<IBuyer> = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.address) {
      errors.address = "Укажите адрес";
    }

    if (!this.email) {
      errors.email = "Введите email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        errors.email = "Некорректный формат email";
      }
    }

    if (!this.phone) {
      errors.phone = "Введите телефон";
    } else {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;

      const hasLetters = /[a-z]/i.test(this.phone);

      if (hasLetters) {
        errors.phone = "Телефон не должен содержать буквы";
      } else if (!phoneRegex.test(this.phone)) {
        errors.phone = "Некорректный формат телефона";
      }
    }

    return errors;
  }
}

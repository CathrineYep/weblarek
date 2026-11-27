import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export type BasketEvent =
  | "item:added"
  | "item:removed"
  | "basket:updated"
  | "basket:cleared";

export class Cart {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit("item:added", product);
    this.events.emit("basket:updated", this.items);
  }

  removeItemById(id: string | number): void {
    const product = this.items.find((item) => item.id === id);
    if (product) {
      this.removeItem(product);
    }
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit("item:removed", product);
      this.events.emit("basket:updated", this.items);
    }
  }

  clearData(): void {
    this.items = [];
    this.events.emit("basket:cleared", this.items);
    this.events.emit("basket:updated", this.items);
  }
}

import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
export interface IProducts {
  setProducts(products: IProduct[]): void;
  setSelectedProduct(item: IProduct): void;
  getSelectedProduct(): IProduct | null;
  getProducts(): IProduct[];
  getProductById(id: string): IProduct | undefined;
}
export class ProductCatalog implements IProducts {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("products:updated", products);
  }

  public setSelectedProduct(item: IProduct): void {
    this.selectedProduct = item;
    this.events.emit("preview:changed");
  }

  public getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }
}

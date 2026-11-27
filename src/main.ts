import { EventEmitter } from "./components/base/Events";
import { ProductCatalog } from "./components/Models/ProductCatalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Modal } from "./components/views/Modal";
import { Basket } from "./components/views/Basket";
import { Gallery } from "./components/views/Gallery";
import { CardPreview } from "./components/views/CardPreview";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { Header } from "./components/views/Header";
import { SuccessModal } from "./components/views/SuccessModal";
import { CDN_URL, API_URL } from "./utils/constants";
import { ApiClient } from "./components/ApiClient";
import { Api } from "./components/base/Api";
import { IProduct } from "./types";
import { cloneTemplate } from "./utils/utils";
import "./scss/styles.scss";
import { CardBasket } from "./components/views/CardBasket";
import { CardCatalog } from "./components/views/CardCatalog";

const events = new EventEmitter();

const apiInstance = new Api(API_URL);
const apiClient = new ApiClient(apiInstance);

const productCatalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const modal = new Modal(document.querySelector(".modal") as HTMLElement);

const gallery = new Gallery(document.querySelector(".gallery") as HTMLElement);

const headerContainer = document.querySelector(".header") as HTMLElement;
const header = new Header(headerContainer, {
  onCartClick: () => {
    events.emit("basket:open");
  },
});

const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const basketContainer = cloneTemplate(basketTemplate);

console.log("[Presenter] Все компоненты инициализированы.");

// ЗАГРУЗКА ДАННЫХ С СЕРВЕРА

(async () => {
  try {
    console.log("[Presenter] Загрузка товаров с сервера...");
    const response = await apiClient.getProducts();

    const productsToSet = Array.isArray(response.items)
      ? response.items
      : Array.isArray(response)
        ? response
        : [];

    productCatalog.setProducts(productsToSet);
  } catch (error) {
    console.error("[Presenter] Ошибка загрузки товаров:", error);
  }
})();

// ОТРИСОВКА ГАЛЕРЕИ

events.on("products:updated", (products: IProduct[]) => {
  console.log(
    `[Presenter] Получено ${products.length} товаров. Начинаем отрисовку.`,
  );

  const catalogTemplate = document.getElementById(
    "card-catalog",
  ) as HTMLTemplateElement;

  const cards = products.map((product) => {
    const cardElement = cloneTemplate(catalogTemplate);
    const card = new CardCatalog(cardElement, {
      onBuy: () => events.emit("card:clicked", product),
    });
    return card.render({
      title: product.title,
      price: product.price,
      image: `${CDN_URL}${product.image}`,
      category: product.category,
    });
  });

  gallery.catalog = cards;
  console.log("[Presenter] Галерея отрисована.");
});

// ОТКРЫТИЕ ПРЕВЬЮ

events.on("card:clicked", (product: IProduct) => {
  console.log(`[Presenter] Клик по товару: ${product.title}.`);
  productCatalog.setSelectedProduct(product);
});

const previewTemplate = document.getElementById(
  "card-preview",
) as HTMLTemplateElement;
const previewElement = cloneTemplate(previewTemplate);
const previewCard = new CardPreview(previewElement, {
  onToggle: () => {
    events.emit("preview:toggle");
  },
});

const syncPreviewButton = () => {
  const product = productCatalog.getSelectedProduct();
  if (!product) return;

  if (product.price === null) {
    previewCard.button = "Недоступно";
    previewCard.buttonDisabled = true;
    return;
  }

  const isInBasket = cart.hasItem(product.id);
  previewCard.button = isInBasket ? "Удалить из корзины" : "Купить";
  previewCard.buttonDisabled = false;
};

events.on("preview:changed", () => {
  const product = productCatalog.getSelectedProduct();
  if (!product) return;

  console.log(`[Presenter] Модель отдала выбранный товар: ${product.title}.`);

  previewCard.text = product.description || "Описание отсутствует";
  syncPreviewButton();

  modal.render({
    content: previewCard.render({
      title: product.title,
      price: product.price,
      image: `${CDN_URL}${product.image}`,
      category: product.category,
    }),
  });
});

events.on("preview:toggle", () => {
  const product = productCatalog.getSelectedProduct();
  if (!product) return;

  const inBasket = cart.hasItem(product.id);
  if (inBasket) {
    cart.removeItem(product);
  } else {
    cart.addItem(product);
  }
});

events.on("basket:remove", (product: IProduct) => {
  cart.removeItem(product);
});

// ЭКРАН УСПЕХА

const successTemplate = document.getElementById(
  "success",
) as HTMLTemplateElement;
if (!successTemplate) throw new Error("Шаблон #success не найден!");

const successContainer = cloneTemplate(successTemplate);

const successModal = new SuccessModal(successContainer, () => {
  events.emit("success:close");
});

events.on("success:close", () => {
  console.log("[Presenter] Модалка успеха закрыта.");
  modal.close();
});

// ФОРМА (CONTACTS)

const contactsTemplate = document.getElementById(
  "contacts",
) as HTMLTemplateElement;
if (!contactsTemplate) throw new Error("Шаблон #contacts не найден!");

const contactsContainer = cloneTemplate(contactsTemplate);

const contactsForm = new ContactsForm(
  contactsContainer,
  (eventName, payload) => {
    if (eventName === "field:change") events.emit("field:change", payload);
    if (eventName === "form:submit") events.emit("contacts:submit");
  },
);

// ФОРМА (ORDER)

const orderTemplate = document.getElementById("order") as HTMLTemplateElement;
if (!orderTemplate) throw new Error("Шаблон #order не найден!");

const orderContainer = cloneTemplate(orderTemplate);

const orderForm = new OrderForm(orderContainer, (eventName, payload) => {
  if (eventName === "field:change") events.emit("field:change", payload);
  if (eventName === "form:submit") events.emit("order:submit");
});

// ОБРАБОТКА СОБЫТИЙ ФОРМ

events.on("field:change", (payload: { name: string; value: string }) => {
  buyer.updateData({ [payload.name]: payload.value });
});

events.on("order:submit", () => {
  console.log("[Presenter] Шаг 1 пройден. Переход к Шагу 2...");
  modal.render({
    content: contactsForm.render(),
  });
});

events.on("contacts:submit", () => {
  console.log("[Presenter] Отправка заказа на сервер...");

  const currentData = buyer.getData();

  const orderData = {
    payment: currentData.payment,
    email: currentData.email,
    phone: currentData.phone,
    address: currentData.address,
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => item.id),
  };

  (async () => {
    try {
      const response = await apiClient.sendOrder(orderData);
      console.log("[Presenter] Заказ успешно отправлен!");

      successModal.price = response.total;

      modal.render({
        content: successModal.render(),
      });

      cart.clear();
      buyer.clearData();
    } catch (error) {
      console.error("[Presenter] Ошибка отправки:", error);
      alert("Не удалось оформить заказ. Попробуйте позже.");
    }
  })();
});

const syncForms = () => {
  const data = buyer.getData();
  const errors = buyer.getErrors();

  orderForm.payment = data.payment;
  orderForm.address = data.address;
  contactsForm.email = data.email;
  contactsForm.phone = data.phone;

  const step1Errors = [errors.address, errors.payment].filter(
    Boolean,
  ) as string[];
  orderForm.setErrors(step1Errors);
  orderForm.setSubmitState(step1Errors.length === 0);

  const step2Errors = [errors.email, errors.phone].filter(Boolean) as string[];
  contactsForm.setErrors(step2Errors);
  contactsForm.setSubmitState(step2Errors.length === 0);
};

events.on("data:updated", syncForms);
events.on("data:cleared", syncForms);

const basket = new Basket(basketContainer, events);

events.on("order:open", () => {
  console.log("[Presenter] Кнопка 'Оформить заказ' нажата внутри корзины.");
  modal.render({
    content: orderForm.render(),
  });
});

events.on("basket:updated", () => {
  console.log("[Presenter] Корзина изменена. Обновляем UI.");

  const items = cart.getItems();

  const basketCardTemplate = document.getElementById(
    "card-basket",
  ) as HTMLTemplateElement;

  const basketCards = items.map((product, index) => {
    const cardElement = cloneTemplate(basketCardTemplate);
    const card = new CardBasket(cardElement, {
      onDelete: () => events.emit("basket:remove", product),
    });

    card.title = product.title;
    card.price = product.price;
    card.index = index + 1;

    return card.render();
  });

  header.counter = items.length;
  basket.items = basketCards;
  basket.total = cart.getTotalPrice();
  basket.isButtonDisabled = items.length === 0;

  syncPreviewButton();
});

events.on("basket:open", () => {
  console.log("[Presenter] Открываем корзину.");
  modal.render({
    content: basket.render(),
  });
});

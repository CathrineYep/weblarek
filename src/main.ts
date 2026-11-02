import { ProductCatalog } from "./components/base/Models/ProductCatalog";
import { Cart } from "./components/base/Models/Cart";
import { Buyer } from "./components/base/Models/Buyer";
import { ApiClient } from "./components/base/Models/ApiClient";
import { Api } from "./components/base/Api";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";
import "./scss/styles.scss";
import { TPayment } from "./types";

const productCatalog = new ProductCatalog();
const cart = new Cart();
const buyer = new Buyer();

console.log("1. Проверка методов ProductCatalog");

console.log("1.1 Инициализация и загрузка данных");

productCatalog.setProducts(apiProducts.items);
const allProducts = productCatalog.getProducts();
console.log("Массив товаров из каталога: ", allProducts);

console.log("1.2 Поиск товара по ID");

const firstProductId = allProducts[0].id;
const foundProduct = productCatalog.getProductById(firstProductId);
if (foundProduct) {
  console.log(`Поиск по ID (${firstProductId}). Товар найден:`);
  console.log("   ", foundProduct);
} else {
  console.error("Ошибка: Товар по ID не найден");
}

console.log("2. Проверка методов Cart");

console.log("2.1 Очищаем корзину");

cart.clear();
console.log("Очистка корзины выполнена");

console.log("2.2 Добавляем товары в корзину");

const firstItem = allProducts[0];
const secondItem = allProducts[1];

cart.addItem(firstItem);
cart.addItem(secondItem);

const cartItems = cart.getItems();
const cartItemsCount = cart.getItemCount();
console.log(
  `Добавление товаров. В корзине товаров: ${cartItemsCount}`,
  cartItems,
);

console.log("2.3 Считаем общую сумму");

const total = cart.getTotalPrice();
console.log(`Итоговая сумма: ${total}`);

console.log("2.4 Удаляем товар");

cart.removeItem(firstItem);
console.log(`Удаление товара: ${firstItem.title}`);
console.log("Оставшиеся товары в корзине: ", cartItems);

console.log("2.5 Проверка наличия товара в корзине");

console.log("2.5.1 Проверка до добавления товара в корзину");

cart.clear();

const existsBefore = cart.hasItem(firstItem.id);

if (!existsBefore) {
  console.log("Товар ещё не в корзине");
} else {
  console.error("Ошибка: hasItem вернул true, хотя товар еще не добавлен!");
}

console.log(
  "2.5.2 Добавление товара и проверка после добавления товара в корзину",
);

cart.addItem(firstItem);

const existsAfter = cart.hasItem(firstItem.id);

if (existsAfter) {
  console.log("Товар успешно добавлен. hasItem вернул true");
} else {
  console.log("ошибка: Товар добавлен, но hasItem вернул true");
}

console.log(
  "2.5.3 Добавление второго товара и проверка обоих после добавления товара в корзину",
);

cart.addItem(secondItem);
const firstAddItem = cart.hasItem(firstItem.id);
const secondAddItem = cart.hasItem(secondItem.id);

if (firstAddItem && secondAddItem) {
  console.log("Оба товара найдены в корзине");
} else {
  console.log("Один из товаров не найден в корзине");
}

console.log("3. Проверка методов Buyer");

console.log("3.1 Проверка очистки данных");

buyer.clearData();
const emptyData = buyer.getData();

if (emptyData.payment === null) {
  console.log("Поле payment очищено корректно");
} else {
  console.log("Поле payment не очистилось");
}

if (!emptyData.address && !emptyData.email && !emptyData.phone) {
  console.log("Строковые поля (address, email, phone) очищены корректно");
} else {
  console.log("Строковые поля не очистились");
}

console.log("3.2 Проверка обновления данных");

const testData = {
  payment: "card" as TPayment,
  address: "г.Казань, ул.Профсоюзная, д.10",
  phone: "+ 7 (999) 765-09-12",
  email: "test@email.com",
};

buyer.updateData(testData);
const updatedData = buyer.getData();

if (testData.payment === "card" || testData.payment === "cash") {
  console.log("Вид оплаты выбран успешно");
} else {
  console.log("Вид оплаты не установлен");
}

console.log(`Данные обновлен успешно: `, updatedData);

console.log("3.3 Валидация данных");

console.log("3.3.1 Валидация пустых данных");

buyer.clearData();
const errorsEmpty = buyer.validateData();

if (Object.keys(errorsEmpty).length > 0) {
  console.log("Валидация обнаружила ошибки при пустых данных");
  console.log("Список ошибок: ", errorsEmpty);
}

console.log("3.3.2 Валидация заполненных данных");

const validData = {
  payment: "cash" as TPayment,
  address: "г.Елабуга ул.Московская, д.6",
  phone: "+7 (937) 336-98-99",
  email: "text@email.com",
};

buyer.updateData(validData);
const errorsValid = buyer.validateData();

if (Object.keys(errorsValid).length === 0) {
  console.log("При валидных данных ошибок нет. Заказ готов к отпраке.");
} else {
  console.log("Валидация вернула ошибка для корректных данных: ", errorsValid);
}

// Отправляем запрос на сервер
async function loadProductsFromServer() {
  try {
    console.log(`Инициализируем клиент API: ${API_URL}`);
    const apiInstance = new Api(API_URL);
    const apiClient = new ApiClient(apiInstance);
    const serverResponse = await apiClient.getProducts();
    productCatalog.setProducts(serverResponse.items);

    console.log("Данные успешно получены с сервера");
    console.log(`Сервер вернул метаданные: total = ${serverResponse.total} `);
  } catch (error) {
    console.log("Произошла ошибка инициализации и получения данных с сервера");
  }
}

loadProductsFromServer();

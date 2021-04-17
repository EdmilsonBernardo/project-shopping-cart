function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  // High quality image hack, thanks to Renzo
  img.src = imageSource.replace('I.jpg', 'O.webp');
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const API = {
  loading: null,
  createMessage() {
    this.loading = document.createElement('p');
    this.loading.innerText = 'loading...';
    this.loading.classList.add('.loading');
  },
  appendMessage() {
    document.body.appendChild(this.loading);
  },
  removeMessage() {
    document.body.removeChild(this.loading);
  },
  init() {
    this.createMessage();
    this.appendMessage();
  },
  async fetch(fetchParameter) {
    if (!this.loading) this.createMessage();
    this.appendMessage();
    const data = await fetch(fetchParameter);
    if (this.loading.parentElement) this.removeMessage();
    return data;
  },
};

async function processItemInfo(itemID) {
  const data = await API.fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const json = await data.json();
  const { id: sku, title: name, price: salePrice } = json;
  return ({ sku, name, salePrice });
}

const cart = {
  section: null,
  separator: '|',
  total: 0,
  init() {
    this.section = document.querySelector('.cart__items');
    const clearBtn = document.querySelector('.empty-cart');
    clearBtn.addEventListener('click', () => this.clear());
  },
  async load() {
    const data = localStorage.getItem('carList');
    if (!data) return;
    await this.processItems(data);
  },
  async processItems(data) {
    const items = data.split(this.separator);
    items.forEach((item) => {
      const things = item.split(',');
      console.log(things);
      const sku = things[0];
      const name = things[1];
      const salePrice = things[2];
      cart.add({ sku, name, salePrice });
    });
    /*     const processedItem = [];
        for (let index = 0; index < items.length; index += 1) {
    
          processedItem.push(processItemInfo(items[index]));
        }
         const wait = await Promise.all(processedItem);
        wait.forEach((item) => cart.add(item));  */
  },
  save() {
    const regEx = /SKU: (.*) \| NAME: (.*) \| PRICE: \$(.*)/;
    const data = [...this.section.children];
    if (data.length === 0) {
      localStorage.removeItem('carList');
      return;
    }
    localStorage.setItem('carList', data.map(({ innerText }) =>
      innerText.match(regEx).slice(1)).join(this.separator));
  },
  add(item) {
    this.section.appendChild(this.createCartItemElement(item));
    this.save();
    this.updateTotalPrice();
  },
  remove(item) {
    this.section.removeChild(item);
    this.save();
    this.updateTotalPrice();
  },
  clear() {
    while (this.section.lastElementChild) {
      this.section.removeChild(this.section.lastElementChild);
    }
    this.save();
    this.updateTotalPrice();
  },
  createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', (event) => this.remove(event.target));
    return li;
  },
  updateTotalPrice() {
    const items = [...this.section.children];
    const totalPrice = document.getElementById('totalPrice');
    if (items.length === 0) {
      this.total = 0;
      totalPrice.innerText = `${this.total}`;
      return;
    }
    const regEx = /PRICE: \$(\d+\.?\d*)/;
    const sum = [...this.section.children].reduce((acc, { innerText }) =>
      acc + parseFloat(innerText.match(regEx)[1]), 0);
    this.total = parseFloat(sum.toFixed(2));
    totalPrice.innerText = `${this.total}`;
  },
};

const products = {
  section: null,
  init() {
    this.section = document.querySelector('.items');
    this.section.addEventListener('click', this.tryAddToCart);
  },
  async tryAddToCart(event) {
    if (event.target.nodeName !== 'BUTTON') return;
    const item = await processItemInfo(getSkuFromProductItem(event.target.parentElement));
    cart.add(item);
  },
  format({ id: sku, title: name, thumbnail: image }) {
    return createProductItemElement({ sku, name, image });
  },
  add(item) {
    this.section.appendChild(this.format(item));
  },
  async fetch() {
    const data = await API.fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const json = await data.json();
    json.results.forEach((item) => {
      products.add(item);
    });
  },
};

document.onreadystatechange = function onload() {

};
window.onload = async function onload() {
  const item = document.querySelector('.items');
  const p = document.createElement('p');
  item.appendChild(p);
  p.className = 'loading';
  API.init();
  products.init();
  cart.init();
  await products.fetch();
  await cart.load();
  p.remove();
};

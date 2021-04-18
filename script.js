/* const fetch = require('node-fetch'); */

// ------------------------ Support Functions ------------------

function toReal(n) {
  const realWDot = 'R$ ' + n.toFixed(2).replace('.', ',');
  const real = realWDot.replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
  return real;
}

function createProductItemElement({ sku: id, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__title', price));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// ------- GET ------ ADD ---- and ---- CREATE ----- DATA --------

async function getData(QUERY) {
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  const response = await fetch(URL);
  const data = await response.json();
  return data.results;
}

async function addDataList(QUERY) {
  const productList = await getData(QUERY);
  const marketSection = document.querySelector('section.items');

  productList.forEach((product) => {
    const item = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
      price: toReal(product.price),
    });

    marketSection.appendChild(item);
  })
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

addDataList('computador');

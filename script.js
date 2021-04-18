const cartItems = '.cart__items';

const arrayPrices = [];

const reduceValue = [0];

function savingItems() {
  const cartLi = document.querySelector(cartItems);
  localStorage.setItem('items', cartLi.innerHTML);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  const click = event.target;
  click.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  document.querySelector('ol.cart__items').appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// loading - 7 requisito (referência https://developer.mozilla.org/pt-BR/docs/Web/API/Element/className - criar a classe)
const loading = () =>{
  const createText = document.createElement('p');
  createText.className = 'loading';
  createText.innerText = 'Levando as compras ao caixa';
  const getItems = document.querySelector('.items');
  getItems.appendChild(createText);
}
const finishLoading = () =>{
  const getLoading = document.querySelector('.loading');
  getLoading.remove();
}

// funções de fetch, 1 e 2 requisito

const createCartItem = async (item) => {
  loading();
  const getProduct = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const response = await getProduct.json();
  return response;
};

// Bruno ajudou na fundamentação da lógica para o cálculo do preço.
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', async () => {
    const gettingChild = section.firstChild.innerHTML;
    const returnFunction = await createCartItem(gettingChild);
    document.querySelector(cartItems).appendChild(createCartItemElement(returnFunction));
    arrayPrices.push(returnFunction.price);
    const reduceSum = arrayPrices.reduce((acc, totalValue) => acc + totalValue);
    reduceValue.push(reduceSum);
    const totalprice = document.querySelector('.total-price');
    totalprice.innerHTML = reduceSum;
    finishLoading();
  });
  return section;
}
// ajuda de Bruno, turma 10 na nossa chamada da madrugada.
async function fetchProducts() {
  const getProduct = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const result = await getProduct.json();
    const data = await result.results;
    data.forEach((value) => {
      const product = { sku: value.id, name: value.title, image: value.thumbnail };
      document.querySelector('.items').appendChild(createProductItemElement(product));
  });
}

// referência Patrick e Rogério - turma 10. Me deu noção e lógica de como fazer o botão de maneira pragmática e funcional.
const clearingCart = () => {
  const getCart = document.querySelector('.empty-cart');
  getCart.addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerHTML = '0.00';
    savingItems();
  });
};
window.onload = function onload() {
 clearingCart();
 fetchProducts();
};

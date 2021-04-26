const cartItems = '.cart__items';

function saveCartOnLocalStorage() {
  const cartList = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('cartList', cartList);
}

async function cartTotalPrice() {
  const listedElements = document.querySelectorAll('li');
  let sum = 0;
  listedElements
    .forEach((currentElement) => {
      sum += parseFloat(currentElement.innerText.split('$')[1], 10);
    });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = sum;
}

function emptyCart() {
  const listedElements = document.querySelector(cartItems);
  listedElements.innerHTML = '';
  saveCartOnLocalStorage();
  cartTotalPrice();
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCartOnLocalStorage();
  cartTotalPrice();
}

function retrieveFromLocalStorage() {
  const cartList = document.querySelector(cartItems);
  const cartContent = localStorage.getItem('cartList');
  if (cartContent !== null) cartList.innerHTML = cartContent;
  const listedElements = document.querySelectorAll('li');
  listedElements
    .forEach((currentElement) => currentElement.addEventListener('click', cartItemClickListener));
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  const targetProduct = await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((result) => result.json());
  const cartObject = { sku, name: targetProduct.title, salePrice: targetProduct.price };
  const newCartItem = createCartItemElement(cartObject);
  document.querySelector(cartItems).appendChild(newCartItem);
  saveCartOnLocalStorage();
  cartTotalPrice();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addToCart);
  section.appendChild(button);  
  return section;
}

async function loadProducts() {
  const loadingMessage = document.createElement('p');
  loadingMessage.innerText = 'loading...';
  loadingMessage.className = 'loading';
  document.querySelector('.items').appendChild(loadingMessage);
  const fetchedData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((result) => result.results);
  loadingMessage.remove();
  fetchedData.forEach((object) => {
    const image = `https://http2.mlstatic.com/D_NQ_NP_${object.thumbnail_id}-O.webp`;
    const fetchedObject = { sku: object.id, name: object.title, image };
    document.querySelector('.items').appendChild(createProductItemElement(fetchedObject));
  });
}

window.onload = function onload() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', emptyCart);
  loadProducts();
  retrieveFromLocalStorage();
  cartTotalPrice();
};

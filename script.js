// const fetch = require('node-fetch');
const getData = () => (
  new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
    .then((products) => resolve(products.results.map((product) => 
    ({ sku: product.id, name: product.title, image: product.thumbnail }))))
  .catch((err) => reject(err));
  })
);

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

function createProductItemElement({ id, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const setTotalPrice = (listExist, cartList) => 
  new Promise((resolve) => {
    const element = document.querySelector('.total-price');
    if (listExist) {
      const total = cartList.reduce((acc, item) => {
        let value = acc;
        value += item.salePrice;
        return value;
      }, 0);
      resolve(element.firstElementChild.innerText = `Total: $${total}`);
    } else {
      resolve(element.firstElementChild.innerText = `Total: $${0}`);
    }
  });

// const setTotalPrice = (listExist cartList) => {
//   const element = document.querySelector('.total-price');
//   if (listExist) {
//     const total = cartList.reduce((acc, item) => {
//       let value = acc;
//       value += item.salePrice;
//       return value;
//     }, 0);
//     element.firstElementChild.innerText = `Total: $${total}`;
//   } else {
//     element.firstElementChild.innerText = `Total: $${0}`;
//   }
// };

const addToLocalStorage = (computerObject) => {
  let list = [];
  if (localStorage.getItem('cartList') != null) {
    list = JSON.parse(localStorage.getItem('cartList'));
  }
  list.push(computerObject);
  localStorage.setItem('cartList', JSON.stringify(list));
  setTotalPrice(list.length > 0, list);
};

const removeFromLocalStorage = (element) => {
  const parent = element.parentElement;
  const listOfIndexes = Object.keys(parent.children); // Cria um array com os índices do html collection que são os itens da lista
  const elementIndex = listOfIndexes.filter((index) => parent.children[index] === element); // Encontra qual o índice do elemento que foi removido do carrinho
  const cartList = JSON.parse(localStorage.getItem('cartList'));
  cartList.splice(elementIndex, 1); // Remove o item correspondente ao índice
  setTotalPrice(cartList.length > 0, cartList);
  localStorage.setItem('cartList', JSON.stringify(cartList));
};

function cartItemClickListener(event) {
  const item = event.target;
  removeFromLocalStorage(item);
  item.parentElement.removeChild(item);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = ({ sku }, cartElement) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => response.json())
  .then((response) => ({ sku: response.id, name: response.title, salePrice: response.price }))
  .then((computerInfos) => {
    cartElement.appendChild(createCartItemElement(computerInfos));
    addToLocalStorage(computerInfos);
  })
  .catch((err) => console.log(err));
};

const fillHtmlWithProducts = async (cartElement) => {
  try {
  const computers = await getData();
  computers.forEach((computer) => {
    const item = createProductItemElement(computer);
    item.lastElementChild.addEventListener('click', () => addToCart(computer, cartElement));
    document.querySelector('.items').appendChild(item);
  });
  } catch (err) {
    console.log(err);
  }
};

const loadCartList = (cartElement) => {
  if (JSON.parse(localStorage.getItem('cartList')) !== null) {
    const cartList = JSON.parse(localStorage.getItem('cartList'));
    cartList.forEach((item) => cartElement.appendChild(createCartItemElement(item)));
    setTotalPrice(cartList.length > 0, cartList);
  } else {
    setTotalPrice(false);
  }
};

const clearCartList = (cartElement) => {
  localStorage.removeItem('cartList');
  const cart = cartElement;
  cart.innerHTML = '';
  setTotalPrice(false);
};

window.onload = function onload() {
  const CartElement = document.querySelector('.cart__items');
  fillHtmlWithProducts(CartElement);
  loadCartList(CartElement);
  document.querySelector('.empty-cart').addEventListener('click', () => clearCartList(CartElement));
};

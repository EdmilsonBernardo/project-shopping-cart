// Todo o desenvolvimento tive o auxílio do Anderson Silva

const getItem = (idItem) => {
  const storageUrl = `https://api.mercadolibre.com/items/${idItem}`;
  return new Promise((resolve) => {
    fetch(storageUrl)
      .then((result) => {
        result.json().then((element) => {
          resolve(element);
        });
      });
  });
};

// console.log(getItem());
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

const saveItens = () => {
  const itemCart = document.querySelectorAll('.cart__item');
  const newArr = [];
  itemCart.forEach((element) => newArr.push(element.outerHTML));
  localStorage.setItem('itensList', newArr);
};

function cartItemClickListener(event) {
  const eventCartListItem = event.target;
  eventCartListItem.remove();
  saveItens();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const insertCart = () => {
  const button = document.querySelectorAll('.item__add');
  button.forEach((element) => element.addEventListener('click', async (event) => {
    const storageEvent = event.target;
    const getDone = getSkuFromProductItem(storageEvent.parentElement);
    const storageItem = await getItem(getDone);
    const seasonEntries = document.querySelector('.cart__items');
    seasonEntries.appendChild(createCartItemElement(storageItem));
    saveItens();
  }));
};

const clearButton = () => { // requisito 6
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.innerHTML = '';
    saveItens();
  });
};

const addEventClickCart = () => {
  const lis = document.querySelectorAll('.cart__item');
  lis.forEach((elemento) => {
    elemento.addEventListener('click', cartItemClickListener);
  });
};

const getItens = () => {
  if (localStorage.getItem('itensList')) {
    const itemsCart = document.querySelector('ol');
    const arrayStorage = localStorage.getItem('itensList').split(',');
    arrayStorage.forEach((elemento) => {
      itemsCart.innerHTML += elemento;
    });
    addEventClickCart();
  }
};

// Ajuda de Murilo Gonçalves - Turma 10 - Tribo A
const msgLoading = () => { // requisito 7
  const loading = document.querySelector('.loading');
  loading.remove();
};

const createProductItemElement = (result) => {
  result.forEach(({ id, title, thumbnail }) => {
    const section = document.createElement('section');
    const sectionClass = document.getElementsByClassName('items')[0];
    section.className = 'item';

    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
    sectionClass.appendChild(section);
  });
  insertCart();
  clearButton();
  msgLoading();
};

const getData = async () => {
  const storageUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  await fetch(storageUrl)
  .then((result) => result.json())
  .then((newData) => createProductItemElement(newData.results));
};

window.onload = function onload() { getData(); getItem(); getItens(); };

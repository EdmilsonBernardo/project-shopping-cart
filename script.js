window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function searchAPI() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => { 
        response.json()
        .then((data) => { resolve(data.results); });
      });
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  document.querySelector('.items').appendChild(section);

  return section;
}

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
  // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
 }

function searchApiId(id) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => { 
      response.json()
      .then((data) => resolve(data));
    });
  });
}

function foundSectionId(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addListener(element) {
   const lista = document.querySelector('.cart__items');
   element.addEventListener('click', async (e) => {
    const itemId = foundSectionId(e.target.parentNode);
    const foundAPI = await searchApiId(itemId);
    const obj = { sku: foundAPI.id, name: foundAPI.title, salePrice: foundAPI.price };
    lista.appendChild(createCartItemElement(obj));
   });
}

async function makeObjsAndTakeButtons() {
  searchAPI().then((response) => {
       Array.from(response).forEach(({ id, title, thumbnail }) => {
        createProductItemElement({ sku: id, name: title, image: thumbnail });
       });
   }).then(() => {
    const icones = document.querySelectorAll('.item__add');
    icones.forEach((element) => {
      addListener(element);
    });
  });
}
makeObjsAndTakeButtons();
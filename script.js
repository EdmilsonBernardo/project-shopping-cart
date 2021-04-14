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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

let receivedData;
const searching = (QUERY) => {
  return new Promise((resolve, reject) => {
    QUERY = 'computador';
      fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
      .then((response) => {
        response.json().then((data) => {
          receivedData = data.results;
          connectingAPI(data);
          resolve();
        });
      });
    });
}

let filtredData;

const connectingAPI = () => {
  filtredData = receivedData.map((itens) => ({sku: itens.id, name: itens.title, image: itens.thumbnail, salesPrices: itens.price}))
  // createProductItemElement(filtredData);
  console.log(filtredData);
}

const fetchComputador = async () => {
  try {
    await searching('computador');
  } catch (error) {
    console.log(error);
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() { 
  fetchComputador();
};
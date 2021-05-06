function boardKeys({ id, title, thumbnail }) {
  const askedKeys = {
    sku: id,
    name: title,
    image: thumbnail,
  };
  return askedKeys;
}

function cartKeys({ id, title, price }) {
  const askedKeys = {
    sku: id,
    name: title,
    salePrice: price,
  };

  return askedKeys;
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

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const itemCart = event.target;
  const getCart = document.querySelector('.cart__items');
  getCart.removeChild(itemCart);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => {
  const productId = event.target.parentNode.firstChild.innerText;
  const request = await fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((data) => data.json())
    .then((data) => {
      const getCart = document.querySelector('.cart__items');
      const itemCart = createCartItemElement(cartKeys(data));
      getCart.appendChild(itemCart);
    });
  
  return request;
};

const getDataProducts = (product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((data) => data.json())
    .then((data) => data.results)
    .then((results) => {
      results.forEach((iten) => {
        const info = boardKeys(iten);
        const getBoard = document.querySelector('.items');
        const eachProduct = createProductItemElement(info);
        eachProduct.querySelector('.item__add').addEventListener('click', addToCart);
        getBoard.appendChild(eachProduct);
      });
    });
};

window.onload = function onload() {
  getDataProducts('computador'); 
};

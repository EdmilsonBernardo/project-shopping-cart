function findItem(item) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
}

function getItem(item) {
  return findItem(item).then((response) => response.json())
  .then((data) => {
    const result = [];
    data.results.forEach((element) => {
      const { id, title, thumbnail, price } = element;
      result.push({ id, title, thumbnail, price });
    });
    return result;
  });
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  if (event.target.outerHTML.includes('li')) {
    const element = event.target;
    document.getElementById('list').removeChild(element);
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createLanding = () => {
  getItem().then((response) => {
    response.forEach((element) => {
      const { id, title, thumbnail } = element;
      const data = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const section = createProductItemElement(data);
      document.getElementById('main').appendChild(section);
    });
  });
};

const addCartItem = (event) => {
  if (Object.values(event.target.classList).includes('item__add')) {
    const sku = Object.values(event.target.parentElement.children)
    .map((element) => element.innerHTML)
    .filter((element) => element.includes('MLB')).join();
    const name = Object.values(event.target.parentElement.children)
    .map((element) => element.innerHTML)[1];
    getItem(name).then((response) => response.filter((element) => element.id === sku).shift())
    .then((data) => {
      const { id, price, title } = data;
      const obj = {
        sku: id,
        name: title,
        salePrice: price,
      };
      const cartItem = createCartItemElement(obj);
      document.getElementsByClassName('cart__items')[0].appendChild(cartItem);
    });
  }
};

window.onload = function onload() {
  createLanding();
  document.body.addEventListener('click', addCartItem);
};

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
/*
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
*/

const getSearchData = async function () {
  try {
  const res = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer');
  if (!res.ok) throw new Error('Problem getting search data');

  const data = await res.json();  
  data.results.forEach((item) => {
    const formattedItem = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    
    document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement(formattedItem));
  });  
  } catch (error) {
    console.log(error);
  }
};

window.onload = function onload() { 
  console.log('Onload emitido');
  getSearchData();
};
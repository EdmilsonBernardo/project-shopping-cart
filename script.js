/* 01 - Crie uma listagem de produtos através da API do Mercado Livre. (ok)
- Use o termo 'computador' no endpoint fornecido. (ok)
- Do JSON disponibilizado, a lista que deve ser exibida, é apenas o array results. (ok)
- Use a função `createProductItemElement(product)` para criar os componentes HTML referentes a cada produto. (ok)
- O elemento que `createProductItemElement(product)` retornar, deve ser adicionado como filho da `<section class="items">`
- Ps: O `SKU` do projeto se refere ao `ID` da API. */

/* 02 - Cada produto na página HTML possui um botão  *Adicionar ao carrinho!* (ok)
- Ao clicar nesse botão faça uma requisição para o novo endpoint fornecido.
- O novo endpoint deve conter o valor id do item selecionado.
- O JSON deve conter apenas um item.
- Use a função `createCartItemElement()` para criar os componentes HTML referentes a um item do carrinho.
- O retorno da função `createCartItemElement(product)` deve ser adicionado como filho do elemento <ol class="cart__items">. */

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

function createProductItemElement({ sku, name, image }) { // cria os componentes HTML referentes a cada produto.
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  
  const itemProduct = document.querySelector('.items'); // O retorno da createProductItemElement deve ser docionado como filho da <section class="items">.
  itemProduct.appendChild(section);
  
  
  return section;
}

async function addCartItem() {
  const btn = document.querySelectorAll('button.item__add');
  btn.forEach((button, index) => button.addEventListener('click', (e) => {
    const sku = e.target.parentNode.firstChild.innerText
    fetchById(sku)
    console.log('sku', sku)
    console.log('btn', btn[index])
  }))
}
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener() {
// coloque aqui sua solução
}



// function createCartItemElement({ sku, name, salePrice }) { // Cria os componentes HTML referentes a um item do carrinho.
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);

//   const btnCart = document.querySelector('.item__add');
//   console.log('button', btnCart);

//   return li;
// }


function getProductItem() { // Pega a lista de produtos.
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador'
  fetch(url)
  .then((response) => response.json()) // Transforma a resposta em JSON.
  .then((data) => data.results.forEach((productItem) => { // Acessa o array results e entitula seus elementos como productItem.
  
    const product = { // Converte o item da API com o solicitado no projeto.
      sku: productItem.id,
      name: productItem.title,
      image: productItem.thumbnail,
      salePrice: productItem.price,
    };
    
    const productUnit = createProductItemElement(product);
    addCartItem()

    // addProductCart({ sku })
    // cartItemClickListener();
  }));
};

const fetchById = (sku) => { // nova requisição contendo o valor id do item selecionado.
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => response.json())
  .then((data) => console.log('objetoClick', data))
  .catch(error => console.log(error));
};

window.onload = function onload() { // Carrega a página?
  getProductItem();
};

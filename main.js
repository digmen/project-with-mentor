//! создание айпи для запросов
const API = 'http://localhost:8000/products';
//? блок куда добовляем карточки
const list = document.querySelector('#products-list');

const addForm = document.querySelector('#add-form');
const titleInp = document.querySelector('#title');
const priceInp = document.querySelector('#price');
const descriptionInp = document.querySelector('#description');
const imageInp = document.querySelector('#image');

const editTitleInp = document.querySelector('#edit-title');
const editPriceInp = document.querySelector('#edit-price');
const editDescriptionInp = document.querySelector('#edit-description');
const editImageInp = document.querySelector('#edit-image');
const editSaveBtn = document.querySelector('#btn-save-edit');

const searchInput = document.querySelector('#search');
let searchVal = '';

// запуск цикла
getProducts();

// стягивание данные с сервера
async function getProducts() {
  const res = await fetch(`${API}?title_like=${searchVal}`);
  const data = await res.json(); // расшифровываем данные
  render(data); // отображаем актульные (обновленные) данные
}

async function addProducts(product) {
  await fetch(API, {
    method: 'POST',
    body: JSON.stringify(product),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  getProducts();
}

async function deleteProduct(id) {
  await fetch(`${API}/${id}`, {
    method: 'DELETE',
  });

  getProducts();
}

async function getOneProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

async function editProduct(id, editedProduct) {
  await fetch(`${API}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(editedProduct),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  getProducts();
}

// отображаение карточок или чего нибудь еще
function render(arr) {
  // очистка что бы не дублировалась
  list.innerHTML = '';
  // цикл который перебеает массив и добовляем массив
  arr.forEach((item) => {
    // добовляем текст и кнопки карточки
    list.innerHTML += `<div class="card m-5" style="width: 18rem;">
    <img src='${item.image}'>
    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title">${item.title}</h5>
      <p class="card-text ">${item.description.slice(0, 70)}...</p>
      <p class="card-text">$ ${item.price}</p>
      <div> 
      <button id="${item.id}" class="btn btn-danger btn-delete">DELETE</button>
      <button data-bs-toggle='modal' data-bs-target='#exampleModal' id="${
        item.id
      }" class="btn btn-dark btn-edit mx-3 ">EDIT</button>
      </div>
    </div>
  </div>`;
  });
}

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (
    !titleInp.value.trim() ||
    !priceInp.value.trim() ||
    !descriptionInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    alert('Заполните все поля');
    return;
  }

  const product = {
    title: titleInp.value,
    price: priceInp.value,
    description: descriptionInp.value,
    image: imageInp.value,
  };

  addProducts(product);
  (titleInp.value = ''),
    (priceInp.value = ''),
    (descriptionInp.value = ''),
    (imageInp.value = '');
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    deleteProduct(e.target.id);
  }
});

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-edit')) {
    id = e.target.id;
    const product = await getOneProduct(e.target.id);

    editTitleInp.value = product.title;
    editPriceInp.value = product.price;
    editDescriptionInp.value = product.description;
    editImageInp.value = product.image;
  }
});
let id = null;
editSaveBtn.addEventListener('click', () => {
  if (
    !editTitleInp.value.trim() ||
    !editPriceInp.value.trim() ||
    !editDescriptionInp.value.trim() ||
    !editImageInp.value.trim()
  ) {
    alert('Заполните все поля');
    return;
  }

  const editedProduct = {
    title: editTitleInp.value,
    price: editPriceInp.value,
    description: editDescriptionInp.value,
    image: editImageInp.value,
  };
  editProduct(id, editedProduct);
});

searchInput.addEventListener('input', () => {
  searchVal = searchInput.value;
  getProducts();
});

import { updateCartNoti } from './header.js';
import { counter } from '../index.js';
export function cartList() {
  const cartListNav = document.querySelector('.nav-cartlist');
  cartListNav.addEventListener('click', () => {
    document.querySelector('#main').style.display = 'none';
    axios
      .get('https://thanh-shop-api-demo.herokuapp.com/cartlist')
      .then(({ data }) => {
        renderCartlist(data);
        return data;
      })
      .then((data) => {
        deleteProducts();
        editProducts(data);
      });
  });
}

function renderCartlist(productList) {
  let html = `<table border="1">
        <tr>
          <th>Product</th>
          <th>Name</th>
          <th>Unit Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th>Modify</th>
        </tr>`;
  if (productList.length == 0) {
    html += `<tr>
          <td colspan="6">No products were added to wishlist</td>
        </tr>`;
  } else {
    html += productList.reduce(
      (htmlCartList, item) =>
        htmlCartList +
        `<tr>
          <td><img src="${item.src}" /></td>
          <td class="h5 text-start px-3">${item.name}</td>
          <td>$ ${item.price}</td>
          <td>
            <div class="edit-qty">
              <input type="button" value="-" class="minus d-none" />
              <input type="number" value="${
                item.quantity
              }" class="quantity" readonly />
              <input type="button" value="+" class="plus d-none" />
            </div>
          </td>
          <td class="subtotal">$ ${parseInt(item.price) * item.quantity}</td>
          <td class="btns">
            <button class="edit-btn btn-warning btn">
              <i class="fas fa-edit"></i>
            </button>
            <button class="edit-btn btn-success btn d-none" id="${item.id}">
              <i class="fas fa-check"></i>
            </button>
            <button class="del-btn btn-danger btn" id="${item.id}">
              <i class="far fa-trash-alt"></i>
            </button>
          </td>
        </tr>`,
      ''
    );
  }
  html += `<tr>
          <th colspan="4">TOTAL</th>
          <th class="total-price">$ ${productList
            .map((item) => parseInt(item.price) * item.quantity)
            .reduce((total, subtotal) => total + subtotal, 0)}</th>
        </tr>
      </table>`;
  document.querySelector('#cartlist').innerHTML = html;
}

function deleteProducts() {
  const delBtns = document.querySelectorAll('.del-btn');
  delBtns.forEach((delBtn) => {
    delBtn.addEventListener('click', () => {
      axios
        .delete(
          `https://thanh-shop-api-demo.herokuapp.com/cartlist/${delBtn.id}`
        )
        .then(() => updateCartNoti())
        .then(() =>
          axios
            .get('https://thanh-shop-api-demo.herokuapp.com/cartlist/')
            .then(({ data }) => renderCartlist(data))
        );
    });
  });
}

function editProducts(productList) {
  const editBtns = document.querySelectorAll('.edit-btn');
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener('click', () => {
      editBtn.classList.add('d-none');
      const saveBtn = editBtn.nextElementSibling;
      saveBtn.classList.remove('d-none');
      const plusEle =
        editBtn.parentElement.parentElement.querySelector('.plus');
      plusEle.classList.remove('d-none');
      const minusEle =
        editBtn.parentElement.parentElement.querySelector('.minus');
      minusEle.classList.remove('d-none');
      const quantityEle =
        editBtn.parentElement.parentElement.querySelector('.quantity');
      quantityEle.removeAttribute('readonly');
      counter();
      saveBtn.addEventListener('click', () => {
        editBtn.classList.remove('d-none');
        saveBtn.classList.add('d-none');
        plusEle.classList.add('d-none');
        minusEle.classList.add('d-none');
        quantityEle.setAttribute('readonly', '');
        let product = productList.find((item) => item.id == saveBtn.id);
        console.log(product);
        axios
          .put(
            `https://thanh-shop-api-demo.herokuapp.com/cartlist/${saveBtn.id}`,
            {
              productID: product.productID,
              name: product.name,
              src: product.src,
              quantity: parseInt(quantityEle.value),
              price: product.price,
            }
          )
          .then(() => updateCartNoti())
          .then(() =>
            axios
              .get('https://thanh-shop-api-demo.herokuapp.com/cartlist/')
              .then(({ data }) => renderCartlist(data))
          );
      });
    });
  });
}

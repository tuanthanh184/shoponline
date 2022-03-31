import { cartList } from './cartlist.js';
function header() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      updateCartNoti();
      cartList();
      resolve('Load content success!');
      reject('Load content failed!');
    }, 1000);
  });
}

function updateCartNoti() {
  axios
    .get('https://thanh-shop-api-demo.herokuapp.com/cartlist')
    .then(({ data }) => {
      let itemQuantity = data.reduce(
        (total, item) => total + parseInt(item.quantity),
        0
      );
      document.querySelector('.cart_noti').innerText = itemQuantity;
    });
}

export { header, updateCartNoti };

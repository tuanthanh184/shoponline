function header() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      countItemCart();

      resolve('Load content success!');
      reject('Load content failed!');
    }, 1000);
  });
}

function countItemCart() {
  let data = new FormData();
  data.append('userid', localStorage.userid);
  axios.post('http://localhost/be/Users/GetCart.php', data).then((e) => {
    let quantityItem = 0;
    e.data.forEach((item) => {
      quantityItem += parseInt(item.quantity);
    });
    document.querySelector('.cart_noti span').innerText = quantityItem;
  });
}

export { header, countItemCart };

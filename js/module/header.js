function header() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      renderBrands();
      countItemCart();

      // Làm nút search
      var searchBtn = document.querySelector('.search_box_btn');
      searchBtn.addEventListener('click', function () {
        this.parentElement.classList.toggle('open');
        this.previousElementSibling.focus();
      });
      resolve('Load content success!');
      reject('Load content failed!');
    }, 1000);
  });
}

function renderBrands() {
  axios
    .get('http://localhost/be/DataList/Brands.php')
    .then((e) => e.data)
    .then((e) => {
      let html = '';
      e.forEach((item) => {
        html += `<div brandid=${item.id}><img src="${item.img}"></div>`;
      });
      document.querySelector('.brand').innerHTML = html;
    });
  setTimeout(() => {
    let cateSpan = document.querySelectorAll('div[brandid]');
    cateSpan.forEach((item) => {
      item.onclick = () => {
        localStorage.setItem('brandid', item.getAttribute('brandid'));
        window.location.href.includes('layout')
          ? (window.location.href = './products.html')
          : (window.location.href = './layout/products.html');
      };
    });
  }, 500);
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

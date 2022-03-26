import { componentHTML } from './module/components.js';
import { header } from './module/header.js';
import { alertMess } from './module/alert.js';

componentHTML();
console.log(sessionStorage);
localStorage.setItem('currentPage', 1);
var squareBtn = document.querySelector('.square');
var pillarBtn = document.querySelector('.pillar');

let idPage = 1;
let start = 0;

var productList = [];
var productListToFliter = [];
pillarBtn.addEventListener('click', function () {
  document.querySelector('.content_container_main').classList.add('hide');
  document
    .querySelector('.content_container_main_pillar')
    .classList.add('show');
  if (squareBtn.classList.contains('active')) {
    squareBtn.classList.remove('active');
    pillarBtn.classList.add('active');
  }
});

squareBtn.addEventListener('click', function () {
  document.querySelector('.content_container_main').classList.remove('hide');
  document
    .querySelector('.content_container_main_pillar')
    .classList.remove('show');
  if (pillarBtn.classList.contains('active')) {
    squareBtn.classList.add('active');
    pillarBtn.classList.remove('active');
  }
});

//search filter làm nút tìm kiếm giống W3 school chỉ search được trong 1 trang
function search() {
  // Declare variables
  var input, filter, main, infor, p, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  if (squareBtn.classList.contains('active')) {
    main = document.querySelector('.content_container_main');
    infor = main.getElementsByClassName('content_container_item');
    for (i = 0; i < infor.length; i++) {
      p = infor[i].getElementsByClassName('title')[0];
      txtValue = p.textContent || p.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        infor[i].style.display = '';
      } else {
        infor[i].style.display = 'none';
      }
    }
  } else {
    main = document.querySelector('.content_container_main_pillar');
    infor = main.getElementsByClassName('content_container_item_pillar');

    for (i = 0; i < infor.length; i++) {
      p = infor[i].getElementsByClassName('title')[0];
      txtValue = p.textContent || p.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        infor[i].style.display = '';
      } else {
        infor[i].style.display = 'none';
      }
    }
  }
}

// Render Best Sale
function RenderBestSale() {
  axios
    .get('http://localhost/be/DataList/TopSales.php')
    .then((e) => e.data)
    .then((e) => {
      let html = '';
      document.querySelector('.SideBar_bestseller_content').innerHTML = '';
      e.forEach((item) => {
        html += `<li class="row">
                            <div class="col-4">
                                <a href="./product.html" class="go-to-product" productid="${item.id}"><img src="${item.src}" alt=""></a>
                            </div>
                            <div class="col-8">
                                <p><a href="./product.html" class="go-to-product" productid="${item.id}">${item.name}</a></p>
                                <p>$<span>${item.price}</span></p>
                            </div>
                        </li>`;
      });
      document.querySelector('.SideBar_bestseller_content').innerHTML += html;
    });
}

// Làm 2 nút chuyển trang
var check = 0;
const previousBtn = document.querySelector('.previousbtn');
const nextBtn = document.querySelector('.nextbtn');
nextBtn.addEventListener('click', () => {
  let currentPage = localStorage.getItem('currentPage') * 1 + 1;
  localStorage.setItem('currentPage', currentPage);
  clickBtnChoosePage(currentPage);
});

previousBtn.addEventListener('click', () => {
  let currentPage = localStorage.getItem('currentPage') * 1 - 1;
  localStorage.setItem('currentPage', currentPage);
  clickBtnChoosePage(currentPage);
});

// Hàm đổ dữ liệu ra khi load trang
function renderContent(listProducts = 'empty', productsPerPage = 'empty') {
  axios
    .get('http://localhost/BE/DataList/ProductList.php')
    .then((e) => e.data)
    .then((e) => {
      productList = e;
      listProducts == 'empty' ? (listProducts = e) : '';
      listProducts == 'empty' ? '' : (productListToFliter = listProducts);
      var html2 = '';
      var html3 = '';
      var select = document.getElementById('show_items');
      var perPage = select.options[select.selectedIndex].value;
      let end = perPage * idPage;
      start = (idPage - 1) * perPage;
      let totalPages = Math.ceil(listProducts.length / perPage);
      if (idPage === totalPages) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
      if (start === 0) {
        previousBtn.disabled = true;
      } else {
        previousBtn.disabled = false;
      }
      console.log(listProducts);
      productsPerPage == 'empty' ? '' : (listProducts = productsPerPage);
      listProducts.forEach((item, i) => {
        if (i >= start && i < end) {
          html2 += `<div class="col-6 col-lg-4 content_container_item">
              <div class="content_container_item_border">
                  <div class="content_container_item_show">
                      <img src=${listProducts[i].src} alt="">
                      <div class="content_container_item_show_infor">
                          <p class="title">${listProducts[i].name}</p>
                          <p>$<span>${listProducts[i].price}</span></p>
                      </div>
                  </div>
                  <div class="content_container_item_hover">
                      <li>
                          <button class="add_view" productid="${item.id}"><i class="far fa-eye"></i></button>
                      </li>
                      <li>
                          <button class="add_cart" productid="${item.id}">Add to cart</button>`;
          if (
            !localStorage
              .getItem('wishlist')
              .split(',')
              .includes(item.id.toString())
          ) {
            html2 += `<button class="add_tym" productid="${item.id}"><i class="far fa-heart"></i></button>`;
          } else {
            html2 += `<button class="add_tym clicked-wishlist" productid="${item.id}"><i class="far fa-heart"></i></button>`;
          }
          html2 += `</li>
                  </div>
              </div>
          </div>`;

          let stringdetail = '';
          if (e[i].detail.length > 150) {
            stringdetail = e[i].detail.slice(0, 150) + ' ...';
          } else {
            stringdetail = e[i].detail;
          }

          html3 += `<div class="content_container_item_pillar ">
            <div class="content_container_item_pillar_img">
            <img src=${listProducts[i].src} alt="">
                <button class="add_view" productid="${item.id}"><i class="far fa-eye"></i></button>
            </div>
                <div class="content_container_item_pillar_content d-flex flex-column justify-content-between">
                    <div>
                    <h2><div class="h3" productid="${item.id}" >${listProducts[i].name}</div></h2>
                    
                    <div class="content_container_item_pillar_star">`;
          for (let i = 0; i < Math.round(item.rating); ++i) {
            html3 += `<i class="fa fa-star checked"></i>`;
          }
          for (let i = 0; i < 5 - Math.round(item.rating); ++i) {
            html3 += `<i class="fa fa-star"></i>`;
          }

          html3 += `</div>
                    <div class="content_container_item_pillar_price">
                        <span>$</span><span>${listProducts[i].price}</span>
                    </div>
                    <div class="content_container_item_pillar_content_title">
                        <span>${stringdetail}</span>
                    </div>
                </div>
                <div class="content_container_item_pillar_content_btn">
                    <button class="add_cart" productid="${item.id}">Add to cart</button>`;
          if (
            !localStorage
              .getItem('wishlist')
              .split(',')
              .includes(item.id.toString())
          ) {
            html3 += `<button class="add_tym" productid="${item.id}"><i class="far fa-heart"></i></button>`;
          } else {
            html3 += `<button class="add_tym clicked-wishlist" productid="${item.id}"><i class="far fa-heart"></i></button>`;
          }
          html3 += `</div>
            </div>
          </div>`;
        }
      });
      var html4 = ``;
      for (var i = 1; i <= totalPages; i++) {
        if (idPage === i) {
          html4 += `<p class="page-number" class='active'><span>${i}</span></p>`;
        } else {
          html4 += `<p class="page-number"><span>${i}</span></p>`;
        }
      }

      document.querySelector('.content_container_main').innerHTML = html2;
      document.querySelector('.content_container_main_pillar').innerHTML =
        html3;
      document.querySelector('.content_container_title_right').innerHTML =
        html4;
    });
  setTimeout(() => {
    let dom = document.querySelectorAll('.page-number');
    dom.forEach((item) => {
      item.onclick = () => {
        localStorage.setItem('currentPage', item.textContent);
        clickBtnChoosePage(item.textContent);
      };
    });
  }, 1000);
}

// Làm sự kiện click vào chọn trang
function clickBtnChoosePage(e) {
  let renderList = [...productListToFliter];

  let data = [];
  let productsPerPage = document.getElementById('show_items').value;
  for (let i = 0; i < e; i++) {
    data = renderList.splice(0, productsPerPage);
  }
  renderContent(productListToFliter, data);
  window.scrollTo({
    top: 400,
    behavior: 'smooth',
  });
}

//Lay va in ra brand
function RenderBrand() {
  axios
    .get('http://localhost/BE/DataList/Brands.php')
    .then((e) => e.data)
    .then((e) => {
      var html1 = '';
      e.forEach((item) => {
        html1 += `<li brandid="${item.id}" class="${item.name}"><span>${item.name}</span><span>(${item.quantity})</span></li>`;
      });
      document.querySelector('.SideBar_Color').outerHTML = html1;
      setTimeout(() => {
        let dom = document.querySelectorAll('li[brandid]');
        dom.forEach((item) => {
          item.onclick = () => {
            renderProductsByBrands(item.getAttribute('brandid'));
          };
        });
      }, 1000);
    });
}

// Làm nút tìm kiếm the giá sản phẩm Filter
setTimeout(() => {
  document.querySelector('.searchPrice').onclick = () => {
    priceSearch();
  };
}, 1000);
function priceSearch() {
  let low_price = document.getElementById('low_price').value;
  let expensive = document.getElementById('expensive').value;
  let data = new FormData();
  data.append('minPrice', low_price);
  data.append('maxPrice', expensive);
  axios
    .post('http://localhost/be/DataList/ProductFilters.php', data)
    .then((e) => {
      document.querySelector('.content_container_main').innerHTML = '';
      document.querySelector('.content_container_main_pillar').innerHTML = '';
      document.querySelector('.content_container_title_right').innerHTML = '';
      // document.querySelector(".SideBar_bestseller_content").innerHTML = '';
      renderContent(e.data);
    });
}

// Nut chuyen huong den product.html
function viewButton() {
  return new Promise((rs) => {
    header();
    setTimeout(() => {
      // click best sale to product
      let a = document.querySelectorAll('.go-to-product');
      a.forEach((item) => {
        item.onclick = () => {
          localStorage.setItem('productid', item.getAttribute('productid'));
        };
      });
      // click render by top
      document.querySelector('.filterTop').onclick = () => {
        let array = [];
        let sortedArry = [];
        productListToFliter.forEach((item) => {
          array.push(item.name);
        });
        array.sort().forEach((name) => {
          productListToFliter.filter((item) => {
            if (item.name == name) {
              sortedArry = [...sortedArry, ...[item]];
            }
          });
        });
        renderContent(sortedArry);
      };

      // click render by botton
      document.querySelector('.filterBottom').onclick = () => {
        let array = [];
        let reSortedArry = [];
        productListToFliter.forEach((item) => {
          array.push(item.name);
        });
        array.reverse().forEach((name) => {
          productListToFliter.filter((item) => {
            if (item.name == name) {
              reSortedArry = [...reSortedArry, ...[item]];
            }
          });
        });
        renderContent(reSortedArry);
      };

      // click view button to product
      let viewButton = document.querySelectorAll('.add_view');
      viewButton.forEach((item) => {
        item.onclick = () => {
          localStorage.setItem('productid', item.getAttribute('productid'));
          window.location = './product.html';
        };
      });

      // click name to product
      let nameButton = document.querySelectorAll('.title');
      nameButton.forEach((item) => {
        item.onclick = () => {
          window.location = './product.html';
          localStorage.setItem('productid', item.getAttribute('productid'));
        };
      });

      //. Add to cart
      let addCart = document.querySelectorAll('.add_cart');
      addCart.forEach((item) => {
        item.onclick = () => {
          productList.filter((i) => {
            if (i.id == item.getAttribute('productid')) {
              let data = new FormData();
              data.append('userid', localStorage.getItem('userid'));
              data.append('productid', i.id);
              data.append('quantity', 1);
              data.append('price', i.price);
              data.append('img', i.src);
              axios
                .post('http://localhost/be/Checkout/AddToCart.php', data)
                .then((e) => e.data)
                .then((e) => {
                  console.log(e);
                  e == 'Add Success'
                    ? alertMess(e)
                    : alertMess('Error', 'Error');
                });
              return;
            }
          });
        };
      });
      //. Wishlist
      let addWishlist = document.querySelectorAll('.add_tym');
      addWishlist.forEach((item) => {
        item.onclick = () => {
          let data = new FormData();
          data.append('userid', localStorage.getItem('userid'));
          data.append('productid', item.getAttribute('productid'));
          if (item.className.includes('clicked-wishlist')) {
            axios
              .post('http://localhost/be/Wishlist/delete.php', data)
              .then((e) => {
                if (e.data == 'Delete Succes') {
                  item.className = item.className.replace(
                    'clicked-wishlist',
                    ''
                  );
                }
              });
          } else {
            axios
              .post('http://localhost/be/Wishlist/Add.php', data)
              .then((e) => {
                if (e.data == 'Add Succes') {
                  item.className += ' clicked-wishlist';
                }
              });
          }
        };
      });

      rs();
    }, 1000);
  });
}

// Xu li bat dong bo
function render() {
  return new Promise((rs) => {
    setTimeout(() => {
      renderContent();
      rs('ok chay xong');
    }, 1000);
  });
}

async function asyncCall() {
  await render();
  await viewButton();
}
let data = new FormData();
data.append('userid', localStorage.getItem('userid'));
axios
  .post('http://localhost/be/Wishlist/list.php', data)
  .then((e) => e.data)
  .then((e) => {
    localStorage.setItem('wishlist', e);
  });

RenderBestSale();
RenderBrand();

if (localStorage.getItem('brandid')) {
  renderProductsByBrands(localStorage.getItem('brandid'));
  setTimeout(() => {
    viewButton();
    // localStorage.removeItem('brandid');
  }, 1000);
} else if (localStorage.getItem('cateid')) {
  renderProductsByCategories(localStorage.getItem('cateid'));
  setTimeout(() => {
    viewButton();
    // localStorage.removeItem('cateid');
  }, 1000);
} else {
  asyncCall();
}

// Render product by Categories
function renderProductsByCategories(cateid) {
  localStorage.setItem('currentPage', 1);

  let data = new FormData();
  data.append('cateid', cateid);
  axios
    .post('http://localhost/be/DataList/ProductFilters.php', data)
    .then((e) => {
      document.querySelector('.content_container_main').innerHTML = '';
      document.querySelector('.content_container_main_pillar').innerHTML = '';
      document.querySelector('.content_container_title_right').innerHTML = '';
      // document.querySelector(".SideBar_bestseller_content").innerHTML = '';
      renderContent(e.data);
    });
}

// Render Prodcut by Brand
function renderProductsByBrands(brandid) {
  localStorage.setItem('currentPage', 1);

  let data = new FormData();
  data.append('brand', brandid);
  axios
    .post('http://localhost/be/DataList/ProductFilters.php', data)
    .then((e) => {
      document.querySelector('.content_container_main').innerHTML = '';
      document.querySelector('.content_container_main_pillar').innerHTML = '';
      document.querySelector('.content_container_title_right').innerHTML = '';
      // document.querySelector(".SideBar_bestseller_content").innerHTML = '';
      renderContent(e.data);
    });
}
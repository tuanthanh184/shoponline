import { componentHTML } from './module/components.js';
import { header } from './module/header.js';
import { alertMess } from './module/alert.js';
import { multiPageItems } from './module/multipage.js';

// Square display and Pillar display
const squareBtn = document.querySelector('.square-btn');
const pillarBtn = document.querySelector('.pillar-btn');

// Show Pillar hide Square
pillarBtn.addEventListener('click', () => {
  document.querySelector('.main-content__square').classList.add('hide');
  document.querySelector('.main-content__pillar').classList.add('show');
  if (squareBtn.classList.contains('active')) {
    squareBtn.classList.remove('active');
    pillarBtn.classList.add('active');
  }
});

// Show Square hide Pillar
squareBtn.addEventListener('click', () => {
  document.querySelector('.main-content__square').classList.remove('hide');
  document.querySelector('.main-content__pillar').classList.remove('show');
  if (pillarBtn.classList.contains('active')) {
    squareBtn.classList.add('active');
    pillarBtn.classList.remove('active');
  }
});

(async () => {
  await componentHTML();
  await header();
})();

const limitSize = 15;

// Get and render Brands
function renderBrand() {
  axios
    .get('http://localhost/BE/DataList/ProductList.php')
    .then((e) => e.data)
    .then((e) => {
      // Get an object of brand and its quantity
      let brandList = e.reduce((result, item) => {
        !result[item.brand]
          ? (result[item.brand] = 1)
          : (result[item.brand] += 1);
        return result;
      }, {});
      let htmlBrandList = '';
      for (const brand in brandList) {
        htmlBrandList += `<li>
            <span class="brand-name">${brand}</span>
            <span>(${brandList[brand]})</span>
          </li>`;
      }
      const brandListRender = document.querySelector('.SideBar_content');
      brandListRender.innerHTML += htmlBrandList;
      // Render Products by Brand
      const listDOM = document.querySelectorAll('.SideBar_content li');
      listDOM.forEach((liElement) => {
        liElement.addEventListener('click', () => {
          let BrandValDOM = liElement.querySelector('.brand-name').innerText;
          let filterBrands = e.filter((item) => item.brand === BrandValDOM);
          renderProducts({
            renderList: filterBrands,
            square: '.main-content__square',
            pillar: '.main-content__pillar',
          });
          multiPageItems('.square', limitSize);
          searchPrice(filterBrands);
        });
      });
    });
}
renderBrand();

// Render Products
function renderProducts(options) {
  // Square display
  let htmlSquare = options.renderList.reduce(
    (html, item) =>
      html +
      `<div class="square">
        <div class="square-img">
          <img src="${item.src}" />
          <div class="square-img__blur">
            <div class="view">
              <i class="far fa-eye"></i>
            </div>
          </div>
        </div>
        <div class="square-detail">
          <div class="square-detail__top">
            <a
              href="#"
              class="product-link product-name-link"
              productid="${item.id}"
              >${item.name}</a
            >
          </div>
          <div class="square-detail__bottom">
            <div class="price">$ ${item.price}</div>
            <div class="d-flex">
              <div class="addcart">
                <button>Add to cart</button>
              </div>
              <div class="wishlist" productid="${item.id}">
                <i class="far fa-heart" productid="${item.id}"></i>
              </div>
              <div class="wishlist clicked-wishlist" productid="${item.id}">
                <i
                  class="far fa-heart"
                  style="color: white"
                  productid="${item.id}"
                ></i>
              </div>
              <div class="compare" productid="${item.id}">
                <i class="fas fa-retweet"></i>
              </div>
            </div>
          </div>
        </div>
      </div>`,
    ''
  );
  document.querySelector(options.square).innerHTML = htmlSquare;
  // Pillar display
  let htmlPillar = options.renderList.reduce((html, item) => {
    html += `<div class="pillar">
        <div class="pillar-img">
          <img src=${item.src}>
          <div class="pillar-img__blur">
            <div class="view productid="${item.id}">
              <i class="far fa-eye"></i>
            </div>
          </div>
        </div>
        <div class="pillar_content d-flex flex-column justify-content-between">
          <div class="pillar-content__top">
            <a href="#" productid="${item.id}" >${item.name}</a>
            <div class="pillar_star">`;
    for (let i = 0; i < Math.round(item.rating); ++i) {
      html += `<i class="fa fa-star checked"></i>`;
    }
    for (let i = 0; i < 5 - Math.round(item.rating); ++i) {
      html += `<i class="fa fa-star"></i>`;
    }
    html += `</div>
            <div class="pillar_price">
              <span>$${item.price}</span>
            </div>
            <div class="item_pillar_content_detail">
                <p>${item.detail}</p>
            </div>
          </div>
          <div class="d-flex">
            <div class="addcart">
              <button productid="${item.id}">Add to cart</button>
            </div>
            <div class="wishlist productid="${item.id}">
              <i class="far fa-heart"></i>
            </div>
            <div class="compare">
              <i class="fas fa-retweet"></i>
            </div>
          </div>
        </div>
      </div>`;
    return html;
  }, '');
  document.querySelector(options.pillar).innerHTML = htmlPillar;
}

axios
  .get('http://localhost/BE/DataList/ProductList.php')
  .then((e) => e.data)
  .then((e) => {
    renderProducts({
      renderList: e,
      square: '.main-content__square',
      pillar: '.main-content__pillar',
    });
    // console.log(document.querySelector('.main-content__pillar'));
    multiPageItems('.square', limitSize);
    // multiPageItems('.main-content__pillar', 5);
    searchPrice(e);
  });

// Get and render 5 bestseller Items
function renderBestSeller(limitItem) {
  axios
    .get('http://localhost/BE/DataList/ProductList.php')
    .then((e) => e.data)
    .then((e) => {
      let soldList = e
        .sort((a, b) => b.sold - a.sold) // Sort item.sold by desc order
        .slice(0, limitItem); // Get top 5 item.sold

      let htmlBestSeller = soldList.reduce(
        (html, item) =>
          html +
          `<li class="row">
          <div class="col-4">
          <a href="./product.html" class="go-to-product" productid="${item.id}"><img src="${item.src}"></a>
          </div>
          <div class="col-8">
          <p><a href="./product.html" class="go-to-product" productid="${item.id}">${item.name}</a></p>
          <p>$${item.price}</p>
          </div>
          </li>`,
        ''
      );
      const bestSellerContent = document.querySelector('.bestseller-js');
      bestSellerContent.innerHTML = htmlBestSeller;
    });
}
renderBestSeller(5);

var productListToFliter = [];
var productList = [];

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

// Filter Products by Price
function searchPrice(productList) {
  const searchBtn = document.querySelector('.search-price');
  searchBtn.addEventListener('click', () => {
    const minPrice = document.querySelector('#min-price');
    const maxPrice = document.querySelector('#max-price');
    if (!minPrice.value || !maxPrice.value || minPrice.value > maxPrice.value) {
      document.querySelector('small').innerText = 'Invalid';
    } else {
      document.querySelector('small').innerText = '';
      let filterPrice = productList.filter(
        (item) =>
          parseInt(item.price) <= maxPrice.value &&
          parseInt(item.price) >= minPrice.value
      );
      renderProducts({
        renderList: filterPrice,
        square: '.main-content__square',
        pillar: '.main-content__pillar',
      });
    }
  });
}

// Nut chuyen huong den product.html
function viewButton() {
  return new Promise((rs) => {
    setTimeout(() => {
      // click best sale to product
      let a = document.querySelectorAll('.go-to-product');
      a.forEach((item) => {
        item.onclick = () => {
          localStorage.setItem('productid', item.getAttribute('productid'));
        };
      });
      // click render by top
      // document.querySelector('.filterTop').onclick = () => {
      //   let array = [];
      //   let sortedArry = [];
      //   productListToFliter.forEach((item) => {
      //     array.push(item.name);
      //   });
      //   array.sort().forEach((name) => {
      //     productListToFliter.filter((item) => {
      //       if (item.name == name) {
      //         sortedArry = [...sortedArry, ...[item]];
      //       }
      //     });
      //   });
      //   renderContent(sortedArry);
      // };

      // click render by botton
      // document.querySelector('.filterBottom').onclick = () => {
      //   let array = [];
      //   let reSortedArry = [];
      //   productListToFliter.forEach((item) => {
      //     array.push(item.name);
      //   });
      //   array.reverse().forEach((name) => {
      //     productListToFliter.filter((item) => {
      //       if (item.name == name) {
      //         reSortedArry = [...reSortedArry, ...[item]];
      //       }
      //     });
      //   });
      //   renderContent(reSortedArry);
      // };

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
      // renderContent();
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
      document.querySelector('.main-content__square').innerHTML = '';
      document.querySelector('.main-content__pillar').innerHTML = '';
      document.querySelector('.number-pagination').innerHTML = '';
      // document.querySelector(".SideBar_bestseller_content").innerHTML = '';
      renderContent(e.data);
    });
}

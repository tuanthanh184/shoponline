import { componentHTML } from './module/components.js';
import { header } from './module/header.js';
import { alertMess } from './module/alert.js';
import { pagination } from './module/pagination.js';

// Square display and Pillar display
const squareBtn = document.querySelector('.square-btn');
const pillarBtn = document.querySelector('.pillar-btn');
const limitSizeSquare = 15;
const limitSizePillar = 5;

(async () => {
  await componentHTML();
  await header();
})();

axios.get('https://thanh-shop-api-demo.herokuapp.com/data').then(({ data }) => {
  renderProducts({
    renderList: data,
    square: '.main-content__square',
    pillar: '.main-content__pillar',
  });
  // Show Pillar hide Square
  pillarBtn.addEventListener('click', () => {
    document.querySelector('.main-content__square').classList.add('hide');
    document.querySelector('.main-content__pillar').classList.add('show');
    if (squareBtn.classList.contains('active')) {
      squareBtn.classList.remove('active');
      pillarBtn.classList.add('active');
      pagination('.pillar', limitSizePillar);
    }
  });

  // Show Square hide Pillar
  squareBtn.addEventListener('click', () => {
    document.querySelector('.main-content__square').classList.remove('hide');
    document.querySelector('.main-content__pillar').classList.remove('show');
    if (pillarBtn.classList.contains('active')) {
      pillarBtn.classList.remove('active');
      squareBtn.classList.add('active');
      pagination('.square', limitSizeSquare);
    }
  });
  searchProductsByInput(data);
  searchPrice(data);
  sortProducts(data);
});

// Get and render Brands
(function renderBrands() {
  axios
    .get('https://thanh-shop-api-demo.herokuapp.com/data')
    .then(({ data }) => {
      // Get an object of brand and its quantity
      let brandList = data.reduce((result, item) => {
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
      const brandListRender = document.querySelector('.brandlist');
      brandListRender.innerHTML += htmlBrandList;
      // Render Products by Brand
      const listDOM = document.querySelectorAll('.brandlist li');
      listDOM.forEach((liElement) => {
        liElement.addEventListener('click', () => {
          let BrandValDOM = liElement.querySelector('.brand-name').innerText;
          document.querySelector('.main-title').innerText = BrandValDOM;
          let filterBrands = data.filter((item) => item.brand === BrandValDOM);
          renderProducts({
            renderList: filterBrands,
            square: '.main-content__square',
            pillar: '.main-content__pillar',
          });
          searchPrice(filterBrands);
          sortProducts(filterBrands);
        });
      });
    });
})();

// Render Products
function renderProducts(options) {
  // Square display
  let htmlSquare = options.renderList.reduce((html, item) => {
    html += `<div class="square">
        <div class="square-top">
          <a href="#" id="${item.id}">
            <div class="square-img"><img src="${item.src}" /></div>
            <span>${item.name}</span>
          </a>
        </div>
        <div class="square-bottom">
          <div class="d-flex justify-content-between">
            <span class="square-price">$ ${item.price}</span>
            <div class="d-flex align-items-center">
              <span class="product-sold">Sold:</span>
              <span class="product-sold-number">${item.sold}</span>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <div class="rating-star d-flex align-items-center">`;
    for (let i = 0; i < Math.round(item.rating); ++i) {
      html += `<i class="fa fa-star checked"></i>`;
    }
    for (let i = 0; i < 5 - Math.round(item.rating); ++i) {
      html += `<i class="fa fa-star"></i>`;
    }
    html += `</div>
            <div class="d-flex">
              <div class="wishlist" productid="${item.id}">
                <button class="wishlist-btn"><i class="far fa-heart" productid="${item.id}"></i></button>                
              </div>
              <div class="compare" productid="${item.id}">
                <button class="compare-btn"><i class="fas fa-retweet"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    return html;
  }, '');
  document.querySelector(options.square).innerHTML = htmlSquare;
  // Pillar display
  let htmlPillar = options.renderList.reduce((html, item) => {
    html += `<div class="pillar">
        <div class="pillar-img"><img src=${item.src}></div>
          <div class="d-flex flex-column justify-content-between">
            <div class="pillar-content__top">
              <div><a href="#" productid="${item.id}" >${item.name}</a></div>
              <div class="rating-star">`;
    for (let i = 0; i < Math.round(item.rating); ++i) {
      html += `<i class="fa fa-star checked"></i>`;
    }
    for (let i = 0; i < 5 - Math.round(item.rating); ++i) {
      html += `<i class="fa fa-star"></i>`;
    }
    html += `</div>
            <div class="pillar-price">$${item.price}</div>
            <div class="pillar-content__detail">
                <p>${item.detail}</p>
            </div>
          </div>
          <div class="d-flex">
            <div class="d-flex align-items-center">
              <span class="product-sold">Sold:</span>
              <span class="product-sold-number">${item.sold}</span>
            </div>
            <div class="d-flex">
              <div class="wishlist" productid="${item.id}">
                <button class="wishlist-btn"><i class="far fa-heart" productid="${item.id}"></i></button>                
              </div>
              <div class="compare" productid="${item.id}">
                <button class="compare-btn"><i class="fas fa-retweet"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    return html;
  }, '');
  document.querySelector(options.pillar).innerHTML = htmlPillar;

  if (squareBtn.classList.contains('active')) {
    pagination('.square', limitSizeSquare);
  }
  if (pillarBtn.classList.contains('active')) {
    pagination('.pillar', limitSizePillar);
  }
}

// Filter Products by Price
function searchPrice(productList) {
  const searchBtn = document.querySelector('.search-price');
  searchBtn.addEventListener('click', () => {
    const minPrice = parseInt(document.querySelector('#min-price').value);
    const maxPrice = parseInt(document.querySelector('#max-price').value);
    if (!minPrice || !maxPrice || minPrice > maxPrice) {
      document.querySelector('small').innerText = 'Invalid';
    } else {
      document.querySelector('small').innerText = '';
      let filterPrice = productList.filter(
        (item) =>
          parseInt(item.price) <= maxPrice && parseInt(item.price) >= minPrice
      );
      renderProducts({
        renderList: filterPrice,
        square: '.main-content__square',
        pillar: '.main-content__pillar',
      });
    }
  });
}

// Sort Products
function sortProducts(productList) {
  const sortSelect = document.querySelector('.sort-products');
  sortSelect.addEventListener('change', () => {
    let option = sortSelect.querySelector('option:checked').value;
    switch (option) {
      case 'ascending-name':
        productList.sort((a, b) => {
          if (a.name < b.name) return -1;
        });
        renderProducts({
          renderList: productList,
          square: '.main-content__square',
          pillar: '.main-content__pillar',
        });
        break;
      case 'descending-name':
        productList.sort((a, b) => {
          if (a.name > b.name) return -1;
        });
        renderProducts({
          renderList: productList,
          square: '.main-content__square',
          pillar: '.main-content__pillar',
        });
        break;
      case 'ascending-price':
        productList.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        renderProducts({
          renderList: productList,
          square: '.main-content__square',
          pillar: '.main-content__pillar',
        });
        break;
      case 'descending-price':
        productList.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        renderProducts({
          renderList: productList,
          square: '.main-content__square',
          pillar: '.main-content__pillar',
        });
        break;
      default:
        break;
    }
  });
}

function searchProductsByInput(productList) {
  const searchInput = document.querySelector('.search-box-input');
  searchInput.addEventListener('input', (event) => {
    let resultList = productList.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    renderProducts({
      renderList: resultList,
      square: '.main-content__square',
      pillar: '.main-content__pillar',
    });
    searchPrice(resultList);
    sortProducts(resultList);
  });
}

var productListToFliter = [];
var productList = [];

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
  // } else {
  //   asyncCall();
}

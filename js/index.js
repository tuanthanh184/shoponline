import { componentHTML } from './module/components.js';
import { header, updateCartNoti } from './module/header.js';
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
  showDetailProduct(data);
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
          showDetailProduct(filterBrands);
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
            <div class="square-img"><img src="${item.src}" /></div>
            <span>${item.name}</span>
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
            <div class="detail">
              <button class="detail-btn btn" id="${item.id}">Detail</button>                
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
                <span>${item.detail}</span>
            </div>
          </div>
          <div class="d-flex">
            <div class="d-flex align-items-center mr-3">
              <span class="product-sold">Sold:</span>
              <span class="product-sold-number">${item.sold}</span>
            </div>
            <div class="detail">
              <button class="detail-btn btn" id="${item.id}">Detail</button>                
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
      showDetailProduct(productList);
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
        showDetailProduct(productList);
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
        showDetailProduct(productList);
        break;
      case 'ascending-price':
        productList.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        renderProducts({
          renderList: productList,
          square: '.main-content__square',
          pillar: '.main-content__pillar',
        });
        showDetailProduct(productList);
        break;
      case 'descending-price':
        productList.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        renderProducts({
          renderList: productList,
          square: '.main-content__square',
          pillar: '.main-content__pillar',
        });
        showDetailProduct(productList);
        break;
      default:
        break;
    }
  });
}

// Search Products
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
    showDetailProduct(resultList);
  });
}

function showDetailProduct(productList) {
  const detailBtns = document.querySelectorAll('.detail-btn');
  detailBtns.forEach((detailBtn) => {
    detailBtn.addEventListener('click', (e) => {
      let data = productList.find((product) => product.id === e.target.id);
      document.querySelector('.main-content').style.display = 'none';
      let html = '';
      html += `
      <div class="product-detail__top">
        <div class="image">
          <img src="${data.src}" />
        </div>
        <div class="product-info">
          <div class="product-info__top">
            <div class="product-info__top-head">
              <h1 class="h5">${data.name}</h1>
            </div>
            <div class="d-flex justify-content-between">
              <div class="rating-star">`;
      for (let i = 0; i < Math.round(data.rating); ++i) {
        html += `<i class="fa fa-star checked"></i>`;
      }
      for (let i = 0; i < 5 - Math.round(data.rating); ++i) {
        html += `<i class="fa fa-star"></i>`;
      }
      html += `</div>
              <div>
                <span class="product-sold">Sold:</span>
                <span class="product-sold-number">${data.sold}</span>
              </div>
            </div>
            <div class="detail-price">$ ${data.price}</div>
            <div class="status">`;
      if (parseInt(data.quantity) > parseInt(data.sold)) {
        html += `<span class="text-success">In Stock</span>`;
      } else {
        html += `<span class="text-danger">Out Of Stock</span>`;
      }
      html += `</div>
          </div>
          <div class="product-info__bottom">
            <div class="d-flex">
              <div class="quantity-modifier">
                <input type="button" value="-" class="minus">
                <input type="number" value="1" class="quantity">
                <input type="button" value="+" class="plus">
              </div>
              <div class="addcart">
                <button class="addcart-btn btn">Add to cart</button>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div class="brand-detail">
                <span class="title">Brand: </span>
                <span>${data.brand}</span>
              </div>
              <div class="made-in">
                <span class="title">Made In:</span>
                <span>${data.country}</span>
              </div>
            </div>
            <div class="social d-flex">
              <span class="title">Share: </span>
              <a href="https://www.facebook.com/" class="social-link">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/" class="social-link">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/" class="social-link">
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="product-detail__bottom">
        <h4>Description</h4>
        <p class="text-justify">${data.detail}</p>
      </div>`;
      document.querySelector('.product-detail').innerHTML = html;
      window.scrollTo({
        top: 250,
        behavior: 'smooth',
      });
      const backBtn = document.querySelector('.back-btn');
      backBtn.classList.remove('d-none');
      backBtn.addEventListener('click', (e) => {
        document.querySelector('.product-detail').innerHTML = '';
        document.querySelector('.main-content').style.display = 'block';
        e.target.classList.add('d-none');
      });
      counter();
      addToCart(data);
    });
  });
}

// Add and Minus Quantity of Product
function counter() {
  const plusBtn = document.querySelector('.plus');
  const minusBtn = document.querySelector('.minus');
  const quantityInput = document.querySelector('.quantity');
  plusBtn.addEventListener('click', (e) => {
    let quantity = e.target.previousElementSibling;
    let newValue = parseInt(quantity.value) + 1;
    quantity.value = newValue;
  });
  minusBtn.addEventListener('click', (e) => {
    let quantity = e.target.nextElementSibling;
    let newValue = parseInt(quantity.value) - 1;
    if (newValue > 0) {
      quantity.value = newValue;
    }
  });
  quantityInput.addEventListener('input', (e) => e.target.value);
}

// Add to cart Button
function addToCart(dataProduct) {
  const addToCartBtn = document.querySelector('.addcart-btn');
  addToCartBtn.addEventListener('click', () => {
    axios
      .get('https://thanh-shop-api-demo.herokuapp.com/cartlist')
      .then(({ data }) => {
        // Check if product is already existed in cart
        let existedProduct = data.find(
          (productCartlist) => productCartlist.productID == dataProduct.id
        );
        if (existedProduct) {
          axios
            .put(
              `https://thanh-shop-api-demo.herokuapp.com/cartlist/${existedProduct.id}`,
              {
                productID: dataProduct.id,
                name: dataProduct.name,
                src: dataProduct.src,
                quantity:
                  parseInt(existedProduct.quantity) +
                  parseInt(document.querySelector('.quantity').value),
                price: dataProduct.price,
              }
            )
            .then(() => {
              document.querySelector('.quantity').value = 1;
            });
        } else {
          axios
            .post('https://thanh-shop-api-demo.herokuapp.com/cartlist', {
              productID: dataProduct.id,
              name: dataProduct.name,
              src: dataProduct.src,
              quantity: parseInt(document.querySelector('.quantity').value),
              price: dataProduct.price,
            })
            .then(({ status }) => alertMess(status))
            .then(() => updateCartNoti())
            .then(() => {
              document.querySelector('.quantity').value = 1;
            });
        }
      });
    //
  });
}

export { counter };

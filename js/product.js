import { componentHTML } from './module/components.js';
import { header, countItemCart } from './module/header.js';
import { slider } from './slider.js';
import { compare } from './module/compare.js';
import { alertMess } from './module/alert.js';

// ----------------------------------

componentHTML();
var product = [];
var productAddCart = [];
var totalquantity = 1;
function getDataFromServer() {
  //Render chi tiết sản phẩm
  $.ajax('http://localhost/BE/DataList/Product.php').done(function (data) {
    $.parseJSON(data).map((item) => {
      if (item.id == localStorage.getItem('productid')) {
        product = [...product, ...[item]];
      }
    });
    // Product-detail
    document.querySelector('.bread-crumb__productname').innerHTML =
      product[0].name;

    let html = `<div class="images">
          <div class="image">
              <img src="${product[0].src}">
          </div> 
          <div class="sub-images">
      `;
    product.map((item) => {
      html += `<img src="${item.src}">`;
    });
    html += `</div>
      </div>
      <div class="product-info">
          <div class="product-info__top">
              <div class="product-info__top-head">
                  <h1 class="title">${product[0].name}
                  </h1>
                  <div class="rating"> `;
    for (let i = 0; i < Math.round(product[0].rating); ++i) {
      html += `<i class="fa fa-star checked"></i>`;
    }
    for (let i = 0; i < 5 - Math.round(product[0].rating); ++i) {
      html += `<i class="fa fa-star"></i>`;
    }
    html += `<span style='margin-left: 25px; font-weight:300; font-size: 12px'><i>${product[0].view} views</i></span></div>`;
    if (product[0].sale == '') {
      html += `<div class="prices">
                        <span class="new-price">$ ${product[0].price}</span>
                    </div>`;
    } else {
      html += `<div class="prices">
                        <span class="old-price">$ ${product[0].price}</span>
                        <span class="new-price">$ ${
                          (product[0].price * (100 - product[0].sale)) / 100
                        }</span>
                    </div>`;
    }
    if (parseInt(product[0].quantity) > parseInt(product[0].sold)) {
      html += `<div class="status green">In Stock</div>`;
    } else {
      html += `<div class="status red">Out Of Stock</div>`;
    }
    html += `</div>
              <div class="social">
                  <span class="title">Share</span>
                  <a href="https://www.facebook.com/" class="social-link"><i
                          class="fab fa-facebook-f"></i></a>
                  <a href="https://twitter.com/" class="social-link"><i
                          class="fab fa-twitter"></i></a>
                  <a href="https://www.instagram.com/" class="social-link"><i
                          class="fab fa-instagram"></i></a>
              </div>
          </div>
          <div class="product-info__bottom">
              <div class="addcart-wrapper">
                  <div class="quantity-modifier">
                      <input type="button" value="-" class="minus">
                      <input type="number" value="1" class="quantity">
                      <input type="button" value="+" class="plus">
                  </div>
                  <div class="addcart">
                      <button>
                          <span>Add to cart</span>
                      </button>
                  </div>`;
    if (
      !localStorage
        .getItem('wishlist')
        .split(',')
        .includes(product[0].id.toString())
    ) {
      html += `<div class="wishlist" productid="${product[0].id}">
        <i class="far fa-heart" productid="${product[0].id}"></i>
      </div>`;
    } else {
      html += `<div class="wishlist clicked-wishlist" productid="${product[0].id}">
                     <i class="far fa-heart" style='color:white' productid="${product[0].id}"></i>
                   </div>`;
    }
    html += `<div class="compare" productid="${product[0].id}">
                      <i class="fas fa-retweet"></i>
                  </div>
              </div>
              <div class="categories-tag">
                  <span class="title">Categories: </span>`;
    product[0].anniversary.split(',').map((item) => {
      html += `<a href="./products.html" class="product-link product-cate-link fst-italic">${item}</a>,`;
    });
    html += `</div>
              <small>
                  <span><i>Made In: </i></span>
                  <b><i>${product[0].country}</i></b>
              </small>
              <div class="download">
                  <a href="http://localhost/document/${product[0].name
                    .split(' ')
                    .join(
                      '%20'
                    )}.docx" class="download-btn"><i class="fas fa-arrow-alt-to-bottom" style="margin-right: 10px;"></i>More Info</a>
              </div>
          </div>
      </div>`;
    $('.product-detail').append(html);

    // Thêm Description
    $('.desc-text').text(product[0].detail);
    $('.product-name__review').text(product[0].name);
  });
}
function RenderBestSale() {
  axios
    .get('http://localhost/be/DataList/TopSales.php')
    .then((e) => e.data)
    .then((e) => {
      let html = '';
      document.querySelector('#render-leftside-bestsellers').innerHTML = '';
      e.forEach((item) => {
        html += `<li>
                  <div class="item-content">
                      <a href="./product.html" class="product-name-link" productid="${item.id}"><img src="${item.src}" width="100px" height="100px"
                              alt="" class="thumbnail"></a>
                      <div class="item-info">
                          <a href="./product.html" productid="${item.id}" title="${product.name}" class="product-link product-name-link">${item.name}</a>`;
        if (item.sale == '') {
          html += `
          <div class="prices">
            <span class="new-price">$ ${item.price}</span>
          </div>`;
        } else {
          html += `
          <div class="prices">
            <span class="new-price">$ ${
              (item.price * (100 - item.sale)) / 100
            }</span>
          </div>`;
        }
        html += `</div>
                  </div>
              </li>`;
      });
      document.querySelector('#render-leftside-bestsellers').innerHTML += html;
    });
}

function addDOMEvent() {
  let dom = document.querySelectorAll('.addcart2');
  dom.forEach((item) => {
    item.onclick = () => {
      let product = productAddCart.filter((i) => {
        return i.id == item.getAttribute('productid');
      });
      let data = new FormData();
      data.append('userid', localStorage.getItem('userid'));
      data.append('productid', product[0].id);
      data.append('quantity', 1);
      data.append('price', product[0].price);
      data.append('img', product[0].src);
      axios
        .post('http://localhost/be/Checkout/AddToCart.php', data)
        .then((e) => e.data)
        .then((e) => {
          e == 'Add Success' ? alertMess(e) : alertMess('Error', 'Error');
          countItemCart();
        });
    };
  });
  // Kiểm tra DOM đã được render hay chưa
  function docReady(fn) {
    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      setTimeout(fn, 1);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  docReady(header);

  // Go to categories
  let gotoCate = document.querySelectorAll('.product-cate-link');
  gotoCate.forEach((item) => {
    item.onclick = () => {
      localStorage.setItem('cateid', item.textContent);
    };
  });

  // Thêm số lượng sản phẩm
  docReady(() => {
    const plusBtn = document.querySelector('.plus');
    const minusBtn = document.querySelector('.minus');
    const quantityInput = document.querySelector('.quantity');
    plusBtn.addEventListener('click', (e) => {
      let quantity = e.target.previousElementSibling;
      let newValue = parseInt(quantity.value) + 1;
      quantity.value = newValue;
      totalquantity = newValue;
    });
    minusBtn.addEventListener('click', (e) => {
      let quantity = e.target.nextElementSibling;
      let newValue = parseInt(quantity.value) - 1;
      if (newValue > 0) {
        quantity.value = newValue;
      }
      totalquantity = newValue;
    });
    quantityInput.addEventListener('input', (e) => {
      e.target.value == '' ? (e.target.value = 1) : '';
      quantity = e.target.value;
    });
  });
  // So sánh sản phẩm
  docReady(compare);
  // Slider
  docReady(slider);
  // Add to cart button
  docReady(() => {
    document.querySelector('.addcart').onclick = () => {
      let data = new FormData();
      data.append('userid', localStorage.getItem('userid'));
      data.append('productid', product[0].id);
      data.append('quantity', totalquantity);
      data.append('price', product[0].price);
      data.append('img', product[0].src);
      axios
        .post('http://localhost/be/Checkout/AddToCart.php', data)
        .then((e) => e.data)
        .then((e) => {
          e == 'Add Success' ? alertMess(e) : alertMess('Error', 'Error');
          countItemCart();
        });
    };
  });
  // Hiển thị ảnh to khi bấm vào ảnh nhỏ
  docReady(() => {
    const subImgs = document.querySelectorAll('.sub-images img');
    subImgs.forEach((subImg) => {
      subImg.addEventListener('click', () => {
        let bigImg = document.querySelector('.image img');
        bigImg.src = subImg.src;
      });
    });
  });
  // Button Whishlist
  let wl = document.querySelectorAll('.wishlist');
  wl.forEach((item) => {
    item.onclick = (e) => {
      console.log(e);
      let data = new FormData();
      data.append('userid', localStorage.getItem('userid'));
      data.append('productid', e.target.getAttribute('productid'));
      if (item.className.includes('clicked-wishlist')) {
        axios
          .post('http://localhost/be/Wishlist/delete.php', data)
          .then((e) => {
            if (e.data == 'Delete Succes') {
              item.className = item.className.replace('clicked-wishlist', '');
              let b = item.childNodes;
              b[1].style.color = '#d7182a';
            }
          });
      } else {
        axios.post('http://localhost/be/Wishlist/Add.php', data).then((e) => {
          if (e.data == 'Add Success') {
            item.className += ' clicked-wishlist';
            let b = item.childNodes;
            b[1].style.color = 'white';
          }
        });
      }
    };
  });

  // Đánh giá, rating về sản phẩm (post comment vào db)
  docReady(() => {
    if (localStorage.userid) {
      document.querySelector('.no-login').style.display = 'none';
      document.querySelector('.already-logged-in').style.display = 'block';
      const formReview = document.querySelector('#form-review');
      // Rating
      let ratingStar = document.querySelectorAll('.ratable i');
      let checked;
      for (let i = 0; i < ratingStar.length; i++) {
        ratingStar[i].addEventListener('click', () => {
          for (let j = 0; j < i + 1; j++) {
            ratingStar[j].classList.add('checked');
          }
          for (let j = ratingStar.length - 1; j > i; j--) {
            ratingStar[j].classList.remove('checked');
          }
          checked = document.querySelectorAll('.ratable i.checked');
        });
      }
      let submitBtn = formReview.querySelector('input[type="submit"]');
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append('productid', localStorage.getItem('productid'));
        data.append('userid', localStorage.getItem('userid'));
        data.append('content', document.querySelector('#review-text').value);
        data.append('rating', checked.length);
        axios
          .post('http://localhost/be/Comment/Postcomment.php', data)
          .then((e) => {
            if (e.data == 'Comment success') {
              alertMess(e.data);
            }
          });
      });
    }
  });

  // Lấy data về client
  docReady(() => {
    let data = new FormData();
    data.append('productid', localStorage.getItem('productid'));
    axios.post('http://localhost/be/Comment/GetComment.php', data).then((e) => {
      console.log(e);
      if (e.data !== []) {
        document.querySelector('.no-review').style.display = 'none';
        const reviews = document.querySelector('.reviews');
        let html = '';
        for (let i = 0; i < e.data.length; i++) {
          html += `<div class="review">
                        <div class="username-wrapper">
                        <span class="username">${e.data[i].firstname} ${e.data[i].lastname}</span>
                        <div class="rating">`;
          for (let j = 0; j < parseInt(e.data[i].rating); ++j) {
            html += `<i class="fa fa-star checked"></i>`;
          }
          for (let j = 0; j < 5 - parseInt(e.data[i].rating); ++j) {
            html += `<i class="fa fa-star"></i>`;
          }
          html += `</div>
          </div>
          <p>
            ${e.data[i].content}
          </p>
          </div>`;
        }
        reviews.innerHTML = html;
      }
    });
  });

  // Button product-name-link
  let productnamelink = document.querySelectorAll('.product-name-link');
  productnamelink.forEach((item) => {
    item.onclick = () => {
      localStorage.setItem('productid', item.getAttribute('productid'));
      location.reload();
    };
  });
}

setTimeout(() => {
  // GET WISHLIST (LOCAL STORAGE)
  function getWishlist() {
    let data = new FormData();
    data.append('userid', localStorage.getItem('userid'));
    axios
      .post('http://localhost/be/Wishlist/list.php', data)
      .then((e) => e.data)
      .then((e) => {
        localStorage.setItem('wishlist', e);
      });
  }
  // RenderCategories()
  RenderBestSale();
  getWishlist();
  getDataFromServer();
  setTimeout(() => {
    addDOMEvent();
  }, 1000);
}, 1000);
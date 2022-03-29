export function multiPageItems(itemElement, limitSize) {
  const itemList = Array.from(document.querySelectorAll(itemElement));
  const nextPage = document.querySelector('.next');
  const prevPage = document.querySelector('.prev');
  let slice = [0, limitSize];
  let paginationNumbers = Math.ceil(itemList.length / limitSize);
  document.querySelector('.pagination').innerHTML = '';
  if (paginationNumbers === 1) {
    document.querySelector('.pagination-mode').style.display = 'none';
  } else {
    document.querySelector('.pagination-mode').style.display = 'flex';
    for (let i = 1; i <= paginationNumbers; i++) {
      document.querySelector('.pagination').innerHTML += `<span>${i}</span>`;
    }
  }
  itemList.slice(0, limitSize).forEach((item) => (item.style.display = 'flex'));
  itemList
    .slice(limitSize, itemList.length)
    .forEach((item) => (item.style.display = 'none'));

  nextPage.addEventListener('click', () => {
    if (slice[1] < itemList.length) {
      slice = slice.map((num) => num + limitSize);
    }
    showSlice(slice);
    window.scrollTo({
      top: 100,
      behavior: 'smooth',
    });
  });

  prevPage.addEventListener('click', () => {
    if (slice[0] > 0) {
      slice = slice.map((num) => num - limitSize);
    }
    showSlice(slice);
    window.scrollTo({
      top: 100,
      behavior: 'smooth',
    });
  });

  function showSlice(slice) {
    itemList.forEach((item) => (item.style.display = 'none'));
    itemList
      .slice(slice[0], slice[1])
      .forEach((item) => (item.style.display = 'flex'));
  }
}

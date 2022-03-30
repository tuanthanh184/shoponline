export function pagination(itemElementDOM, limitSize) {
  const eleDOM = Array.from(document.querySelectorAll(itemElementDOM));
  const nextPage = document.querySelector('.next');
  const prevPage = document.querySelector('.prev');
  let slice = [0, limitSize];
  eleDOM.slice(0, limitSize).forEach((item) => (item.style.display = 'flex'));
  eleDOM
    .slice(limitSize, eleDOM.length)
    .forEach((item) => (item.style.display = 'none'));

  nextPage.addEventListener('click', () => {
    if (slice[1] < eleDOM.length) {
      slice = slice.map((num) => num + limitSize);
      console.log(slice);
    }
    showSlice(slice);
    window.scrollTo({
      top: 250,
      behavior: 'smooth',
    });
  });

  prevPage.addEventListener('click', () => {
    if (slice[0] > 0) {
      slice = slice.map((num) => num - limitSize);
    }
    showSlice(slice);
    window.scrollTo({
      top: 250,
      behavior: 'smooth',
    });
  });

  function showSlice(slice) {
    eleDOM.forEach((item) => (item.style.display = 'none'));
    eleDOM
      .slice(slice[0], slice[1])
      .forEach((item) => (item.style.display = 'flex'));
  }

  // Pagination Number
  let paginationNumbers = Math.ceil(eleDOM.length / limitSize);
  document.querySelector('.pagination').innerHTML = '';
  if (paginationNumbers === 1) {
    document.querySelector('.pagination-mode').style.display = 'none';
  } else {
    document.querySelector('.pagination-mode').style.display = 'flex';
    for (let i = 1; i <= paginationNumbers; i++) {
      document.querySelector('.pagination').innerHTML += `<span>${i}</span>`;
    }
  }

  // Render Products by Click Number
  const numSpans = document.querySelectorAll('.pagination span');
  numSpans.forEach((numSpan) => {
    numSpan.addEventListener('click', (e) => {
      let numSelected = parseInt(e.target.innerText);
      showSlice([(numSelected - 1) * limitSize, numSelected * limitSize]);
      window.scrollTo({
        top: 250,
        behavior: 'smooth',
      });
    });
  });
}

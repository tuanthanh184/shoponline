export function componentHTML() {
  fetch('./layout/header.html')
    .then((rs) => rs.text())
    .then((data) => {
      document.querySelector('header').innerHTML = data;
    });

  fetch('./layout/footer.html')
    .then((rs) => rs.text())
    .then((data) => {
      document.querySelector('footer').innerHTML = data;
    });
}

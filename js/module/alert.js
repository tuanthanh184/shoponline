export function alertMess(status) {
  let dom = document.querySelector('#alert-all-message');
  dom.style.animationName = 'showup';
  dom.onclick = () => {
    dom.style.animationName = 'showoff';
  };
  if (status == 201) {
    dom.style.borderColor = '#04aa6d';
    dom.style.color = '#04aa6d';
    dom.innerHTML = 'Add success!';
  } else {
    dom.style.borderColor = '#e60023';
    dom.style.color = '#e60023';
    dom.innerHTML = 'Error!';
  }
  setTimeout(() => {
    dom.style.animationName = 'showoff';
  }, 4000);
}

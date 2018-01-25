
// Aside menu

const asideMenu = document.querySelectorAll('.aside ul');
function setActiveClass (event) {
  event.target.classList.remove('active');
  event.target.classList.add('active');
}

asideMenu[0].onclick = setActiveClass;
asideMenu[1].onclick = setActiveClass;

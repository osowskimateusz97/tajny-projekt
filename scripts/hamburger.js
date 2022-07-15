const hamburger = document.querySelector('svg[data-type="hamburger"]');
const navContainer = document.querySelector(
  'nav[data-type="navigation-container"]'
);
const toggleMenuVisibility = () => {
  navContainer.classList.toggle("mobile-hidden");
  document.body.classList.toggle("body-overflow");
};

hamburger.addEventListener("click", toggleMenuVisibility);

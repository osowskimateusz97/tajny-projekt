const hamburger = document.querySelector('svg[data-type="hamburger"]');
const navContainer = document.querySelector(
  'nav[data-type="navigation-container"]'
);
const toggleMenuVisibility = () => {
  navContainer.classList.toggle("mobile-hidden");
};

hamburger.addEventListener("click", toggleMenuVisibility);

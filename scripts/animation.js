function init() {
  //toggle hamburger
  function initHamburger(container) {
    const hamburger = container.querySelector('svg[data-type="hamburger"]');
    const navContainer = container.querySelector(
      'nav[data-type="navigation-container"]'
    );
    const toggleMenuVisibility = () => {
      navContainer.classList.toggle("mobile-hidden");
      document.body.classList.toggle("body-overflow");
    };

    hamburger.addEventListener("click", toggleMenuVisibility);
  }

  const loader = document.querySelector(".loader");

  // reset position of the loading screen
  gsap.set(loader, {
    scaleX: 0,
    rotation: 10,
    xPercent: -5,
    yPercent: -50,
    transformOrigin: "left center",
    autoAlpha: 1,
  });

  function loaderIn() {
    // GSAP tween to stretch the loading screen across the whole screen
    return gsap.fromTo(
      loader,
      {
        rotation: 10,
        scaleX: 0,
        xPercent: -5,
      },
      {
        duration: 0.7,
        xPercent: 0,
        scaleX: 1,
        rotation: 0,
        ease: "Power4.inOut",
        transformOrigin: "left center",
      }
    );
  }

  function loaderAway() {
    // GSAP tween to hide the loading screen
    return gsap.to(loader, {
      duration: 0.7,
      scaleX: 0,
      xPercent: 5,
      rotation: -10,
      transformOrigin: "right center",
      ease: "Power4.inOut",
    });
  }

  // do something before the transition starts
  barba.hooks.before(() => {
    document.querySelector("html").classList.add("is-transitioning");
    barba.wrapper.classList.add("is-animating");
  });

  // do something after the transition finishes
  barba.hooks.after(() => {
    document.querySelector("html").classList.remove("is-transitioning");
    barba.wrapper.classList.remove("is-animating");

    if (MicroModal) {
      initModal();
    }
  });

  // scroll to the top of the page
  barba.hooks.enter(() => {
    window.scrollTo(0, 0);
  });

  var links = document.querySelectorAll("a[href]");
  var cbk = function (e) {
    if (e.currentTarget.href === window.location.href) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", cbk);
  }

  barba.init({
    preventRunning: true,
    prevent: ({ el }) => el.dataset && el.dataset?.fslightbox,
    transitions: [
      {
        leave({ current }) {
          const done = this.async();
          const container = current.container;
          const navContainer = container.querySelector(
            ".navigation__container"
          );
          const isMobile = window.innerWidth <= 1025;

          if (isMobile) gsap.to(navContainer, { x: "-100%", duration: 0.2 });
          loaderIn();
          setTimeout(function () {
            done();
          }, 800);
        },
        enter({ next }) {
          const container = next.container;
          loaderAway();
          initHamburger(container);
          setTimeout(function () {
            showAnimation(next, container);
          }, 0);
        },
        once({ next }) {
          const container = next.container;
          initHamburger(container);

          setTimeout(function () {
            showAnimation(next, container);
          }, 0);
          if (MicroModal) {
            initModal();
          }
        },
        afterLeave() {
          document.body.classList.remove("body-overflow");
        },
        after(data) {
          if (data.next.namespace === "clinic") {
            refreshFsLightbox();
          }
        },
      },
    ],
  });
}

window.addEventListener("load", function () {
  init();
});

// ********** GSAP ANIMATION **********
gsap.registerPlugin(ScrollTrigger);

function showAnimation(next, container) {
  if (window.innerWidth <= 768) return;
  switch (next.namespace) {
    case "home":
      return homeAnimation(container);
    default:
      return;
  }
}

function homeAnimation(container) {
  const heroImgs = container.querySelectorAll(".hero > a");
  // HERO ANIMATION
  gsap.set(heroImgs, { transformOrigin: "top", opacity: 0 });

  ScrollTrigger.batch(heroImgs, {
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          duration: 0.75,
          ease: "power3.out",
        }
      ),
    start: "30% bottom",
  });

  // SERVICES ANIMATION

  const boxes = container.querySelectorAll(".services .card");

  gsap.set(boxes, { opacity: 0 });

  ScrollTrigger.batch(boxes, {
    onEnter: (batch) =>
      gsap.fromTo(batch, { x: 30 }, { x: 0, autoAlpha: 1, stagger: 0.1 }),
    start: "30% bottom",
    once: true,
  });

  // ABOUT US ANIMATION

  const tlAboutUs = gsap.timeline({
    scrollTrigger: {
      trigger: ".aboutUs",
      once: true,
      start: "-40%",
    },
    defaults: {
      duration: 0.75,
      ease: "power3.out",
    },
  });

  tlAboutUs.fromTo(
    ".aboutUs__imgContainer",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1 }
  );

  tlAboutUs.fromTo(
    ".aboutUs__info",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1 }
  );
}

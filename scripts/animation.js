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
        async leave({ current }) {
          const container = current.container;
          const navContainer = container.querySelector(
            ".navigation__container"
          );
          const isMobile = window.innerWidth <= 1025;

          if (isMobile)
            await gsap.to(navContainer, { x: "-100%", duration: 0.2 });
          await loaderIn();
        },
        enter({ next }) {
          const container = next.container;
          loaderAway();
          initHamburger(container);
        },
        once({ next }) {
          const container = next.container;
          initHamburger(container);
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

const tlAboutUs = gsap.timeline({
  scrollTrigger: {
    trigger: ".aboutUs",
    once: true,
    markers: true,
    start: "-30%",
  },
  defaults: {
    duration: 0.75,
  },
});

tlAboutUs.fromTo(
  ".aboutUs__imgContainer",
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1 }
);

tlAboutUs.fromTo(".aboutUs__info", { y: 50, opacity: 0 }, { y: 0, opacity: 1 });

// observer testing
const boxes = document.querySelectorAll(".services .card");

const config = {
  threshold: 0.5,
};

const tlServices = gsap.timeline({
  defaults: {
    duration: 0.75,
    ease: "elastic.out(1, 0.5)",
  },
});

gsap.set(boxes, { opacity: 0 });

ScrollTrigger.batch(".services .card", {
  // interval: 0.1, // time window (in seconds) for batching to occur.
  // batchMax: 3,   // maximum batch size (targets)
  onEnter: (batch) =>
    gsap.fromTo(batch, { x: 30 }, { x: 0, autoAlpha: 1, stagger: 0.1 }),
  // also onLeave, onEnterBack, and onLeaveBack
  // also most normal ScrollTrigger values like start, end, etc.
  start: "30% bottom",
});

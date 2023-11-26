class Carousel {
  nodeType = {
    video: "VIDEO",
    img: "IMG",
  };
  isVoiceOn = false;
  constructor(container) {
    this.container = container;
    this.setup();
  }

  setup() {
    this.setActiveElements();
    this.createDots();
    this.addListeners();
  }
  setActiveElements() {
    this.activeContainer = this.container.querySelector(
      ".carousel__container--active"
    );
    this.activeElement = this.container.querySelector(
      ".carousel__element--active"
    );
  }
  createDots() {
    const dotWrapper = this.container.querySelector(
      ".carousel__circle-wrapper"
    );
    this.getAllCarouselElements().forEach((_, i) => {
      const dot = document.createElement("div");
      const isFirst = i === 0;
      dot.classList = `carousel__circle ${
        isFirst ? "carousel__circle--active" : ""
      }`;

      dot.setAttribute("data-index", i);
      dotWrapper.appendChild(dot);
    });
  }

  addListeners() {
    const circleWrapper = this.container.querySelector(
      ".carousel__circle-wrapper"
    );
    if (circleWrapper) {
      circleWrapper.addEventListener("click", (e) => this.handleDotClick(e));
    }
    const controllers = [
      ...this.container.querySelectorAll(".carousel__controller"),
    ];
    if (controllers) {
      controllers.forEach((controller) => {
        controller.addEventListener("click", (e) => {
          this.handleManageVoiceClick(e, controllers);
          this.handleVoiceIconClick(e, controllers);
        });
      });
    }
  }

  handleManageVoiceClick(e) {
    const btnTypeId = e.currentTarget.dataset.id;
    console.log(btnTypeId);
    if (btnTypeId === "pause") {
      this.activeElement.muted = false;
      this.isVoiceOn = true;
      return;
    }
    this.activeElement.muted = true;
    this.isVoiceOn = false;
  }

  handleVoiceIconClick(e, controllers) {
    const btnTypeId = e.currentTarget.dataset.id;
    controllers.forEach((controller) => {
      const id = controller.dataset.id;
      if (id !== btnTypeId) {
        controller.classList.add("carousel__controller--active");
        return;
      }
      controller.classList.remove("carousel__controller--active");
    });
  }

  handleDotClick(e) {
    const index = e.target.dataset.index;
    const allElements = this.getAllCarouselElements();
    if (index !== undefined) {
      const container = allElements[index];
      const element = container.querySelector(".carousel__element");
      this.switchDot(index);
      clearTimeout(this.imgIndex);
      clearTimeout(this.videoIndex);
      this.runSpecificCarouselElement(container, element);
    }
  }

  isVideo(el) {
    return el.nodeName === this.nodeType.video;
  }

  isImg(el) {
    return el.nodeName === this.nodeType.img;
  }

  getAllCarouselElements() {
    return [...this.container.querySelectorAll(".carousel__container")];
  }
  getIndexOfActiveElement() {
    const allElements = this.getAllCarouselElements();
    const currentIndex = allElements.findIndex((el) => {
      return el.classList.contains("carousel__container--active");
    });
    return currentIndex;
  }
  getNextElements() {
    const allElements = this.getAllCarouselElements();
    const currentIndex = this.getIndexOfActiveElement();
    const nextIdx = (currentIndex + 1) % allElements.length;
    const nextContainer = allElements[nextIdx];
    this.switchDot(nextIdx);
    const nextElement = nextContainer.querySelector(".carousel__element");
    return {
      nextContainer,
      nextElement,
    };
  }

  runMovie() {
    this.activeElement.currentTime = 0;
    this.activeElement.play();
    if (this.isVoiceOn) {
      this.activeElement.muted = false;
    } else {
      this.activeElement.muted = true;
    }
    const activeElDuration = this.activeElement.duration * 1000;
    this.videoIndex = setTimeout(() => {
      this.next();
    }, activeElDuration);
  }
  runImg() {
    this.imgIndex = setTimeout(() => {
      this.next();
    }, 5000);
  }

  start() {
    if (this.isImg(this.activeElement)) this.runImg();
    if (this.isVideo(this.activeElement)) this.runMovie();
  }

  next() {
    const { nextContainer, nextElement } = this.getNextElements();
    this.runSpecificCarouselElement(nextContainer, nextElement);
  }
  switchDot(nextIdx) {
    const activeDotClass = "carousel__circle--active";
    const dots = [...this.container.querySelectorAll(".carousel__circle")];
    const prevIdx = dots.findIndex((dot) =>
      dot.classList.contains("carousel__circle--active")
    );
    dots[prevIdx].classList.remove(activeDotClass);
    dots[nextIdx].classList.add(activeDotClass);
  }
  runSpecificCarouselElement(nextContainer, nextElement) {
    this.activeContainer.classList.remove("carousel__container--active");
    this.activeElement.classList.remove("carousel__element--active");
    nextContainer.classList.add("carousel__container--active");
    nextElement.classList.add("carousel__element--active");
    if (this.isVideo(this.activeElement)) {
      this.activeElement.pause();
    }
    this.activeContainer = nextContainer;
    this.activeElement = nextElement;
    this.start();
  }
}

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

    if (typeof MicroModal !== "undefined") {
      initModal();
    }
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
    // debug: true,
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
          injectWidget();
          initHamburger(container);
          const carouselDiv = container.querySelector(".carousel");
          if (carouselDiv) {
            const carousel = new Carousel(container);
            carousel.start();
          }
          setTimeout(function () {
            showAnimation(next, container);
          }, 0);
        },
        once({ next }) {
          const container = next.container;
          initHamburger(container);
          homeAnimation(container);
          const carouselDiv = container.querySelector(".carousel");
          if (carouselDiv) {
            const carousel = new Carousel(container);
            carousel.start();
          }
          if (typeof MicroModal !== "undefined") {
            initModal();
          }
        },
        afterLeave() {
          document.body.classList.remove("body-overflow");
          destroyWidget();
        },
        after(data) {
          refreshFsLightbox();
        },
      },
    ],
  });
  history.scrollRestoration = "manual";
  var scrollPosY = [0];

  barba.hooks.enter((data) => {
    if (data.trigger !== "back") {
      scrollPosY.push(barba.history.current.scroll.y);
    }
  });

  barba.hooks.after((data) => {
    if (data.trigger !== "back") {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, scrollPosY.pop());
    }
  });
}
// ZNANY LEKARZ - WIDGET
function injectWidget() {
  !(function ($_x, _s, id) {
    var js,
      fjs = $_x.getElementsByTagName(_s)[0];
    if (!$_x.getElementById(id)) {
      js = $_x.createElement(_s);
      js.id = id;
      js.setAttribute("data-widget-id", "znany-lekarz");
      js.src = "//platform.docplanner.com/js/widget.js";
      fjs.parentNode.insertBefore(js, fjs);
    }
  })(document, "script", "zl-widget-s");
}

function destroyWidget() {
  const widget = document.querySelector(
    'script[data-widget-id="znany-lekarz"]'
  );
  if (widget) {
    widget.remove(widget);
  }
}

window.addEventListener("load", function () {
  init();
});

// ********** GSAP ANIMATION **********
gsap.registerPlugin(ScrollTrigger);

function showAnimation(next, container) {
  console.log(next.namespace);
  if (window.innerWidth <= 768) return;
  switch (next.namespace) {
    case "home":
      return homeAnimation(container);
    default:
      return;
  }
}

function homeAnimation(container) {
  const heroImgs = container.querySelectorAll(".hero > a:not(.no-anim)");
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
    once: true,
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

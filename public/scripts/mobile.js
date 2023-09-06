const hamburgerElement = document.getElementById("hamburger");
const navElement = document.querySelector("#main-header ul");

function disableScroll() {
  // Get the current page scroll position
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  (scrollLeft = window.pageXOffset || document.documentElement.scrollLeft),
    // if any scroll is attempted, set this to the previous value
    (window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    });
}

function enableScroll() {
  window.onscroll = function () {};
}

const showNav = () => {
  console.log("clicked");
  navElement.classList.toggle("open");

  if (navElement.classList.contains("open")) {
    disableScroll();
  } else {
    enableScroll();
  }
};

hamburgerElement.addEventListener("click", showNav);

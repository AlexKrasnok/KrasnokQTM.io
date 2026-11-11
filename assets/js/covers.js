(function () {
  var root = document.querySelector("[data-slideshow]");
  if (!root) return;
  var slides = [].slice.call(root.querySelectorAll(".slide"));
  var n = slides.length;
  if (n < 2) return;
  var list = root.querySelector(".slides");
  var btnPause = root.querySelector("[data-pause]");
  var btnPrev = root.querySelector("[data-prev]");
  var btnNext = root.querySelector("[data-next]");
  var counter = root.querySelector("[data-counter]");
  var interval = parseInt(root.getAttribute("data-interval") || "7000", 10);
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0, timer = null, userPaused = reduce, hover = false, focus = false, visible = true;
  root.classList.add("is-enhanced");

  function hydrate(slide) {
    [].forEach.call(slide.querySelectorAll("[data-srcset]"), function (e) {
      e.setAttribute("srcset", e.getAttribute("data-srcset"));
      e.removeAttribute("data-srcset");
    });
    [].forEach.call(slide.querySelectorAll("img[data-src]"), function (e) {
      e.setAttribute("src", e.getAttribute("data-src"));
      e.removeAttribute("data-src");
    });
  }
  function show(k, byUser) {
    k = (k + n) % n;
    slides[index].classList.remove("is-active");
    slides[index].setAttribute("aria-hidden", "true");
    index = k;
    hydrate(slides[index]);
    slides[index].classList.add("is-active");
    slides[index].removeAttribute("aria-hidden");
    hydrate(slides[(index + 1) % n]);
    counter.textContent = (index + 1) + " / " + n;
    list.setAttribute("aria-live", byUser ? "polite" : "off");
  }
  function running() { return !userPaused && !hover && !focus && visible && !document.hidden; }
  function schedule() {
    clearTimeout(timer);
    if (running()) timer = setTimeout(function () { show(index + 1, false); schedule(); }, interval);
  }
  function setPauseLabel() {
    btnPause.textContent = userPaused ? "Play" : "Pause";
    btnPause.setAttribute("aria-label", (userPaused ? "Start" : "Stop") + " automatic cover changes");
  }
  btnNext.addEventListener("click", function () { show(index + 1, true); schedule(); });
  btnPrev.addEventListener("click", function () { show(index - 1, true); schedule(); });
  btnPause.addEventListener("click", function () { userPaused = !userPaused; setPauseLabel(); schedule(); });
  root.addEventListener("mouseenter", function () { hover = true; schedule(); });
  root.addEventListener("mouseleave", function () { hover = false; schedule(); });
  root.addEventListener("focusin", function () { focus = true; schedule(); });
  root.addEventListener("focusout", function (ev) { if (!root.contains(ev.relatedTarget)) { focus = false; schedule(); } });
  document.addEventListener("visibilitychange", schedule);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.3 }).observe(root);
  }
  slides.forEach(function (s, k) { if (k) s.setAttribute("aria-hidden", "true"); });
  setPauseLabel();
  show(0, false);
  schedule();
})();

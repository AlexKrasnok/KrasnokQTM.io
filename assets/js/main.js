document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-navigation");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function revealLinkedPublication() {
  let id;
  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return;
  }
  const target = id && document.getElementById(id);
  if (!target) return;
  let parent = target.parentElement;
  let expanded = false;
  while (parent) {
    if (parent instanceof HTMLDetailsElement && !parent.open) {
      parent.open = true;
      expanded = true;
    }
    parent = parent.parentElement;
  }
  if (expanded) target.scrollIntoView({ block: "start" });
}

window.addEventListener("hashchange", revealLinkedPublication);
revealLinkedPublication();

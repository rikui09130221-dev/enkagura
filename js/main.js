"use strict";

document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const navigationLinks = navigation?.querySelectorAll("a") ?? [];
const mobileBreakpoint = window.matchMedia("(max-width: 900px)");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function setMenuState(isOpen, { returnFocus = false } = {}) {
  if (!menuToggle || !navigation) return;

  document.body.classList.toggle("nav-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");

  if (mobileBreakpoint.matches) {
    navigation.setAttribute("aria-hidden", String(!isOpen));
    navigation.inert = !isOpen;
  } else {
    navigation.removeAttribute("aria-hidden");
    navigation.inert = false;
  }

  if (isOpen) {
    navigation.querySelector("a")?.focus();
  } else if (returnFocus) {
    menuToggle.focus();
  }
}

function handleBreakpointChange(event) {
  if (event.matches) {
    setMenuState(false);
  } else {
    document.body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "メニューを開く");
    navigation?.removeAttribute("aria-hidden");
    if (navigation) navigation.inert = false;
  }
}

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenuState(willOpen, { returnFocus: !willOpen });
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
    setMenuState(false, { returnFocus: true });
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
mobileBreakpoint.addEventListener("change", handleBreakpointChange);
updateHeader();
handleBreakpointChange(mobileBreakpoint);

const revealTargets = document.querySelectorAll("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8%",
      threshold: 0.08,
    },
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

const faqItems = document.querySelectorAll(".faq-list details");

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const yearTarget = document.querySelector("[data-current-year]");
if (yearTarget) yearTarget.textContent = String(new Date().getFullYear());

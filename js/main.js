document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenuPanel = document.getElementById("mobileMenuPanel");

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenuPanel) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenuPanel.classList.toggle("hidden");
    });

    mobileMenuPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuPanel.classList.add("hidden");
      });
    });
  }

  // Active nav link highlighting
  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll(
    "a.nav-link, a.mobile-nav-link, footer a"
  );

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http")) return;

    const linkPath = normalizePath(new URL(href, window.location.origin).pathname);
    const isActive =
      linkPath === currentPath ||
      (currentPath === "/" && linkPath === "/index.html");

    if (isActive) {
      link.classList.add("active");
      if (link.classList.contains("mobile-nav-link")) {
        link.classList.add("text-[#2c5e2f]", "font-semibold");
      }
    }
  });

  // FAQ accordion
  initFaqAccordion();
});

function normalizePath(path) {
  if (!path) return "/";
  const cleanPath = path.replace(/\/+$/, "");
  return cleanPath === "" ? "/" : cleanPath;
}

function initFaqAccordion() {
  const faqButtons = document.querySelectorAll(".faq-question-btn");
  if (!faqButtons.length) return;

  faqButtons.forEach((button) => {
    const panel = button.nextElementSibling;
    if (!panel) return;

    panel.style.maxHeight = "0px";
    panel.style.borderTopColor = "transparent";
  });

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.nextElementSibling;
      const icon = button.querySelector(".faq-icon");
      if (!panel) return;

      const isOpen = panel.style.maxHeight && panel.style.maxHeight !== "0px";

      faqButtons.forEach((otherButton) => {
        if (otherButton === button) return;
        const otherPanel = otherButton.nextElementSibling;
        const otherIcon = otherButton.querySelector(".faq-icon");
        if (!otherPanel) return;

        otherPanel.style.maxHeight = "0px";
        otherPanel.style.borderTopColor = "transparent";
        if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
      });

      if (isOpen) {
        panel.style.maxHeight = "0px";
        panel.style.borderTopColor = "transparent";
        if (icon) icon.style.transform = "rotate(0deg)";
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.style.borderTopColor = "#ede6dd";
        if (icon) icon.style.transform = "rotate(180deg)";
      }
    });
  });
}
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

  // Homepage customer feedback carousel
  initReviewCarousel();
  initReviewListing();
});

// These 10 entries are fictional preview examples. They are visible only on file:// and localhost previews.
// For real reviews, replace the example content, set isExample: false and published: true after approval.
// Product images are illustrative product photos, not customer photos. Leave date blank unless verified.
const reviewEntries =const reviewEntries = [
  { name: "Adv Suhail Shekason", product: "Ultimate Combo Pack", image: "images/products/one.jpg", description: "", rating: 5, date: "", feedback: "", published: true, isExample: false },
  { name: "Shumaiza khan", product: "Ultimate Combo Pack", image: "images/products/two.jpg", description: "", rating: 4, date: "", feedback: "", published: true, isExample: false },
  { name: "Aiman Shaikh", product: "Herbal Hair Oil, 100 ml", image: "images/products/three.jpg", description: "", rating: 5, date: "", feedback: "", published: true, isExample: false },
  { name: "Khlida", product: "Herbal Hair Oil, 100 ml", image: "images/products/four.jpg", description: "", rating: 4, date: "", feedback: "", published: true, isExample: false },
  { name: "Gunchan", product: "Ultimate Combo Pack", image: "images/products/five.jpg", description: "", rating: 5, date: "", feedback: "", published: true, isExample: false },
  { name: "Rizwana ", product: "2X Hair Care Combo", image: "images/products/six.jpg", description: "", rating: 5, date: "", feedback: "", published: true, isExample: false },
  { name: "Sajiya parween", product: "Ultimate Combo Pack", image: "images/products/seven.jpg", description: "", rating: 4, date: "", feedback: "", published: true, isExample: false },
  { name: "Muhammad Osama", product: "2X Hair Care Combo", image: "images/products/eight.jpg", description: "", rating: 5, date: "", feedback: "", published: true, isExample: false },
  { name: "Rashmi", product: "2X Hair Care Combo", image: "images/products/nine.jpg", description: "", rating: 4, date: "", feedback: "", published: true, isExample: false },
  { name: "Abhilasha Mhatre", product: "Ultimate Combo Pack", image: "images/products/ten.jpg", description: "", rating: 5, date: "", feedback: "", published: true, isExample: false }
];

function isLocalReviewPreview() {
  return window.location.protocol === "file:" ||
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function isCompleteReview(review) {
  return typeof review.name === "string" && review.name.trim() &&
    typeof review.product === "string" && review.product.trim() &&
    typeof review.image === "string" && review.image.trim() &&
    Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 &&
    typeof review.feedback === "string" && review.feedback.trim();
}

function getReviewsForDisplay() {
  const examples = reviewEntries.filter((review) => review.isExample === true && isCompleteReview(review));
  const genuineReviews = reviewEntries.filter((review) =>
    review.isExample !== true && review.published === true && isCompleteReview(review)
  );
  return {
    examples: isLocalReviewPreview() ? examples : [],
    genuineReviews
  };
}

function buildReviewCard(review) {
  const card = document.createElement("article");
  card.className = "review-slide";
  card.setAttribute("role", "group");
  card.setAttribute("aria-roledescription", "slide");
  card.setAttribute("aria-label", `${review.name}, ${review.product}`);

  const media = document.createElement("div");
  media.className = "review-slide-media";

  const image = document.createElement("img");
  image.className = "review-slide-image";
  image.src = review.image;
  image.alt = `Product photo for ${review.product}; not a customer photo`;
  image.loading = "lazy";
  media.appendChild(image);

  const content = document.createElement("div");
  content.className = "review-slide-content";

  const product = document.createElement("p");
  product.className = "review-slide-product";
  product.textContent = review.product;

  const name = document.createElement("h3");
  name.className = "text-xl font-serif font-bold mt-2";
  name.textContent = review.name;

  const meta = document.createElement("div");
  meta.className = "review-slide-meta";
  const stars = document.createElement("span");
  stars.className = "review-slide-stars";
  stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
  stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  meta.appendChild(stars);
  if (typeof review.date === "string" && review.date.trim()) {
    const date = document.createElement("time");
    date.textContent = review.date;
    meta.appendChild(date);
  }

  const feedback = document.createElement("p");
  feedback.className = "review-slide-feedback";
  feedback.textContent = review.feedback;

  content.append(product, name, meta, feedback);
  card.append(media, content);
  return card;
}

function initReviewCarousel() {
  const section = document.querySelector("[data-customer-feedback]");
  const carousel = document.querySelector("[data-review-carousel]");
  if (!section || !carousel) return;

  const { examples, genuineReviews } = getReviewsForDisplay();
  const displayedReviews = [...genuineReviews, ...examples];
  if (!displayedReviews.length) return;

  const viewport = carousel.querySelector("[data-review-viewport]");
  const track = carousel.querySelector("[data-review-track]");
  const dots = carousel.querySelector("[data-review-dots]");
  const previousButton = carousel.querySelector("[data-review-prev]");
  const nextButton = carousel.querySelector("[data-review-next]");
  if (!viewport || !track || !dots || !previousButton || !nextButton) return;

  let currentIndex = 0;
  let visibleCount = getReviewVisibleCount();
  let touchStartX = null;

  displayedReviews.forEach((review) => {
    track.appendChild(buildReviewCard(review));
  });
  section.hidden = false;

  function getReviewVisibleCount() {
    if (window.matchMedia("(min-width: 1024px)").matches) return 3;
    if (window.matchMedia("(min-width: 768px)").matches) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, displayedReviews.length - visibleCount);
  }

  function renderDots() {
    dots.innerHTML = "";
    for (let index = 0; index <= getMaxIndex(); index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "review-dot";
      dot.setAttribute("aria-label", `Show review position ${index + 1}`);
      dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
      });
      dots.appendChild(dot);
    }
  }

  function updateCarousel() {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    const slide = track.querySelector(".review-slide");
    if (!slide) return;
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
    const step = slide.getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${currentIndex * step}px)`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === getMaxIndex();
    dots.querySelectorAll(".review-dot").forEach((dot, index) => {
      dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
    });
  }

  previousButton.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
    updateCarousel();
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousButton.click();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      nextButton.click();
    }
  });

  viewport.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 45) {
      (deltaX < 0 ? nextButton : previousButton).click();
    }
    touchStartX = null;
  }, { passive: true });

  function handleResize() {
    const nextVisibleCount = getReviewVisibleCount();
    if (nextVisibleCount !== visibleCount) {
      visibleCount = nextVisibleCount;
      renderDots();
    }
    updateCarousel();
  }

  window.addEventListener("resize", handleResize);
  renderDots();
  updateCarousel();
}

function initReviewListing() {
  const list = document.querySelector("[data-review-list]");
  if (!list) return;

  const { examples, genuineReviews } = getReviewsForDisplay();
  const displayedReviews = [...genuineReviews, ...examples];
  const section = document.querySelector("[data-review-list-section]");
  const emptyState = document.querySelector("[data-review-empty]");
  if (!displayedReviews.length) return;

  displayedReviews.forEach((review) => {
    const card = buildReviewCard(review);
    card.removeAttribute("role");
    card.removeAttribute("aria-roledescription");
    card.removeAttribute("aria-label");
    list.appendChild(card);
  });
  if (emptyState) emptyState.hidden = true;
  if (section) section.hidden = false;
}

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

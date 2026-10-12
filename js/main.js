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
const reviewEntries = [
  { name: "Maya Iyer", product: "Herbal Hair Oil, 100 ml", image: "images/products/oil.webp", rating: 5, date: "", feedback: "The bottle arrived neatly packed, and the oil has a light texture that spreads easily through my hair. The applicator makes it simple to use without making a mess.", published: false, isExample: true },
  { name: "Kabir Desai", product: "Herbal Shampoo, 100 ml", image: "images/products/shampoo.webp", rating: 4, date: "", feedback: "The compact bottle fits neatly on my shower shelf. The shampoo lathers easily, rinses out without fuss, and the packaging feels sturdy enough to carry while travelling.", published: false, isExample: true },
  { name: "Sana Kapoor", product: "Ultimate Combo Pack", image: "images/products/combo.webp", rating: 5, date: "", feedback: "I liked being able to order the oil and shampoo together. Both bottles were packed securely, and the set makes it easy to keep my hair-care products together.", published: false, isExample: true },
  { name: "Arjun Nair", product: "Double Hair Oil Combo", image: "images/products/twooil.webp", rating: 4, date: "", feedback: "Having two oil bottles in one order is convenient for keeping a spare at home. The bottles are easy to handle, and the packaging kept them together neatly.", published: false, isExample: true },
  { name: "Leena Shah", product: "Double Shampoo Combo", image: "images/products/twoshampoo.webp", rating: 5, date: "", feedback: "The two-bottle shampoo pack is convenient for regular shopping. I can keep one bottle in the bathroom and store the other, and both arrived well packed.", published: false, isExample: true },
  { name: "Rohan Menon", product: "2X Hair Care Combo", image: "images/products/twocombo.webp", rating: 5, date: "", feedback: "Ordering two oils and two shampoos together was straightforward. The four bottles were organized in the parcel, and the bundle is handy for keeping everything in one place.", published: false, isExample: true },
  { name: "Nisha Rao", product: "Herbal Hair Oil, 100 ml", image: "images/products/oil.webp", rating: 4, date: "", feedback: "The oil bottle is a comfortable size to hold, and the product is easy to apply. I also appreciated the tidy packaging and the clear product label.", published: false, isExample: true },
  { name: "Dev Malhotra", product: "Herbal Shampoo, 100 ml", image: "images/products/shampoo.webp", rating: 5, date: "", feedback: "The shampoo bottle is simple to open and close, and its size is easy to store. I like having a familiar product format that fits my routine.", published: false, isExample: true },
  { name: "Tara Fernandes", product: "Ultimate Combo Pack", image: "images/products/combo.webp", rating: 4, date: "", feedback: "This combo is a practical way to order both products in one go. The packaging was compact, and the bottles arrived together without taking up much shelf space.", published: false, isExample: true },
  { name: "Imran Siddiqui", product: "2X Hair Care Combo", image: "images/products/twocombo.webp", rating: 5, date: "", feedback: "I like having the oil and shampoo together in a single bundle. The four bottles were packed neatly, and it was convenient to place one order for the set.", published: false, isExample: true }
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

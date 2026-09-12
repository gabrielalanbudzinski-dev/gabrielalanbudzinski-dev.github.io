// Project grid pagination: 3x3 (9 per page). Scales automatically if more
// projects are added later — page numbers and arrows are built from the
// actual card count, not hardcoded.
(function () {
  const grid = document.querySelector(".case-grid");
  const pager = document.querySelector(".case-pager");
  if (!grid || !pager) return;

  const numbersEl = pager.querySelector(".case-pager-numbers");
  const prevBtn = pager.querySelector('[data-dir="prev"]');
  const nextBtn = pager.querySelector('[data-dir="next"]');
  const cards = Array.from(grid.querySelectorAll(".case-card"));
  const perPage = 9;
  const pageCount = Math.max(1, Math.ceil(cards.length / perPage));

  if (!numbersEl || pageCount <= 1) {
    pager.style.display = "none";
    return;
  }

  // Build "01 | 02 | 03 ..." number buttons.
  numbersEl.innerHTML = "";
  const numberBtns = [];
  for (let i = 0; i < pageCount; i++) {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.className = "case-pager-sep";
      sep.textContent = "|";
      sep.setAttribute("aria-hidden", "true");
      numbersEl.appendChild(sep);
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "case-pager-btn";
    btn.textContent = String(i + 1).padStart(2, "0");
    btn.dataset.page = String(i);
    btn.setAttribute("role", "tab");
    btn.addEventListener("click", () => showPage(i));
    numbersEl.appendChild(btn);
    numberBtns.push(btn);
  }

  let currentPage = 0;

  function showPage(page, { scroll = true } = {}) {
    currentPage = Math.min(Math.max(page, 0), pageCount - 1);
    cards.forEach((card, idx) => {
      const onPage = idx >= currentPage * perPage && idx < (currentPage + 1) * perPage;
      card.style.display = onPage ? "" : "none";
    });
    numberBtns.forEach((btn, idx) => {
      const isActive = idx === currentPage;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    prevBtn.classList.toggle("disabled", currentPage === 0);
    nextBtn.classList.toggle("disabled", currentPage === pageCount - 1);
    if (scroll) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  prevBtn.addEventListener("click", () => showPage(currentPage - 1));
  nextBtn.addEventListener("click", () => showPage(currentPage + 1));

  showPage(0, { scroll: false });
})();

// Small interaction layer: reveal sections as they enter the viewport.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.08 });

document.querySelectorAll(".case-card, .exp-company, .service, .logo-panel, .about-copy, .about-photo").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

// Case study modal: clicking a project card clones its <template> into the modal.
(function () {
  const overlay = document.getElementById("caseModalOverlay");
  const content = document.getElementById("caseModalContent");
  const closeBtn = document.getElementById("caseModalClose");
  if (!overlay || !content || !closeBtn) return;

  let lastFocused = null;

  function openCase(slug) {
    const tpl = document.getElementById("case-" + slug);
    if (!tpl) return;
    content.innerHTML = "";
    content.appendChild(tpl.content.cloneNode(true));
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeCase() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    content.innerHTML = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".case-card").forEach((card) => {
    card.addEventListener("click", () => openCase(card.dataset.case));
  });

  closeBtn.addEventListener("click", closeCase);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeCase();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeCase();
  });
})();

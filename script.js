// Small interaction layer: reveal sections as they enter the viewport.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.08 });

document.querySelectorAll(".case, .exp-company, .service, .logo-panel, .about-copy, .about-photo").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

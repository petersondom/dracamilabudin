const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const formatNumber = (value) => new Intl.NumberFormat("pt-BR").format(Math.round(value));

function animateCount(element) {
  if (element.dataset.counted === "true") return;
  element.dataset.counted = "true";

  const target = Number(element.dataset.count);
  if (reduceMotion) {
    element.textContent = formatNumber(target);
    return;
  }

  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = formatNumber(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const revealTargets = document.querySelectorAll("[data-reveal], [data-stagger], [data-journey]");

const heroMedia = document.querySelector(".hero-media");
if (heroMedia) {
  heroMedia.dataset.mode = "imunologia";
  requestAnimationFrame(() => {
    heroMedia.dataset.visible = "true";
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.visible = "true";
        entry.target.querySelectorAll("[data-count]").forEach(animateCount);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => {
    target.dataset.visible = "true";
    target.querySelectorAll("[data-count]").forEach(animateCount);
  });
}


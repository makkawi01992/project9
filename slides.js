(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const currentLabel = document.getElementById("current-slide");
  const totalLabel = document.getElementById("total-slides");
  const progressBar = document.getElementById("progress-bar");
  const progressTrack = document.querySelector(".progress-track");
  const previousButton = document.getElementById("previous-slide");
  const nextButton = document.getElementById("next-slide");
  const jumpButtons = Array.from(document.querySelectorAll("[data-slide]"));

  if (
    slides.length === 0 ||
    !(currentLabel instanceof HTMLElement) ||
    !(totalLabel instanceof HTMLElement) ||
    !(progressBar instanceof HTMLElement) ||
    !(progressTrack instanceof HTMLElement) ||
    !(previousButton instanceof HTMLButtonElement) ||
    !(nextButton instanceof HTMLButtonElement)
  ) {
    throw new Error("تعذر تهيئة العرض: تحقق من عناصر الشرائح والتنقل في index.html.");
  }

  let currentIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));

  const update = () => {
    slides.forEach((slide, index) => {
      const active = index === currentIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    currentLabel.textContent = String(currentIndex + 1);
    totalLabel.textContent = String(slides.length);
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;

    const progress = (currentIndex + 1) / slides.length;
    progressBar.style.transform = `scaleX(${progress})`;
    progressTrack.setAttribute("aria-valuemax", String(slides.length));
    progressTrack.setAttribute("aria-valuenow", String(currentIndex + 1));
  };

  const goTo = (index) => {
    if (index < 0 || index >= slides.length || index === currentIndex) return;
    currentIndex = index;
    update();
  };

  previousButton.addEventListener("click", () => goTo(currentIndex - 1));
  nextButton.addEventListener("click", () => goTo(currentIndex + 1));
  jumpButtons.forEach((button) => {
    button.addEventListener("click", () => goTo(Number(button.dataset.slide)));
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.target instanceof HTMLElement &&
        event.target.closest("input, textarea, select, [contenteditable='true']")
    ) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(currentIndex + 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(currentIndex - 1);
    } else if (event.code === "Space" && !event.shiftKey) {
      event.preventDefault();
      goTo(currentIndex + 1);
    } else if (event.code === "Space" && event.shiftKey) {
      event.preventDefault();
      goTo(currentIndex - 1);
    } else if (event.key === "Home") {
      goTo(0);
    } else if (event.key === "End") {
      goTo(slides.length - 1);
    }
  });

  update();
})();

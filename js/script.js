/* ============================
   FAQ
============================ */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  button.addEventListener("click", () => {
    faqItems.forEach((other) => {
      if (other !== item) {
        other.querySelector(".faq-answer").classList.remove("open");
      }
    });
    answer.classList.toggle("open");
  });
});


/* ============================
   TESTIMONIAL SLIDER
============================ */
const resultsSlider = document.getElementById("resultsSlider");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

function getCardWidth() {
  const card = resultsSlider.querySelector(".review-card");
  return card.offsetWidth + 40; // includes gap
}

nextBtn.addEventListener("click", () => {
  resultsSlider.scrollLeft += getCardWidth();
});

prevBtn.addEventListener("click", () => {
  resultsSlider.scrollLeft -= getCardWidth();
});


/* ============================
   NEW GALLERY — VISUAL DIARY DECK + SWIPE + SMOOTH MOTION
============================ */

const vgCardsContainer = document.getElementById("newGalleryCards");
const vgCards = vgCardsContainer
  ? Array.from(vgCardsContainer.querySelectorAll(".vg-card"))
  : [];

const vgPrevBtn = document.querySelector(".new-gallery-prev");
const vgNextBtn = document.querySelector(".new-gallery-next");

let currentIndex = 2; // center card
let startX = 0;
let currentX = 0;
let isDragging = false;
let dragThreshold = 40; // how far the user must swipe to trigger a slide

function updateDeck(smooth = true) {
  if (!vgCards.length) return;

  const total = vgCards.length;

  vgCards.forEach((card) =>
    card.classList.remove(
      "vg-card--center",
      "vg-card--left",
      "vg-card--right",
      "vg-card--far-left",
      "vg-card--far-right",
      "vg-card--hidden",
      "no-transition"
    )
  );

  vgCards.forEach((card, i) => {
    let diff = i - currentIndex;

    // loop around
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (!smooth) {
      card.classList.add("no-transition");
    }

    if (diff === 0) card.classList.add("vg-card--center");
    else if (diff === -1) card.classList.add("vg-card--left");
    else if (diff === 1) card.classList.add("vg-card--right");
    else if (diff === -2) card.classList.add("vg-card--far-left");
    else if (diff === 2) card.classList.add("vg-card--far-right");
    else card.classList.add("vg-card--hidden");
  });
}

function goNext() {
  currentIndex = (currentIndex + 1) % vgCards.length;
  updateDeck();
}

function goPrev() {
  currentIndex = (currentIndex - 1 + vgCards.length) % vgCards.length;
  updateDeck();
}

/* BUTTON EVENTS */
if (vgNextBtn) vgNextBtn.addEventListener("click", goNext);
if (vgPrevBtn) vgPrevBtn.addEventListener("click", goPrev);

/* ============================
   SWIPE + DRAG SUPPORT
============================ */
function onDragStart(e) {
  isDragging = true;
  startX = e.touches ? e.touches[0].clientX : e.clientX;

  // disable transitions during drag
  vgCards.forEach((card) => card.classList.add("no-transition"));
}

function onDragMove(e) {
  if (!isDragging) return;

  currentX = e.touches ? e.touches[0].clientX : e.clientX;
  let delta = currentX - startX;

  // MOVE CARDS VISUALLY WHILE DRAGGING
  vgCardsContainer.style.transform = `translateX(${delta * 0.2}px)`;
}

function onDragEnd() {
  if (!isDragging) return;
  isDragging = false;

  vgCardsContainer.style.transform = ""; // reset drag transform

  let delta = currentX - startX;

  if (Math.abs(delta) > dragThreshold) {
    // swipe left
    if (delta < 0) goNext();
    // swipe right
    else goPrev();
  } else {
    // not enough movement → snap back smoothly
    updateDeck();
  }
}

/* ENABLE EVENTS */
vgCardsContainer.addEventListener("mousedown", onDragStart);
vgCardsContainer.addEventListener("mousemove", onDragMove);
vgCardsContainer.addEventListener("mouseup", onDragEnd);
vgCardsContainer.addEventListener("mouseleave", onDragEnd);

vgCardsContainer.addEventListener("touchstart", onDragStart, { passive: true });
vgCardsContainer.addEventListener("touchmove", onDragMove, { passive: true });
vgCardsContainer.addEventListener("touchend", onDragEnd);

/* OPTIONAL: KEYBOARD */
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goNext();
  if (e.key === "ArrowLeft") goPrev();
});

/* INIT */
updateDeck();


// ABOUT 

const wrapper = document.querySelector(".story-wrapper");
const paragraphs = document.querySelectorAll(".story-paragraph");

function setActiveParagraph(index) {
    paragraphs.forEach((p, i) => {
        p.classList.toggle("active", i === index);
    });
}

function updateStoryScroll() {
    if (!wrapper || !paragraphs.length) return;

    const isMobile = window.innerWidth <= 850;

    // ----- Mobile: highlight whichever is nearest to center -----
    if (isMobile) {
        let activeIndex = 0;
        let smallestDistance = Infinity;

        paragraphs.forEach((p, i) => {
            const r = p.getBoundingClientRect();
            const center = (r.top + r.bottom) / 2;
            const distance = Math.abs(center - window.innerHeight / 2);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                activeIndex = i;
            }
        });

        setActiveParagraph(activeIndex);
        return;
    }

    // ----- Desktop Sticky Logic (slowed switching using buffer) -----
    let activeIndex = 0;
    let smallestDistance = Infinity;

    const SWITCH_BUFFER = 80;   // ⬅ Increase to slow switching more

    paragraphs.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        const center = (r.top + r.bottom) / 2;
        const distance = Math.abs(center - window.innerHeight / 2);

        // 🔥 Slow switching: the next paragraph must be MUCH closer 
        if ((distance + SWITCH_BUFFER) < smallestDistance) {
            smallestDistance = distance;
            activeIndex = i;
        }
    });

    setActiveParagraph(activeIndex);
}

window.addEventListener("scroll", updateStoryScroll);
window.addEventListener("resize", updateStoryScroll);
window.addEventListener("load", updateStoryScroll);

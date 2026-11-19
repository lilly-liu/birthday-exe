const intro = document.querySelector("#intro");
const reveal = document.querySelector("#reveal");
const yes = document.querySelector("#yes");
const no = document.querySelector("#no");
const filmstrip = document.querySelector("#filmstrip");
const dialog = document.querySelector("#photo-dialog");
const largePhoto = document.querySelector("#large-photo");

function escapeButton(event) {
  if (event.cancelable) event.preventDefault();
  const button = no.getBoundingClientRect();
  const target = yes.getBoundingClientRect();
  const margin = 12;
  const maxX = Math.max(margin, window.innerWidth - button.width - margin);
  const maxY = Math.max(margin, window.innerHeight - button.height - margin);
  let x = margin, y = margin;
  for (let attempt = 0; attempt < 40; attempt++) {
    x = margin + Math.random() * (maxX - margin);
    y = margin + Math.random() * (maxY - margin);
    const overlapsYes = x < target.right + 12 && x + button.width > target.left - 12 &&
      y < target.bottom + 12 && y + button.height > target.top - 12;
    const nearPointer = Math.hypot(x + button.width / 2 - event.clientX, y + button.height / 2 - event.clientY) < 100;
    if (!overlapsYes && !nearPointer) {
      no.classList.add("escaped");
      no.style.left = x + "px";
      no.style.top = y + "px";
      return;
    }
  }
}
no.addEventListener("pointerenter", escapeButton);
no.addEventListener("pointerdown", escapeButton);
no.addEventListener("click", escapeButton);
function resetNoButton() {
  no.classList.remove("escaped");
  no.style.removeProperty("left");
  no.style.removeProperty("top");
}
window.addEventListener("resize", resetNoButton);

yes.addEventListener("click", () => {
  intro.hidden = true;
  reveal.hidden = false;
  reveal.querySelector("h2").focus();
});

document.querySelector("#back").addEventListener("click", () => {
  reveal.hidden = true;
  resetNoButton();
  intro.hidden = false;
  intro.querySelector("h1").focus();
});

document.querySelectorAll(".reasons li").forEach((item, index) => {
  item.style.setProperty("--i", index);
});

for (let i = 1; i <= 10; i++) {
  const src = "assets/photos/" + String(i).padStart(2, "0") + ".jpg";
  const button = document.createElement("button");
  const image = document.createElement("img");
  button.setAttribute("aria-label", "View childhood photo " + i);
  image.src = src;
  image.alt = "Childhood photo " + i;
  image.loading = "lazy";
  button.append(image);
  button.addEventListener("click", () => {
    largePhoto.src = src;
    largePhoto.alt = image.alt;
    dialog.showModal();
  });
  filmstrip.append(button);
}
function scrollPhotos(direction) {
  filmstrip.scrollBy({ left: direction * filmstrip.clientWidth });
}
document.querySelector("#prev").addEventListener("click", () => scrollPhotos(-1));
document.querySelector("#next").addEventListener("click", () => scrollPhotos(1));
dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

const cat = document.querySelector("#panther").getContext("2d");
const pixels = [
  "........................",
  "........................",
  "...##.....##............",
  "...#g#...#g#............",
  "..##g#####g##...........",
  "..###########...........",
  ".#############..........",
  "..##y####y###...........",
  ".#############.......###",
  "..#####p#####.......####",
  "...##ggg###........#####",
  "..###########.....#####.",
  ".##############..#####..",
  "..###################...",
  ".###################....",
  "..#################.....",
  ".##################.....",
  "..####.####..#####......",
  ".####..####.######......",
  "........................"
];
const palette = { "#": "#24202a", g: "#62545f", y: "#b7d46b", p: "#d58b99" };
pixels.forEach((row, y) => {
  [...row].forEach((pixel, x) => {
    if (palette[pixel]) {
      cat.fillStyle = palette[pixel];
      cat.fillRect(x, y, 1, 1);
    }
  });
});

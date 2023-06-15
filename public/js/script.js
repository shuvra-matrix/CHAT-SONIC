const button = document.querySelector(".btns");
const loder = document.querySelector(".loder");
const reButton = document.querySelector(".btn");

if (reButton !== null) {
  reButton.addEventListener("click", loders);
}
button.addEventListener("click", loders);

function loders() {
  button.classList.toggle("hidden");
  loder.classList.toggle("hidden");
}

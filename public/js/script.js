const button = document.querySelector(".btns");
const loder = document.querySelector(".loder");

button.addEventListener("click", () => {
  button.classList.toggle("hidden");
  loder.classList.toggle("hidden");
});

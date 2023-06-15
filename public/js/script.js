const button = document.querySelector(".btns");
const loder = document.querySelector(".loder");
const reButton = document.querySelector(".btn");
const input = document.querySelector("input");
const question = document.querySelector(".question");
const answer = document.querySelector(".answer");
const copy = document.querySelectorAll(".copy");

if (reButton !== null) {
  reButton.addEventListener("click", loders);
}
button.addEventListener("click", loders);

function loders() {
  button.classList.toggle("hidden");
  loder.classList.toggle("hidden");

  if (question) {
    question.textContent = input.value;
    answer.innerHTML = `<div class="wrapper">
  <div class="loading-text"> <!--Loading-text-->
    <h1>Loading
      <span class="dot-one"> .</span>
      <span class="dot-two"> .</span>
      <span class="dot-three"> .</span>
       <span class="dot-four"> .</span>
        <span class="dot-five"> .</span>
         <span class="dot-six"> .</span>
    </h1>
  </div> <!--/Loading-text-->
</div> `;
  }
}

if (answer) {
  const value = answer.textContent.replaceAll("\n", "<br>");
  answer.innerHTML = value;
}

copy.forEach((e) => {
  e.addEventListener("click", (f) => {
    const text = e.parentElement.childNodes[1].textContent;
    const copyContent = async () => {
      try {
        await navigator.clipboard.writeText(text);
        console.log("Content copied to clipboard");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };
    copyContent();
  });
});

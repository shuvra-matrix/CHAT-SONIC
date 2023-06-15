const button = document.querySelector(".btns");
const loder = document.querySelector(".loder");
const reButton = document.querySelector(".btn");
const input = document.querySelector("input");
const question = document.querySelectorAll(".question");
const answer = document.querySelectorAll(".answer");
const copy = document.querySelectorAll(".copy");

const public = document.querySelector(".chat-section");

if (public) {
  window.location.hash = public.lastChild;
}
if (reButton !== null) {
  reButton.addEventListener("click", loders);
}
button.addEventListener("click", loders);

function loders() {
  button.classList.toggle("hidden");
  loder.classList.toggle("hidden");

  if (question) {
    public.innerHTML += ` <div class="chat-by-public chat">
      <p class="question">${input.value}</p>
    </div>`;
    public.innerHTML += `<div class="chat-bt-gpt chat">
      <p class="answer loading"><div class="wrapper">
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
</div> </p>
    
    </div>`;

    public.lastChild.scrollIntoView();
  }
}

if (answer) {
  answer.forEach((a) => {
    const value = a.textContent.replaceAll("\n", "<br>");
    a.innerHTML = value;
  });
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

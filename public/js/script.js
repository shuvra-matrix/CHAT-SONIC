const button = document.querySelector(".btns");
const loder = document.querySelector(".loder");
const reButton = document.querySelector(".btn");
const input = document.querySelector(".value-input");
const question = document.querySelectorAll(".question");
const answer = document.querySelectorAll(".answer");
const copy = document.querySelectorAll(".copy");

const public = document.querySelector(".chat-section");

if (public.childElementCount > 2) {
  window.addEventListener("load", () => {
    public.scrollIntoView({
      block: "end",
      inline: "nearest",
    });
  });
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

input.addEventListener("keypress", () => {
  if (button.classList.contains("hidden")) {
    button.classList.remove("hidden");
    loder.classList.add("hidden");
  }
});

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

const code = document.querySelectorAll(".code");

code.forEach((c) => {
  const list = c.value.split("```");
  console.log(list);
  c.nextElementSibling.innerHTML += `
  
  <p>${list[0]}</p>
  <pre><code class=""> ${list[1].replaceAll("python", "")}  </code></pre>
  <p>${list[2]}</p>
  `;
});

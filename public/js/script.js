const button = document.querySelector(".btns");
const loder = document.querySelector(".loder");
const reButton = document.querySelector(".btn");
const input = document.querySelector(".value-input");
const question = document.querySelectorAll(".question");
const answer = document.querySelectorAll(".answer");
const copy = document.querySelectorAll(".copy");
const code = document.querySelectorAll(".code");
const public = document.querySelector(".chat-section");

if (public) {
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
  if (input.value.length > 0) {
    button.classList.toggle("hidden");
    loder.classList.toggle("hidden");
    if (public) {
      public.innerHTML += `<div class="chat-by-public chat">
      <p class="question">${input.value}</p>
      <img class="logo-avator" src="/images/3.png" alt="" />
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
     <img class="logo-gpt" src="/images/chat.jpg" alt="" />
    </div>`;
      public.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
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

window.addEventListener("load", () => {
  let list = [];
  answer.forEach((a) => {
    const text = a;
    list.push(a);
  });
  let text = list.slice(-1)[0].textContent;
  let index = 0;
  function type() {
    if (index < text.length) {
      list.slice(-1)[0].innerHTML =
        text.slice(0, index) + '<span class="blinking-cursor">|</span>';
      index++;
      setTimeout(type, Math.random() * 150 + 50);
    } else {
      list.slice(-1)[0].innerHTML =
        text.slice(0, index) + '<span class="blinking-cursor">|</span>';
    }
  }
  type();
});

async function btn() {
  button.addEventListener("click", () => {
    let index = 0;
    window.addEventListener("load", () => {
      answer.forEach((a) => {
        const text = a;
        console.log(a);
        // if (index < text.length) {
        //   console.log(a[-1]);

        //   a[-1].innerHTML =
        //     text.slice(0, index) + '<span class="blinking-cursor">|</span>';
        //   index++;
        //   setTimeout(type, Math.random() * 150 + 50);
        // } else {
        //   a[-1].innerHTML =
        //     text.slice(0, index) + '<span class="blinking-cursor">|</span>';
        // }
      });
    });
  });
}

btn();

copy.forEach((e) => {
  e.addEventListener("click", (f) => {
    let text = "";
    if (e.parentElement.childNodes[3].childNodes[7]) {
      text = e.parentElement.childNodes[3].childNodes[7].textContent;
    } else {
      text = e.parentElement.childNodes[1].textContent;
    }

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

code.forEach((c) => {
  const list = c.value.split("```");
  c.nextElementSibling.innerHTML += `
  
  <p class="code_one">${list[0]}</p>
  <pre><code class=""> ${list[1].replaceAll("python", "")}  </code></pre>
  <p class="code_two">${list[2]}</p>
 <p style="display: none"> "${list[1].replaceAll("python", "")}"</p>
  `;
});

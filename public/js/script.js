const button = document.querySelector(".btns");
const loder = document.querySelector(".loder");
const reButton = document.querySelector(".btn");
const input = document.querySelector(".value-input");
const question = document.querySelectorAll(".question");
const answer = document.querySelectorAll(".answer");
const copy = document.querySelectorAll(".copy");
const code = document.querySelectorAll(".code");
const public = document.querySelector(".chat-section");
const codeDiv = document.querySelector(".code-run");
const gptDiv = document.querySelector(".chat-bt-gpt");
// cookie function

function set_cookie(name, value) {
  document.cookie = name + "=" + value + "; Path=/;";
}
function delete_cookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// when page relode it always go to last div

if (public) {
  window.addEventListener("load", () => {
    public.scrollIntoView({
      block: "end",
      inline: "nearest",
    });
  });
}

// regenerate button loder on

if (reButton !== null) {
  reButton.addEventListener("click", loders);
}

// submit buton loder on
button.addEventListener("click", loders);

// function to load loder on click submit button and regenerate button
// also set cookies for farther use
// add question and loging dynamic when sumit button click
function loders() {
  if (input.value.length > 0) {
    button.classList.toggle("hidden");
    loder.classList.toggle("hidden");

    // add question and loging dynamic when sumit button click
    if (public) {
      set_cookie("newOutput", "true");
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

      //after sumit button page view go to last div
      public.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
  }
}

// when input key preess loder go hide and button come on

input.addEventListener("keypress", () => {
  if (button.classList.contains("hidden")) {
    button.classList.remove("hidden");
    loder.classList.add("hidden");
  }
});

// when windows loading done it check my decided cooke is present or not if present then grab latest
// elemnt text content and show it slowly word by word (like some one typing)
// then delete the cooker because when page relode any no input paresent i dont want show smae typing animation evertime
if (public) {
  window.addEventListener("load", () => {
    let cookie = document.cookie.split(" ")[0].split("=");
    let name = cookie[0];
    let value = cookie[1];
    let list = [];
    answer.forEach((a) => {
      list.push(a);
    });
    let index = 10;

    if (
      public.lastChild.previousSibling.childNodes[1].classList.contains("code")
    ) {
      console.log("yo");
    } else {
      let text = list.slice(-1)[0].textContent.replaceAll("\n", "<br>");
      function type() {
        if (index < text.length) {
          list.slice(-1)[0].innerHTML =
            text.slice(0, index) + '<span class="blinking-cursor">|</span>';
          index++;
          setTimeout(type, Math.random() * 50 + 10);
        } else {
          list.slice(-1)[0].innerHTML =
            text.slice(0, index) + '<span class="blinking-cursor">|</span>';
        }
        delete_cookie(name);
      }

      if (name == "newOutput") {
        type();
      }
    }
    // check if cooke is corrent

    // replce all elemnt textcontain(\n) with <br> to show it next line in html
    if (answer) {
      answer.forEach((a) => {
        const value = a.textContent.replaceAll("\n", "<br>");
        a.innerHTML = value;
      });
    }
  });
}

// copy content from element
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

// take code from input and then split it code and other comment and view them dynamically

code.forEach((c) => {
  const list = c.value.split("```");
  console.log(c);
  c.nextElementSibling.innerHTML += `
  
  <p class="code_one">${list[0]}</p>
  <pre><code class=""> ${list[1].replaceAll("python", "")}  </code></pre>
  `;

  for (let i = 2; i < list.length; i++) {
    c.nextElementSibling.innerHTML += `<p class="code_two">${list[i]}</p>`;
  }
  c.nextElementSibling.innerHTML += `<p style="display: none"> "${list[1].replaceAll(
    "python",
    ""
  )}"</p>`;
});

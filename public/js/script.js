const button = document.querySelector(".btns");
const loder = document.querySelector(".loder");
const reButton = document.querySelector(".rebtn");
const input = document.querySelector(".value-input");
const question = document.querySelectorAll(".question");
const answer = document.querySelectorAll(".answer");
const copy = document.querySelectorAll(".copy");
const code = document.querySelectorAll(".code");
const publics = document.querySelector(".chat-section");
const codeDiv = document.querySelector(".code-run");
const gptDiv = document.querySelector(".chat-bt-gpt");
const undefineCode = document.querySelector(".language-css");
// cookie function

function set_cookie(name, value) {
  document.cookie = name + "=" + value + "; Path=/;";
}
function delete_cookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// add auestion dynamic when typing
// publics.innerHTML += `<div class="chat-by-public chat hidden ">
//       <p class="question"></p>
//       <img class="logo-avator" src="/images/3.png" alt="" />
//     </div>`;

// input.addEventListener("keydown", (e) => {
//   publics.lastChild.classList.remove("hidden");
//   let text = publics.lastChild.childNodes[1].innerHTML;
//   if (e.key == "Backspace") {
//     text = text.slice(0, -1);
//     publics.lastChild.childNodes[1].innerHTML = text;
//   } else {
//     publics.lastChild.childNodes[1].innerHTML += e.key;
//   }
//   if (publics.lastChild.childNodes[1].textContent.length < 1) {
//     publics.lastChild.classList.add("hidden");
//   }
// });

// when page relode it always go to last div
if (publics) {
  window.addEventListener("load", () => {
    publics.scrollIntoView({
      block: "end",
      inline: "nearest",
    });
  });
}
// regenerate button loder on
if (reButton) {
  reButton.addEventListener("click", () => {
    button.classList.toggle("hidden");
    loder.classList.toggle("hidden");
  });
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
    // hide last chile because it's created for show your question letter by letter
    if (publics) {
      set_cookie("newOutput", "true");
      publics.innerHTML += `<div class="chat-by-public chat">
      <p class="question">${input.value}</p>
      <img class="logo-avator" src="/images/3.png" alt="" />
    </div>`;
      publics.innerHTML += `<div class="chat-bt-gpt chat">
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
      publics.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
  }
}

// when input key preess loder go hide and button come on

input.addEventListener("keydown", () => {
  if (button.classList.contains("hidden")) {
    button.classList.remove("hidden");
    loder.classList.add("hidden");
  }
});

// when windows loading done it check my decided cooke is present or not if present then grab latest
// elemnt text content and show it slowly word by word (like some one typing)
// then delete the cooker because when page relode any no input paresent i dont want show smae typing animation evertime
if (publics) {
  window.addEventListener("load", () => {
    let cookie = document.cookie.split(" ")[0].split("=");
    let name = cookie[0];
    let list = [];
    answer.forEach((a) => {
      list.push(a);
    });
    let index = 10;

    if (
      publics.lastChild.previousSibling.childNodes[1].classList.contains("code")
    ) {
      // remove code section text animation
    } else {
      let text = list.slice(-1)[0].textContent.replaceAll("\n", "<br>");
      function type() {
        if (index < text.length) {
          list.slice(-1)[0].innerHTML =
            text.slice(0, index) + '<span class="blinking-cursor">|</span>';
          index++;
          setTimeout(type, Math.random() * 40 + 10);
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
    if (question) {
      answer.forEach((a) => {
        let value = a.textContent.replaceAll("\n", "<br>");
        a.innerHTML = value;
      });
    }
  });
}

// copy content from element
copy.forEach((e) => {
  e.addEventListener("click", (f) => {
    let text = "";

    const contTypee = e.parentElement.childNodes;
    if (contTypee.length === 9) {
      text = contTypee[3].childNodes[1].textContent;
    } else {
      text = contTypee[1].textContent;
    }

    console.log(contTypee);

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
  console.log(list);

  const listLength = list.length;
  for (let i = 0; i < listLength - 1; i++) {
    if (i % 2 == 0) {
      let a = list[i + 1];
      a = a.substring(a.indexOf("\n") + 1).replace(/^/, "\n");

      console.log(list[0 + i]);
      console.log(list[i + 1]);
      const textList = list[0 + i].split("\n");
      const lengthOfText = textList.length;
      for (let i = 0; i < lengthOfText; i++) {
        c.nextElementSibling.innerHTML += `
        
  <p class="code_one" >${textList[i]
    .replaceAll("\n", "<br>")
    .replaceAll("<", "&#60;")
    .replaceAll(">", "&#62;")
    .replaceAll("`", "'")}<br>
    </p>`;
      }
      c.nextElementSibling.innerHTML += `
  <pre><code style="margin-bottom : 1rem "> ${a
    .replaceAll("<", "&#60;")
    .replaceAll(">", "&#62;")}  </code></pre>`;

      c.nextElementSibling.childNodes[1].innerHTML += list[i + 1];
    }
  }
  c.nextElementSibling.innerHTML += `<p class="code_two"> ${
    list[listLength - 1]
  }
  </p>`;
});

//language-bash

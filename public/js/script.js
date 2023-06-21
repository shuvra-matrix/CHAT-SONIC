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
const undefineCode = document.querySelector(".language-css");
const share = document.querySelectorAll(".share");
const installPrompt = document.querySelector(".install-prompt")
const closeBtn = document.querySelector(".close-install") 
const installImage = document.querySelector(".install-image")
const installBtn = document.querySelector(".install");
// create a funtion for add dealy
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
// cookie function
function set_cookie(name, value) {
  document.cookie = name + "=" + value + "; Path=/;";
}
function delete_cookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
// when page relode it always go to last div
if (document.cookie.includes("newuser")) {
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
    //check if new use . if then dont set page to scroll down
    set_cookie("newuser", "yes");
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
     <img class="logo-gpt" src="/images/aibot.png" alt="" />
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
    let list = [];
    answer.forEach((a) => {
      list.push(a);
    });
    console.log(list);
    let index = 10;

    if (
      publics.lastChild.previousSibling.childNodes[1].classList.contains("code")
    ) {
      // remove code section text animation
    } else {
      let text = list.slice(-1)[0].textContent;
      console.log(typeof text);
      let newText = text.replaceAll("\n", "<br>");
      console.log(newText);
      function type() {
        if (index < newText.length) {
          list.slice(-1)[0].innerHTML =
            newText.slice(0, index) + '<span class="blinking-cursor">|</span>';
          index++;
          setTimeout(type, Math.random() * 40 + 10);

          publics.scrollIntoView({
            block: "end",
            inline: "nearest",
          });
        } 
        else 
        {
            list.slice(-1)[0].innerHTML =
            newText.slice(0, index) + '<span class="blinking-cursor">|</span>';
        }
        delete_cookie("newOutput");
      }

      if (document.cookie.includes("newOutput")) {
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
    console.log(contTypee);
    if (contTypee.length === 13) {
      text = contTypee[3].childNodes[1].textContent;

      contTypee[9].classList.add("anime");
      const yourFunction = async () => {
        await delay(900);
        contTypee[9].classList.remove("anime");
        console.log("done");
      };
      yourFunction();
    } else {
      text = contTypee[1].textContent;

      contTypee[7].classList.add("anime");
      const yourFunction = async () => {
        await delay(900);
        contTypee[7].classList.remove("anime");
        console.log("done");
      };
      yourFunction();
    }
    const copyContent = async () => {
      try {
        if (window.isSecureContext && navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          console.log("Content copied to clipboard");
        }
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };
    copyContent();
  });

  // e.parentNode.removeChild(e.parentNode.lastChild);
});

// take code from input and then split it code and other comment and view them dynamically

code.forEach((c) => {
  const list = c.value.split("```");

  const listLength = list.length;
  for (let i = 0; i < listLength - 1; i++) {
    if (i % 2 == 0) {
      let a = list[i + 1];
      a = a.substring(a.indexOf("\n") + 1).replace(/^/, "\n");

      const textList = list[0 + i].split("\n");
      const lengthOfText = textList.length;

      for (let i = 0; i < lengthOfText; i++) {
        c.nextElementSibling.innerHTML += `
      
  <p class="code_one" >${textList[i]
            .replaceAll("\n", "<br>")
            .replaceAll("<", "&#60;")
            .replaceAll(">", "&#62;")
            .replaceAll("`", "'")}
    </p>`;
      }
      c.nextElementSibling.innerHTML += `
  <pre><code style="margin-bottom : 1rem "> ${a
          .replaceAll("<", "&#60;")
          .replaceAll(">", "&#62;")
          .replaceAll(".", "&#46;")}  </code></pre>`;

      c.nextElementSibling.childNodes[1].innerHTML += list[i + 1]
        .replaceAll("<", "&#60;")
        .replaceAll(">", "&#62;")
        .replaceAll(".", "&#46;");
    }
  }
  c.nextElementSibling.innerHTML += `<p class="code_two"> ${list[listLength - 1]
    .replaceAll("\n", "<br>")
    .replace("<br>", "")}
  </p>`;
});

// if share not supported hide share button of user
if (typeof navigator.share === "undefined" || !navigator.share) {
  share.forEach((s) => {
    s.classList.add("forshedHidden");
  });
}

//share function
async function nativeShare(Title, urls, Description) {
  if (navigator.share) {
    const TitleConst = Title;
    const Url = urls;
    const DescriptionConst = Description;

    try {
      await navigator.share({
        title: TitleConst,
        url: Url,
        text: DescriptionConst,
      });
    } catch (error) {
      console.log("Error sharing: " + error);
      return;
    }
  }
}

//if share available run share function

share.forEach((s) => {
  s.addEventListener("click", () => {
    console.log("yes");
    let text = "";
    const contTypee = s.parentElement.childNodes;
    console.log(contTypee);
    if (contTypee.length === 13) {
      text = contTypee[3].childNodes[1].textContent;
      text += "( Created by Chat Sonic )";
      nativeShare("Chat Sonic", "https://chat-sonic.onrender.com/", text);
    } else {
      text = contTypee[1].textContent;
      text += "( Created by Chat Sonic )";
      nativeShare("Chat Sonic", "https://chat-sonic.onrender.com/", text);
    }
  });
});

//chcek if app alreay install or not
if(!document.cookie.includes("appInstall")){
  installBtn.classList.remove("hidden-two")
}

let promptEvent;
// Capture event and defer
  window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  promptEvent = e;
  listenToUserAction();
});
// listen to install button clic
function listenToUserAction() {
  if(!document.cookie.includes("appInstall")){
  installBtn.addEventListener("click", presentAddToHome);
  }
}

// present install prompt to user

function presentAddToHome() {
  promptEvent.prompt();  // Wait for the user to respond to the prompt
  promptEvent.userChoice
    .then(choice => {
      console.log(choice.outcome)
      if (choice.outcome === 'accepted') {
        console.log('User accepted');
        installBtn.classList.add("hidden-two")
        installPrompt.classList.add("hidden-two")
        set_cookie("appInstall","yes")
        if(!document.cookie.includes("isPrompt")){
          set_cookie("isPrompt" , "yes");
        }
      } else {
        console.log('User dismissed');
      }
    })
}

// install custom prompt show
// if pwa already install dont show install button

function getPWADisplayMode()
{
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://'))
  {
    return 'twa';
  } else if (navigator.standalone || isStandalone) 
  {
    installPrompt.classList.add("hidden-two");
    installImage.classList.remove("install-image-animation");
    installBtn.classList.add("hidden-two")
  }
  else{
      closeBtn.addEventListener("click",()=>{
      installPrompt.classList.add("hidden-two");
      installImage.classList.remove("install-image-animation");
    })

    if(!document.cookie.includes("isPrompt"))
    {
      delay(5000).then(result=>{
        installPrompt.classList.remove("hidden-two"); 
        installImage.classList.add("install-image-animation");
        return delay(8000)
      }).then(result=>{
        set_cookie("isPrompt" , "yes");
        installPrompt.classList.add("hidden-two");
        installImage.classList.remove("install-image-animation");
      }).catch(err=>{
        console.log(err)
      })
    }
  }
  
}

getPWADisplayMode();











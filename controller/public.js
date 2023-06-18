require("dotenv").config();
const { validationResult, Result } = require("express-validator");
const axios = require("axios");
const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_ID,
    pass: process.env.PASSWORD,
  },
});

let total = 28896;

exports.getChatIndex = (req, res, next) => {
  console.log(req.user);
  console.log(req.user.apikeyindex, req.user.maxApiKey);
  if (req.session.answer) {
    return res.render("public/chat", {
      answer: req.session.answer,
    });
  }
  res.render("public/chat", {
    answer: [
      {
        question: "Hi! Chat Sonic",
        answer: `<p class="heading">Hello there! How can I assist you today?</p>\n\nYou can ask me anything you want! I'm here to help you in any way I can, whether you have a question, need assistance with a task, or just want to chat. So go ahead and ask me whatever is on your mind.\nhere are some topics and questions you can ask me:\n\n<span class="number">1</span>. I need to create a REST API endpoint for my web application. Can you provide an example of how to do that using Node.js and Express?\n<span class="number">2</span>. What's the difference between object-oriented and procedural programming?\n<span class="number">3.</span>. Find the bug with this code: <post code below>\n<span class="number">4</span>. Generate a 2-minute video script for a Facebook ad campaign promoting our new service [ Service description]\n<span class="number">5.</span>. Write an in-depth analysis of the current state of a specific industry and its potential for small business opportunities.\n<span class="number">6</span>. Can you provide me with some ideas for blog posts about [topic of your choice]?\n<span class="number">7</span>. Write a minute-long script for an advertisement about [product or service or company]\n<span class="number">8</span>. Teach me the <topic of your choice> and give me a quiz at the end, but don’t give me the answers and then tell me if I answered correctly.\n\n<span class="number-hash">##</span> Remember that this app only considers the last five questions as a conversation. So if you want to continue as a conversation with this chat bot, you need to complete your conversation with in five questions.\n\n`,
      },
    ],
  });
};

exports.getImageIndex = (req, res, next) => {
  res.render("public/image", {
    modeon: false,
    preInput: "",
    imgaeLink: "/images/dalhe.jpg",
  });
};

exports.postChat = (req, res, next) => {
  const que = req.body.value;
  const error = validationResult(req);
  if (!error.isEmpty() || que.length < 2) {
    return res.status(422).render("public/chat", {
      answer: [
        {
          question: que,
          answer: "Please enter a valid input",
        },
      ],
    });
  }
  if (req.user.apikeyindex.toString() >= req.user.maxApiKey.toString()) {
    return res.render("public/chat", {
      answer: [
        {
          question: "What's wrong Chat Sonic?",
          answer:
            "We faced some major issues. We try to fixed it as soon as possible. Please try again later",
        },
      ],
    });
  }

  if (!req.session.answer) {
    req.session.message = [];
    req.session.answer = [];
  }
  req.session.message.push({ role: "user", content: que });

  async function apiCall(indexApi) {
    const messageLimit = req.session.message.slice(-5);
    let api;
    if (indexApi >= 0) {
      api = process.env.API_KEY.split(",")[indexApi];
    }
    const options = {
      method: "POST",
      url: "https://openai80.p.rapidapi.com/chat/completions",
      headers: {
        "Accept-Encoding": "gzip,deflate,compress",
        "content-type": "application/json",
        "X-RapidAPI-Key": api,
        "X-RapidAPI-Host": "openai80.p.rapidapi.com",
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: messageLimit,
      },
    };

    axios
      .request(options)
      .then((response) => {
        const reply = response.data.choices[0].message.content;
        total += Number(response.data.usage.total_tokens);
        if (reply.includes("```")) {
          req.session.answer.push({
            question: que,
            answer: reply,
            isCode: true,
          });
        } else {
          req.session.answer.push({
            question: que,
            answer: reply,
            isCode: false,
          });
        }

        res.render("public/chat", {
          answer: req.session.answer,
        });
      })
      .catch((error) => {
        res.render("public/chat", {
          answer: [
            {
              question: "What's wrong Chat Sonic?",
              answer:
                "Sorry we faced some api issue please wait for a moment .It will be fixed automatically.Please try again",
            },
          ],
        });

        let errorData = error.response.data.message;

        if (
          errorData.includes(
            "You have exceeded the MONTHLY quota for Tokens on your current plan"
          )
        ) {
          let userApiIndex = req.user.apikeyindex + 1;
          req.user.apikeyindex = userApiIndex;

          req.user
            .save()
            .then((result) => {
              const remaningApi = req.user.maxApiKey - req.user.apikeyindex;
              const mailOption = {
                from: process.env.USER_ID,
                to: process.env.TO_USER_ID,
                subject: "API ISSUE",
                html: `<html><body style="width : 95%; text-align:center;   display: flex;
                justify-content: center;
                align-items: center; margin : auto ; background-color :#000000d9;padding : 15px ;">
                
                <div style="width : 95% ;height : 90%; text-align : center; margin : 12px auto ; background-color : #0c0921; padding:1rem">
                <h1 style="color : green">Hi Your Api limit is end. We call a new api . please add more api</h1>
                  <h2 style="margin:12px , color : orange "> Remaing API - ${remaningApi} </h2>
                </div>
                
                </body></html>`,
              };
              return transporter.sendMail(mailOption);
            })
            .then((response) => {
              console.log(response);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error");
          res.render("public/chat", {
            answer: [
              {
                question: "What's wrong Chat Sonic?",
                answer: "Something went wrong. Please try again later",
              },
            ],
          });
        }
      });
  }

  apiCall(req.user.apikeyindex);
};

exports.postImage = (req, res, next) => {
  const value = req.body.value;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("public/image", {
      modeon: false,
      preInput: value,
      imgaeLink: "/images/invalid.jpg",
    });
  }
  if (req.user.apikeyindex.toString() >= req.user.maxApiKey.toString()) {
    return res.render("public/chat", {
      answer: [
        {
          question: "What's wrong Chat Sonic?",
          answer:
            "We faced some major issues. We try to fixed it as soon as possible. Please try again later",
        },
      ],
    });
  }
  async function apiCall(indexApi) {
    let api;
    if (indexApi >= 0) {
      api = process.env.API_KEY.split(",")[indexApi];
      console.log(api);
    }
    const options = {
      method: "POST",
      url: "https://openai80.p.rapidapi.com/images/generations",
      headers: {
        "Accept-Encoding": "gzip,deflate,compress",
        "content-type": "application/json",
        "X-RapidAPI-Key": api,
        "X-RapidAPI-Host": "openai80.p.rapidapi.com",
      },
      data: {
        prompt: value,
        n: 1,
        size: "1024x1024",
      },
    };

    axios
      .request(options)
      .then((response) => {
        const imageLink = response.data.data[0].url;
        console.log(response.data.data);

        res.render("public/image", {
          modeon: true,
          preInput: value,
          imgaeLink: imageLink,
        });
      })
      .catch((error) => {
        res.render("public/chat", {
          answer: [
            {
              question: "What's wrong Chat Sonic?",
              answer:
                "Sorry we faced some api issue please wait for a moment. It will be fixed automatically. Please try again",
            },
          ],
        });

        let errorData = error.response.data.message;

        if (
          errorData.includes(
            "You have exceeded the MONTHLY quota for Tokens on your current plan"
          )
        ) {
          let userApiIndex = req.user.apikeyindex + 1;
          req.user.apikeyindex = userApiIndex;
          if (userApiIndex == user.maxApiKey) {
            return res.render("public/chat", {
              answer: [
                {
                  question: "What's wrong Chat Sonic?",
                  answer:
                    "Sorry we faced some major issue. We try to solve it as soon as possible. Please try again later",
                },
              ],
            });
          }
          req.user
            .save()
            .then((result) => {
              const remaningApi = req.user.maxApiKey - req.user.apikeyindex;

              const mailOption = {
                from: process.env.USER_ID,
                to: process.env.TO_USER_ID,
                subject: "API ISSUE",
                html: `<html><body style="width : 95%; text-align:center;   display: flex;
    justify-content: center;
    align-items: center; margin : auto ; background-color :#000000d9;padding : 15px ;">
                
                <div style="width : 95% ;height : 90%; text-align : center; margin : 12px auto ; background-color : #0c0921; padding:1rem">
                <h1 style="color : green">Hi Your Api limit is end. We call a new api . please add more api</h1>
                 <h2 style="margin:12px , color : orange ">
                Remaing API - ${remaningApi}}
              </h2>;
                </div>
                
                </body></html>`,
              };
              return transporter.sendMail(mailOption);
            })
            .then((response) => {
              console.log(response);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error");
          res.render("public/image", {
            modeon: false,
            preInput: value,
            imgaeLink: "/images/invalid2.jpg",
          });
        }
      });
  }

  apiCall(req.user.apikeyindex);
};

require("dotenv").config();
const { validationResult, Result } = require("express-validator");
const axios = require("axios");
const User = require("../model/user");
const { response } = require("express");
const user = require("../model/user");
const nodeMailer = require("nodemailer");
// const user = new User({
//   apikeyindex: 0,
// });
// user
//   .save()
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((err) => console.log(err));

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_ID,
    pass: process.env.PASSWORD,
  },
});

let total = 28896;
async function api() {
  const options = {
    method: "POST",
    url: "https://openai80.p.rapidapi.com/chat/completions",
    headers: {
      "Accept-Encoding": "gzip,deflate,compress",
      "content-type": "application/json",
      "X-RapidAPI-Key": "91e8d91d42msh9648b3d92531ed3p110591jsn998769c81a46",
      "X-RapidAPI-Host": "openai80.p.rapidapi.com",
    },
    data: {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "make python code to print addition of two digit",
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

// api();

exports.getChatIndex = (req, res, next) => {
  if (req.session.answer) {
    return res.render("public/chat", {
      answer: req.session.answer,
    });
  }
  res.render("public/chat", {
    answer: [
      {
        question: "Hi! Chat Sonic",
        answer: `Hello there! How can I assist you today?`,
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
  if (!req.session.answer) {
    req.session.message = [];
    req.session.answer = [];
  }
  req.session.message.push({ role: "user", content: que });

  async function apiCall(indexApi) {
    console.log(indexApi);
    let api;
    if (indexApi >= 0) {
      api = process.env.API_KEY.split(",")[indexApi];
      console.log(api);
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
        messages: req.session.message,
      },
    };

    axios
      .request(options)
      .then((response) => {
        const reply = response.data.choices[0].message.content;
        console.log(reply);
        total += Number(response.data.usage.total_tokens);
        console.log(total);
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
          User.findById("648edc6b1f324c954afc65d7").then((user) => {
            let userApiIndex = user.apikeyindex + 1;
            user.apikeyindex = userApiIndex;
            user
              .save()
              .then((result) => {
                const mailOption = {
                  from: process.env.USER_ID,
                  to: process.env.TO_USER_ID,
                  subject: "Welcome To Shop",
                  html: `<html><body style="width : 90%; margin : auto ; background-color :#000000d9,padding : 15px ;">
                
                <div style="width : 95% ;height : 90%; text-align : center; margin : 12px auto ; background-color : #0c0921; padding:1rem">
                <h1 style="color : green">Hi Your Api limit is end. We call a new api . please add more api</h1>

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
          });
        } else {
          console.log("error");
          res.render("public/chat", {
            answer: [
              {
                question: "what's wrong Chat Sonic?",
                answer: "Something went wrong. Please try again later",
              },
            ],
          });
        }
      });
  }
  user
    .findById("648edc6b1f324c954afc65d7")
    .then((user) => {
      apiCall(user.apikeyindex);
    })
    .catch((err) => {
      console.log(err);
    });
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

  async function apiCall() {
    const options = {
      method: "POST",
      url: "https://openai80.p.rapidapi.com/images/generations",
      headers: {
        "Accept-Encoding": "gzip,deflate,compress",
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.API_KEY,
        "X-RapidAPI-Host": "openai80.p.rapidapi.com",
      },
      data: {
        prompt: value,
        n: 1,
        size: "1024x1024",
      },
    };
    try {
      const response = await axios.request(options);
      const imageLink = response.data.data[0].url;
      console.log(response.data.data);

      res.render("public/image", {
        modeon: true,
        preInput: value,
        imgaeLink: imageLink,
      });
    } catch (error) {
      res.render("public/image", {
        modeon: false,
        preInput: value,
        imgaeLink: "/images/invalid2.jpg",
      });
      console.error(error);
    }
  }

  apiCall();
};

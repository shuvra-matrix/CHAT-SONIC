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

exports.getChatIndex = (req, res, next) => {
  if (!req.session.answer) {
    req.session.answer = [];
  }
  if (req.session.answer.length > 0) {
    return res.render("public/chat", {
      answer: req.session.answer,
      isIndex: false,
      isImage: false,
    });
  }

  res.render("public/chat", {
    answer: [
      {
        question: "",
        answer: ``,
      },
    ],
    isIndex: true,
    isImage: false,
  });
};

exports.getImageIndex = (req, res, next) => {
  res.render("public/image", {
    modeon: false,
    preInput: "",
    imgaeLink: "/images/dalhe.jpg",
    isImage: true,
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
      isIndex: false,
      isImage: false,
    });
  }
  if (req.global.apikeyindex.toString() >= req.global.maxApiKey.toString()) {
    return res.render("public/chat", {
      answer: [
        {
          question: "What's wrong Chat Sonic?",
          answer:
            "We faced some major issues. We try to fixed it as soon as possible. Please try again later",
        },
      ],
      isIndex: false,
      isImage: false,
    });
  }
  req.user[0]
    .addMessage({ role: "user", content: que })
    .then((responce) => {
      console.log(responce);
    })
    .catch((err) => {
      console.log(err);
    });
  async function apiCall(indexApi) {
    const messageLimit = req.user[0].conversation.message.slice(-5);
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
        if (reply.includes("```")) {
          req.session.answer.push({
            question: que,
            answer: reply,
            isCode: true,
            isShow: "yes",
          });
          req.user[0]
            .addAnswer({
              question: que,
              answer: reply,
              isCode: true,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => console.log(err));
        } else {
          req.session.answer.push({
            question: que,
            answer: reply,
            isCode: false,
            isShow: "yes",
          });
          req.user[0]
            .addAnswer({
              question: que,
              answer: reply,
              isCode: false,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => console.log(err));
        }

        res.render("public/chat", {
          answer: req.session.answer,
          isIndex: false,
          isImage: false,
        });
      })
      .catch((error) => {
        let errorData = error.response.data.message;

        if (
          errorData.includes(
            "You have exceeded the MONTHLY quota for Tokens on your current plan"
          )
        ) {
          res.render("public/chat", {
            answer: [
              {
                question: "What's wrong Chat Sonic?",
                answer:
                  "Sorry we faced some api issue please wait for a moment .It will be fixed automatically.Please try again",
              },
            ],
            isIndex: false,
            isImage: false,
          });
          let apiIndex = req.global.apikeyindex + 1;
          req.global.apikeyindex = apiIndex;

          req.user[0]
            .save()
            .then((result) => {
              const remaningApi = req.global.maxApiKey - req.global.apikeyindex;
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
          console.log(error);
          res.render("public/chat", {
            answer: [
              {
                question: "What's wrong Chat Sonic?",
                answer: "Something went wrong. Please try again later",
              },
            ],
            isIndex: false,
            isImage: false,
          });
        }
      });
  }

  apiCall(req.global.apikeyindex);
};

exports.postImage = (req, res, next) => {
  const value = req.body.value;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("public/image", {
      modeon: false,
      preInput: value,
      imgaeLink: "/images/invalid.jpg",
      isImage: true,
    });
  }
  if (req.global.apikeyindex.toString() >= req.global.maxApiKey.toString()) {
    return res.render("public/chat", {
      answer: [
        {
          question: "What's wrong Chat Sonic?",
          answer:
            "We faced some major issues. We try to fixed it as soon as possible. Please try again later",
        },
      ],
      isIndex: false,
      isImage: false,
    });
  }
  async function apiCall(indexApi) {
    let api;
    if (indexApi >= 0) {
      api = process.env.API_KEY.split(",")[indexApi];
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
        req.user[0]
          .addToImageSection({ question: value, imageLink: imageLink })
          .then((response) => {
            res.render("public/image", {
              modeon: true,
              preInput: value,
              imgaeLink: imageLink,
              isImage: true,
            });
          });
      })
      .catch((error) => {
        let errorData = error.response.data.message;

        if (
          errorData.includes(
            "You have exceeded the MONTHLY quota for Tokens on your current plan"
          )
        ) {
          res.render("public/chat", {
            answer: [
              {
                question: "What's wrong Chat Sonic?",
                answer:
                  "Sorry we faced some api issue please wait for a moment. It will be fixed automatically. Please try again",
              },
            ],
            isIndex: false,
            isImage: false,
          });

          let apiIndex = req.global.apikeyindex + 1;
          req.global.apikeyindex = apiIndex;
          if (apiIndex == global.maxApiKey) {
            return res.render("public/chat", {
              answer: [
                {
                  question: "What's wrong Chat Sonic?",
                  answer:
                    "Sorry we faced some major issue. We try to solve it as soon as possible. Please try again later",
                },
              ],
              isIndex: false,
              isImage: false,
            });
          }
          req.global
            .save()
            .then((result) => {
              const remaningApi = req.global.maxApiKey - req.global.apikeyindex;
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
          console.log(error);
          res.render("public/image", {
            modeon: false,
            isImage: true,
            preInput: value,
            imgaeLink: "/images/invalid2.jpg",
          });
        }
      });
  }

  apiCall(req.global.apikeyindex);
};

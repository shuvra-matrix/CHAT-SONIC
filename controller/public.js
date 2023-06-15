require("dotenv").config();
const { validationResult } = require("express-validator");
const axios = require("axios");

exports.getChatIndex = (req, res, next) => {
  if (req.session.answer) {
    return res.render("public/chat", {
      answer: req.session.answer,
    });
  }
  res.render("public/chat", {
    answer: [
      {
        question: "Hi! ChatGuru",
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
  if (!error.isEmpty()) {
    return res.status(422).render("public/index", {
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

  async function apiCall() {
    const options = {
      method: "POST",
      url: "https://openai80.p.rapidapi.com/chat/completions",
      headers: {
        "Accept-Encoding": "gzip,deflate,compress",
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.API_KEY,
        "X-RapidAPI-Host": "openai80.p.rapidapi.com",
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: req.session.message,
      },
    };

    try {
      const response = await axios.request(options);
      const reply = response.data.choices[0].message.content;

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
    } catch (error) {
      res.render("public/chat", {
        answer: [
          {
            question: que,
            answer: "Something went wrong. Please try again later.",
          },
        ],
      });
      console.error(error);
    }
  }

  // apiCall();
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

require("dotenv").config();
const { validationResult } = require("express-validator");
const axios = require("axios");

exports.getChatIndex = (req, res, next) => {
  res.render("public/chat", {
    answer: [
      {
        question: "Example : Tell me about India",
        answer: `India, officially known as the Republic of India, is a country located in South Asia. It is the seventh-largest country in the world by area and the second-most populous country, with over 1.3 billion people. Its capital is New Delhi, and the official languages are Hindi and English. India has a rich cultural and historical heritage that spans over 5,000 years. Some of the world's earliest civilizations, such as the Indus Valley Civilization and the Mauryan Empire, were located in present-day India. Later, India was ruled by various empires and dynasties, including the Mughal Empire and the British Raj. Today, India is a federal parliamentary democratic republic with a president who serves as the head of state and a prime minister who serves as the head of government. India is also a secular country with a diverse population that includes Hindus, Muslims, Christians, Buddhists, and Sikhs, among others. India has a fast-growing economy and is known for its IT industry, pharmaceuticals, and agriculture. The country is also home to several world-famous landmarks, such as the Taj Mahal, the Golden Temple, and the Red Fort. Indian cuisine is also renowned around the world for its spices and flavors. However, India also faces several challenges, including poverty, corruption, pollution, and inequality. The Indian government is working to address these issues and promote inclusive and sustainable development for all citizens.`,
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
        messages: [
          {
            role: "user",
            content: que,
          },
        ],
      },
    };

    try {
      const response = await axios.request(options);
      const reply = response.data.choices[0].message.content;

      res.render("public/chat", {
        answer: [
          {
            question: que,
            answer: reply,
          },
        ],
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

  apiCall();
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

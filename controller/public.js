require("dotenv").config();
const { validationResult } = require("express-validator");
const axios = require("axios");
const nodeMailer = require("nodemailer");
const rootDir = require("../util/path");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const huggingFace = require("@huggingface/inference").HfInference;
const hf = new huggingFace(process.env.DIFFUSION_API);

cloudinary.config({
  cloud_name: "dqone7ala",
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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
      isIndex: false,
    });
  }

  if (req.global.chatApiKey >= req.global.chatMaxApiKey) {
    req.global.chatApiKey = 0;
    return req.global.save().then((response) => {
      res.render("public/chat", {
        answer: [
          {
            question: "What's wrong Chat Sonic?",
            answer:
              "We faced some major issues. We try to fixed it as soon as possible. Please try again later",
          },
        ],
        isIndex: false,
      });
    });
  }
  req.user[0]
    .addMessage({ role: "user", content: que })
    .then((responce) => {
      console.log("ADD MESSAGE DONE");
    })
    .catch((err) => {
      console.log(err);
    });
  async function apiCall(indexApi) {
    const messageLimit = req.user[0].conversation.message.slice(-5);
    let api;
    if (indexApi >= 0) {
      api = process.env.NEW_GPT_API.split(",")[indexApi];
    }
    const options = {
      method: "POST",
      url: "https://chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com/v1/chat/completions",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": api,
        "X-RapidAPI-Host": "chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com",
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: messageLimit,
        temperature: 1,
      },
    };

    axios
      .request(options)
      .then((response) => {
        const remaningRequest = Number(
          response.headers["x-ratelimit-requests-remaining"]
        );
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
              console.log("add question done");
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
              console.log("add question done");
            })
            .catch((err) => console.log(err));
        }

        res.render("public/chat", {
          answer: req.session.answer,
          isIndex: false,
        });

        if (remaningRequest <= 1) {
          let apiIndex = req.global.chatApiKey + 1;
          req.global.chatApiKey = apiIndex;
          req.global
            .save()
            .then((response) => {
              const remaningApi =
                req.global.chatMaxApiKey - req.global.chatApiKey - 1;
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
              console.log("email send done");
            });
        }
      })
      .catch((error) => {
        res.render("public/chat", {
          answer: [
            {
              question: "What's wrong Chat Sonic?",
              answer:
                "You have exceeded the rate limit per minute. Please wait for one minutes",
            },
          ],
          isIndex: false,
        });
      });
  }
  apiCall(req.global.chatApiKey);
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
  if (req.global.apikeyindex >= req.global.maxApiKey) {
    req.global.apikeyindex = 0;
    req.global.save();
    return res.render("public/chat", {
      answer: [
        {
          question: "What's wrong Chat Sonic?",
          answer:
            "We faced some major issues. We try to fixed it as soon as possible. Please try again later",
        },
      ],
      isIndex: false,
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
            console.log("image question add done");
            res.render("public/image", {
              modeon: true,
              preInput: value,
              imgaeLink: imageLink,
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
              console.log("email sent done");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log(error);
          res.render("public/image", {
            modeon: false,

            preInput: value,
            imgaeLink: "/images/invalid2.jpg",
          });
        }
      });
  }

  apiCall(req.global.apikeyindex);
};

exports.getStableDiffusion = (req, res, next) => {
  const mode = req.query.mode;
  let modeName;
  let imagePath;
  let promptsLink;
  if (mode == "stableDiffusion") {
    modeName = "STABLE DIFFUSION 2.1";
    imagePath = "/images/sd.png";
    promptsLink = "https://prompthero.com/stable-diffusion-prompts";
  } else if (mode == "openjourney") {
    modeName = "OPENJOURNEY";
    imagePath = "/images/open.png";
    promptsLink = "https://prompthero.com/openjourney-prompts";
  } else {
    return res.render("public/image", {
      modeon: false,
      preInput: "",
      imgaeLink: "/images/dalhe.jpg",
    });
  }
  res.render("public/image-defusion", {
    modeon: false,
    preInput: "",
    imgaeLink: imagePath,
    mode: mode,
    modeName: modeName,
    promptsLink: promptsLink,
  });
};

exports.postStableDiffusion = (req, res, next) => {
  const name = Math.floor(Math.random() * 9999 + 2);
  const mode = req.body.mode;
  let promptsLink;
  console.log(mode);
  let inputValue = req.body.value;
  let splitInputValue;
  let value;
  let negativePrompt;
  if (inputValue.includes("[n]")) {
    splitInputValue = inputValue.split("[n]");
    value = splitInputValue[0] + " " + name;
    negativePrompt = splitInputValue[1];
  } else {
    value = inputValue + " " + name;
    negativePrompt = "";
  }
  let url;
  let model;
  let numInferenceSteps;
  let guidanceScale;
  if (mode == "stableDiffusion") {
    url = process.env.DIFFUSION_API_URL;
    model = process.env.DIFFUSION_MODEL;
    promptsLink = "https://prompthero.com/stable-diffusion-prompts";
    numInferenceSteps = 40;
    guidanceScale = 10;
  } else if (mode == "openjourney") {
    url = process.env.OPENJOURNEY_API_URL;
    model = process.env.OPENJOURNEY_MODEL;
    promptsLink = "https://prompthero.com/openjourney-prompts";
    numInferenceSteps = 60;
    guidanceScale = 20;
  } else {
    return res.render("public/image", {
      modeon: false,
      preInput: "",
      imgaeLink: "/images/dalhe.jpg",
    });
  }
  console.log(url);
  console.log(value);
  console.log(model);
  console.log(negativePrompt);
  console.log(numInferenceSteps);
  console.log(guidanceScale);

  async function query(data) {
    const responce = hf.textToImage({
      inputs: data,
      model: model,
      parameters: {
        num_inference_steps: numInferenceSteps,
        guidance_scale: guidanceScale,
        negative_prompt: negativePrompt,
      },
    });
    return responce;
  }
  query(value)
    .then((response) => {
      response.arrayBuffer().then((data) => {
        let buffer = Buffer.from(data);
        const location = path.join(
          rootDir,
          "public/images",
          `image${name}.jpg`
        );
        new Promise(function (resolve, reject) {
          fs.writeFile(location, buffer, function (err) {
            if (err) reject(err);
            else resolve(data);
          });
        }).then((result) => {
          const imageFile = location;
          const uploadImage = async (imagePath) => {
            // Use the uploaded file's name as the asset's public ID and
            // allow overwriting the asset with new versions
            const options = {
              use_filename: true,
              unique_filename: false,
              overwrite: true,
            };
            try {
              // Upload the image
              const result = await cloudinary.uploader.upload(
                imageFile,
                options
              );
              fs.unlinkSync(imageFile);
              req.user[0]
                .addToImageSection({
                  question: value,
                  imageLink: result.url,
                })
                .then((results) => {
                  console.log("stable difusion question add to db done");
                  res.render("public/image-defusion", {
                    modeon: true,
                    preInput: inputValue,
                    imgaeLink: result.url,
                    mode: mode,
                  });
                });
            } catch (error) {
              console.error(error);
              res.render("public/image-defusion", {
                modeon: false,
                mode: mode,
                modeName: mode,
                promptsLink: promptsLink,
                preInput: value,
                imgaeLink: "/images/invalid2.jpg",
              });
              next(new Error("Server Error"));
            }
          };
          uploadImage();
        });
      });
    })
    .catch((err) => {
      res.render("public/image-defusion", {
        modeon: false,
        mode: mode,
        preInput: value,
        modeName: mode,
        promptsLink: promptsLink,
        imgaeLink: "/images/invalid2.jpg",
      });
    });
  next(new Error("Server Error"));
};

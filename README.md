<!--
Hey, thanks for using the awesome-readme-template template.
If you have any enhancements, then fork this project and create a pull request
or just open an issue with the label "enhancement".
Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">
  <h1>Chat Sonic Ai Chat Web Application</h1>
  
  
<!-- Badges -->

<h4>
    <a href="https://chatsonic.cyclic.cloud/">View Demo</a>
  <span> · </span>
    <a href="https://github.com/shuvra-matrix/CHAT-GURU/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/shuvra-matrix/CHAT-GURU/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents

- [:notebook_with_decorative_cover: Table of Contents](#notebook_with_decorative_cover-table-of-contents)
  - [:star2: About the Project](#star2-about-the-project)
    - [:house: LiveDemo](#house-livedemo)
    - [:space_invader: Tech Stack](#space_invader-tech-stack)
    - [:dart: Features](#dart-features)
    - [:key: Environment Variables](#key-environment-variables)
  - [:toolbox: Getting Started](#toolbox-getting-started)
    - [:bangbang: Prerequisites](#bangbang-prerequisites)
    - [:running: Run Locally](#running-run-locally)
  - [:notes: to-do](#notes-to-do)
  - [:wave: Contributing](#wave-contributing)
  - [:warning: License](#warning-license)
  - [:handshake: Contact](#handshake-contact)
  - [:gem: Acknowledgements](#gem-acknowledgements)

<!-- About the Project -->

## :star2: About the Project

![Image Description](https://github.com/shuvra-matrix/images/blob/main/Screenshot%202024-01-28%20094915.png?raw=true)
<br>

  <p>
    Chat Sonic is an innovative web application developed using Node.js, OpenAI API, and harnessing the capabilities of Stable Diffusion v2.1 models. This powerful app combines the functionalities of a chatbot, image generation, and Progressive Web App (PWA) support, offering users a seamless and immersive experience.
  </p>
  <br>
  <p>
    With Chat Sonic, you can engage in natural language conversations just like chatting with a friend. Powered by the advanced ChatGPT model, it understands your inputs, provides insightful responses, and even engages in casual banter. Whether you need information, creative suggestions, or friendly conversation, Chat Sonic is here to assist you.
  </p>
   <br>
  <p>
   But Chat Sonic doesn't stop at text-based interactions. Leveraging the cutting-edge DALL·E 2 model, this app brings your words to life with visually stunning results. Describe your desired image in detail, and Chat Sonic will generate realistic and visually coherent representations. From landscapes and artwork to imaginative characters, let your imagination run wild as Chat Sonic transforms your text into captivating visuals.
  </p>
   <br>
  <p>
   The magic of Stable Diffusion v2.1 and openjourney models ensures that the generated images exhibit stability and realism. Through a combination of AI techniques and state-of-the-art image processing, Chat Sonic delivers high-quality visual outputs that amaze and inspire.
  </p>
   <br>
  <p>
    Moreover, Chat Sonic supports PWA functionality, allowing you to install it as a standalone app on your device. Enjoy the convenience of quick access and a native app-like experience across various platforms and browsers.
  </p>
   <br>
  <p>
   Experience the fusion of language and images with Chat Sonic. Whether you're an artist seeking inspiration, a content creator in need of unique visuals, or simply curious about AI-generated images, this web app has you covered. Engage in meaningful conversations, unleash your creativity, and enjoy the flexibility of a Progressive Web App.
  </p>
  <br>
  <p>
   Chat Sonic: Where conversations create art. Embrace the power of Node.js, OpenAI API, Stable Diffusion v2.1, and PWA support. Start chatting and visualizing today!
  </p>

<!--  live demo -->

### :house: LiveDemo

[Live Demo](https://chatsonic.cyclic.cloud/)

<!-- TechStack -->

### :space_invader: Tech Stack

<details>
  <summary>Frontend</summary>
  <ul>
    <li><a href="https://html.com/html5/">HTML 5</a></li>
    <li><a href="https://www.css3.com/">CSS 3</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a></li>
    <li><a href="https://highlightjs.org/">highlight.js</a></li>
    <li><a href="https://nodemailer.com/about/">nodemailer</a></li>
  </ul>
</details>

<details>
  <summary>Backend</summary>
  <ul>
    <li><a href="https://www.nodejs.org">Node.js</a></li>
    <li><a href="https://www.expressjs.com/">Express.js</a></li>
    <li><a href="https://mongoosejs.com/">Mongoos</a></li>
    <li><a href="https://www.npmjs.com/package/express-session">Express-session</a></li>
    <li><a href="https://console.cloudinary.com/">Cloudinary</a></li>
    <li><a href="https://github.com/Stability-AI/stablediffusion">stable-diffusion-2-1</a></li>
     <li><a href="https://github.com/prompthero/openjourney">OpenJourney</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
  </ul>
</details>

<!-- Features -->

### :dart: Features

- User
  - do conversations and much more with the chatbot. The language model can answer questions and assist you with tasks, such as composing emails, essays, and code.
  - Text to image generate (DALL-E 2 ,Stable Diffusion, openjourney models )
  - It has Progressive Web App (PWA) capabilities, users can install the app on their home screens, just like a native app, and access it with a single tap.

<!-- Env Variables -->

### :key: Environment Variables

To run this project, you will need to add the following variables to your .env file

`API_KEY = YOUR API KEY`
`MONGO_USER = MONGO DB USE NAME`
`MONGO_PASS = MONGODB PASSWORD`
`SESSION SECRET = SESSION SECRET`
`USER_ID = YOUR EMAIL ID`
`PASSWORD = EMAIL PASSWORD`
`TO_USER_ID = SEND TO EMAIL ADDRESS`
`MONGO_DB_NAME = YOUR MONGO DB NAME`
`DIFFUSION_API = Stable Diffusion Api Key`
`DIFFUSION_API_URL = Stable Diffusion Api Url`
`OPENJOURNEY_API_URL = openjourney api url`
`CLOUDINARY_API = Cloudinary Api Key`
`CLOUDINARY_SECRET = Cloudinary Secret Key`

<!-- Getting Started -->

## :toolbox: Getting Started

<!-- Prerequisites -->

### :bangbang: Prerequisites

This project uses MongoDB as database. please install mongodb server in local environment.

<!-- Run Locally -->

### :running: Run Locally

Clone the project

```bash
  git clone https://github.com/shuvra-matrix/CHAT-GURU.git
```

Go to the project directory

```bash
  cd project-directory
```

Install dependencies

```bash
  npm install
```

Start the backend server

```bash
  npm run dev
```

Use following paths

```bash
  Backend server : localhost:3000/

```

<!-- To Do -->

## :notes: to-do

  <ul>
  <li> add more features </li>
  </ul>

<!-- Contributing -->

## :wave: Contributing

<a href="https://github.com/shuvra-matrix/CHAT-GURU/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=shuvra-matrix/CHAT-GURU" />
</a>

Contributions are always welcome!

<!-- License -->

## :warning: License

Distributed under the no License.

<!-- Contact -->

## :handshake: Contact

Shuvra Chakrabarty - <shuvrachakrabarty97@gmail.com>

Project Link: [https://github.com/shuvra-matrix/CHAT-GURU](https://github.com/shuvra-matrix/CHAT-GURU)

<!-- Acknowledgments -->

## :gem: Acknowledgements

Following libraries have been used in this projects.

- [highlight.js](https://highlightjs.org/)
- [express-validator](https://express-validator.github.io/docs/)
- [connect-mongodb-session](https://www.npmjs.com/package/connect-mongodb-session)
- [nodemailer](https://nodemailer.com/about/)
- [cloudinary](https://www.npmjs.com/package/cloudinary)

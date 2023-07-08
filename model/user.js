const mongoos = require("mongoose");
const User = require("./user");
const Schema = mongoos.Schema;

const userSchema = new Schema({
  conversation: {
    message: [
      {
        type: Object,
        unique: false,
      },
    ],
    answer: [
      {
        type: Object,
        unique: false,
      },
    ],
  },
  ipAddress: {
    type: String,
  },
  imagesection: [
    {
      type: Object,
      unique: false,
    },
  ],
});

userSchema.methods.addMessage = function (message) {
  const oldmessage = this.conversation.message;
  let updatedCart = [...oldmessage];
  updatedCart.push(message);
  this.conversation.message = updatedCart;
  return this.save();
};

userSchema.methods.addAnswer = function (answer) {
  const oldanswer = this.conversation.answer;
  let updatedAnswer = [...oldanswer];
  updatedAnswer.push(answer);
  this.conversation.answer = updatedAnswer;
  return this.save();
};

userSchema.methods.addToImageSection = function (imageobj) {
  const imageOldQuery = this.imagesection;
  let updatedImageSection = [...imageOldQuery];
  updatedImageSection.push(imageobj);
  return this.save();
};

module.exports = mongoos.model("User", userSchema);

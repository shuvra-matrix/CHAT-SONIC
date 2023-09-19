const mongoos = require("mongoose");
const User = require("./user");
const Schema = mongoos.Schema;

const userSchema = new Schema({
  userDetails: { type: Object, unique: false },
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
  const date = new Date();
  let ISToffSet = 330;
  let offset = ISToffSet * 60 * 1000;
  let ISTTime = new Date(date.getTime() + offset);
  const oldmessage = this.conversation.message;
  let updatedCart = [...oldmessage];
  updatedCart.push({ ...message, dateIST: ISTTime });
  this.conversation.message = updatedCart;
  return this.save();
};

userSchema.methods.addAnswer = function (answer) {
  const date = new Date();
  let ISToffSet = 330;
  let offset = ISToffSet * 60 * 1000;
  let ISTTime = new Date(date.getTime() + offset);
  const oldanswer = this.conversation.answer;
  let updatedAnswer = [...oldanswer];
  updatedAnswer.push({ ...answer, dateIST: ISTTime });
  this.conversation.answer = updatedAnswer;
  return this.save();
};

userSchema.methods.addToImageSection = function (imageobj) {
  const date = new Date();
  let ISToffSet = 330;
  let offset = ISToffSet * 60 * 1000;
  let ISTTime = new Date(date.getTime() + offset);
  const imageOldQuery = this.imagesection;
  let updatedImageSection = [...imageOldQuery];
  updatedImageSection.push({ ...imageobj, dateIST: ISTTime });
  this.imagesection = updatedImageSection;
  return this.save();
};

module.exports = mongoos.model("User", userSchema);

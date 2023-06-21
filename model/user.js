const mongoos = require("mongoose");

const Schema = mongoos.Schema;

const userSchema = new Schema({
  apikeyindex: {
    type: Number,
  },
  maxApiKey: {
    type: Number,
  },
  conversation : {
    message : [{
      type:Object
    }],
    answer : [
      {
        type:Object
      }
    ]
  },
  ipAddress : {
    type:String
  }
});


userSchema.methods.addMessage = function(message){
  const oldmessage = this.conversation.message;
  let updatedCart = [...oldmessage];
  updatedCart.push(message)
  this.conversation.message = updatedCart
  return this.save();
}

userSchema.methods.addAnswer = function(answer)
{
  const oldanswer = this.conversation.answer;
  let updatedAnswer = [...oldanswer]
  updatedAnswer.push(answer)
  this.conversation.answer = updatedAnswer
  return this.save();
} 



module.exports = mongoos.model("User", userSchema);

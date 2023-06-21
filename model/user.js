const mongoos = require("mongoose");

const Schema = mongoos.Schema;

const userSchema = new Schema({
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
  },
  imageQuestion : [{
    type : Object
  }]
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
  let updatedAnswer = [...oldanswer];
  updatedAnswer.push(answer);
  this.conversation.answer = updatedAnswer;
  return this.save();
} 


userSchema.methods.addImageQuestion = function(imageQuestion){
  const oldQuery = this.imageQuestion;
  let updatedQuestion = [...oldQuery];
  updatedQuestion.push(imageQuestion);
  this.imageQuestion = updatedQuestion;
  return this.save();

}


module.exports = mongoos.model("User", userSchema);

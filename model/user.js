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
  imagesection : [{
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


userSchema.methods.addToImageSection = function(imageobj){
  const imageOldQuery = this.imagesection;
  console.log(imageOldQuery)
  let updatedImageSection = [...imageOldQuery];
  updatedImageSection.push(imageobj);
  console.log(updatedImageSection)
  this.imagesection = updatedImageSection;
  return this.save();
}


module.exports = mongoos.model("User", userSchema);

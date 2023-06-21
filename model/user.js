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

module.exports = mongoos.model("User", userSchema);

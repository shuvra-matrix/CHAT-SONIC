const mongoos = require("mongoose");

const Schema = mongoos.Schema;

const userSchema = new Schema({
  apikeyindex: {
    type: Number,
  },
});

module.exports = mongoos.model("User", userSchema);

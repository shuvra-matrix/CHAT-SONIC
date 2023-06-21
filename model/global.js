const mongoos = require("mongoose")
const Schema = mongoos.Schema;

const global = new Schema({
apikeyindex: {
    type: Number,
  },
maxApiKey: {
    type: Number,
  },
})


module.exports = mongoos.model("Global" , global)

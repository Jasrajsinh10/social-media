const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017");
// database connection check      
connect
  .then(() => {
  console.log("Connection Succcesful")
})
  .catch(() => {
    console.log("Connection Unsuccesfull")
  })
// login schema
const postcreschema = new mongoose.Schema({
  name : {
    type : String,
    required: true
  },
  comment : {
    type : String,
    required : true
  }
});
const posts = new mongoose.model("posts", postcreschema);

module.exports = posts;
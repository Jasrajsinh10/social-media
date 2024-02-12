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
const Loginschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});


const users = new mongoose.model("users", Loginschema);

module.exports = users;
// to take data in form of object from database

// converting data from user collection in object

const collection = require("./config");

let usersdata = collection.find()

module.exports = usersdata;
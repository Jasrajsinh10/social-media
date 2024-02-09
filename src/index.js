const express = require("express");
const path = require("path");
const users = require("./config");
const bcrypt = require("bcryptjs")
const app = express();
const posts = require("./cre");
// const usersdata = require("./datad")

const port = 8000;
app.set("view engine", "ejs");
app.set("views","views")

// convert data in json format

// app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
    
app.use(express.json());

app.listen(port, () => {
  console.log("server is working fine");
});

app.get("/", (req, res) => {
  res.render("login");
})
app.get("/signup", (req, res) => {
  res.render("signup");
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/home", async (req, res) => {
  let usersdata = await users.find();
  console.log(usersdata);
  res.render("home",{ usersdata });
})

app.get("/postcre", async (req, res) => {
  res.render("postcre");
})

/* -------------------------------------Adding username and password to database---------------------------------------*/
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password
  }
  const extinguisher = await users.findOne({ name: data.name });
  if (extinguisher) {
    res.send("user exsist");
    res.redirect("/signup");
  }
  else
  {
    const saltRounds = 10;
    const hashpassword = await bcrypt.hash( data.password , saltRounds);
    data.password = hashpassword;


    const userdata = await users.insertMany(data);
    // console.log(userdata);
    res.redirect("/login");
  }
})

/* -------------------------------------login page setup and username authentication---------------------------------------*/


app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const check = await users.findOne({ name })
    if (!check) {
      res.send("Usernname Not Found");
    }
    // const salt = await bcrypt.genSalt(10)
    // let passw = await bcrypt.hash(password,salt);
    const chek = await bcrypt.compare(password ,check.password);
    if (chek) {
      
      res.redirect("/home");
    }
    else {
      res.send("wrong crendentials");
    }
  }
  catch {
    res.send("wrong details");
  }
})
/* -------------------------------------post create and saving in database---------------------------------------*/ 
app.post("/postcre", async (req, res) => {
  const post = {
    name : req.body.name,
    comment : req.body.comment
  }
  const che = await users.findOne({name: post.name });
  if (!che) {
    // res.redirect("/home");
  } else {
    const userpost = await posts.insertMany(post)
    res.redirect("/home");
  }
    
    // console.log(che);

})

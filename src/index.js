const express = require("express");
const path = require("path");
const users = require("./config");
const bcrypt = require("bcryptjs")
const app = express();
const posts = require("./cre");

const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");

const port = 8000;
app.set("view engine", "ejs");
app.set("views", "views")
const session = require('express-session');
const { name } = require("ejs");

// convert data in json format

// app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: '123456789123456',
  resave: false,
  saveUninitialized: false
}));
app.get('/initialize-session', (req, res) => {
  // Accessing session data
  if (req.session.views) {
    req.session.views++;
    res.send(`You have visited this page ${req.session.views} times`);
  } else {
    req.session.views = 1;
    res.send('Welcome to the page! Refresh to increment the counter.');
  }
});

app.use(methodOverride('_method'));
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

// update is the page where you can see all your posts as user and start the edit of post
app.get("/update", async (req, res) => {
  const name = req.session.name;
  if (name !== undefined) {
    let postcom = await posts.find();
    // console.log(postcom);
    // console.log(name)
    res.render("update", { postcom, name });
  }
  else {
    res.redirect("/login")
  }
})

// here is api to edit your own post
app.get("/edit/:commentid", async(req, res) => {
  
  let postcom = await posts.find();
  console.log(req.params.commentid);
  postcom.forEach(po => {
    if (po.commentid == req.params.commentid) {
       post = po;
    }
  });
  // console.log(post)
  res.render("edit",{ post })
})

app.patch("/edit/:commentid", (req, res) => {
  
  let newcontent = req.body.comment;
  posts.updateOne({ commentid: req.params.commentid }, { comment: newcontent }).then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  })
  res.redirect("/home");
})
app.delete("/delete/:commentid", (req, res) => {
  posts.deleteOne({ commentid: req.params.commentid }).then((res) => {
    console.log(res);
  })
  res.redirect("/home");
})

// this the home page api
app.get("/home", async (req, res) => {
  let usersdata = await users.find();
  // console.log(usersdata);
  let postcom = await posts.find();
  // console.log(postcom);
  const name = req.session.name;
  // const commentidr = req.session.commentid;
  res.render("home",{ usersdata , postcom, name});
})

app.get("/postcre", async (req, res) => {
  const name = req.session.name;
  res.render("postcre",{name});
})

/* -------------------------------------Adding username and password to database---------------------------------------*/
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
    id: uuidv4()
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
    console.log(userdata);
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
      req.session.name = req.body.name;
      res.redirect("/home")
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
  const naame = req.session.name;
  const post = {
    commentid: uuidv4(),
    name : naame,
    comment : req.body.comment
  }
  
  // req.session.comment = req.post.comment;
  if (naame !== undefined) {
    const userpost = await posts.insertMany(post)
    res.redirect("/home");
  }
  else {
    res.redirect("/login")
  }
  
    
    // console.log(che);

})

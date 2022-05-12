const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const fs = require("fs");
const req = require("express/lib/request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const port = 3000;

const app = express();

app.set("view engine", "html");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "password",
  resave: false,
  saveUninitialized: true
}));

mongoose.connect("mongodb://localhost:27017/usersDB", { useNewUrlParser: true });

const usersSchema = {
  email: {
    type: String,
    required: [true, "enter your email"]
  },
  password: {
    type: String,
    required: [true, "enter your password"]
  },
  admin: {
    type: Boolean,
    default: false
  }
};

const Users = new mongoose.model("Users", usersSchema);

const admin1 = new Users({
  email: "eliyahabibi@gmail.com",
  password: 123,
  admin: true
});

const admin2 = new Users({
  email: "michaela@gmail.com",
  password: 123,
  admin: true
});

const admin3 = new Users({
  email: "liana@gmail.com",
  password: 123,
  admin: true
});
const admin4 = new Users({
  email: "colin@gmail.com",
  password: 123,
  admin: true
});

// Users.insertMany([admin1, admin2, admin3, admin4], function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("saved successfully");
//   }
// });

// Users.insertMany("/data.json", function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("saved successfully");
//   }
// });


app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/adminDash.html", function (req, res) {
  res.sendFile(__dirname + "/adminDash.html");
});

app.get("/login.html", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get("/signUp.html", function (req, res) {
  res.sendFile(__dirname + "/signUp.html");
});

app.get("/adminDash.html", function (req, res) {
  res.sendFile(__dirname + "/adminDash.html");
});

app.get("/index2.html", (req, res) => {
  if (req.session.users) {
    res.sendFile(__dirname + "/index2.html");
  }
  else {
    res.redirect("/login.html");
  }
});

// app.get("/userProfilePage.html", function (req, res) {
//   res.sendFile(__dirname + "/userProfilePage.html");
// });

app.get("/userProfilePage.html", function (req, res) {

  if (req.session.loggedIn) {

    console.log(req.session.user);


    let userProfilePage = fs.readFileSync(__dirname + "/userProfilePage.html", "utf8");
    let changeToJSDOM = new JSDOM(userProfilePage);
    
    changeToJSDOM.window.document.getElementById("userEmail").setAttribute("value", req.session.email);
    changeToJSDOM.window.document.getElementById("userPassword").setAttribute("value", req.session.password);

    res.send(changeToJSDOM.serialize());

  } else {
    res.redirect("/login.html");
  }

});

app.post("/userProfilePage.html", function (req, resp){

    const res = Users.updateOne({email: req.session.email}, {email:
    req.body.email, password: req.body.password});

    if(res.modifiedCount === 1){
      resp.sendFile(__dirname + "/userProfilePage.html");
    } else {
      console.log("error");
    }
});

// const newEmail = req.body.email;
// const newPassword = req.body.password;

// Users.update({email: req.session.email}, {$set : {email: newEmail}})
// Users.update({password: req.session.password}, {$set : {email: newPassword}})

// res.sendFile(__dirname + "/userProfilePage.html");

  // const input = new Users({
  //   email: req.body.email,
  //   password: req.body.password,
  //   isAdmin: false
  // });

  // input.save(function (err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.sendFile(__dirname + "/userProfilePage.html");
  //   }
  // });



app.post("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  req.session.destroy();
  res.redirect(__dirname + "/");
});

app.post("/adminDash.html", function (req, res) {
  Users.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.send(users);
    }
  });
});

app.post("/signUp.html", function (req, res) {
  const newUser = new Users({
    email: req.body.emailBox,
    password: req.body.password,
    isAdmin: false
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.sendFile(__dirname + "/index2.html");
    }
  });
});


app.post("/login.html", function (req, res) {
  const username = req.body.emailBox;
  const password = req.body.password;
  const isAdmin = Users.admin;

  Users.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser && foundUser.admin === false) {
        if (foundUser.password === password) {
          req.session.user = foundUser;
          req.session.loggedIn = true;
          req.session.email = username;
          req.session.password = password;
          res.sendFile(__dirname + "/index2.html");
        }
      }
      if (foundUser && foundUser.admin === true) {
        if (foundUser.password === password && foundUser.admin != isAdmin) {
          req.session.users = foundUser;
          req.session.loggedIn = true;
          req.session.email = username;
          req.session.password = password;
          res.sendFile(__dirname + "/adminDash.html");
        }
      }
    }
  });
});


app.listen(port, function () {
  console.log("server started on port " + port);
});
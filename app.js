//jshint esversion:6
require('dotenv').config();
const express = require("express");
const mongoose =require("mongoose");
const encrypt = require('mongoose-encryption');
const bodyParser = require("body-parser"); 
const ejs = require("ejs");
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ 
    extended: true 
}));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });



userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});

const user = mongoose.model('User', userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
   res.render("register");
});

app.post("/register",function(req,res){
    const Newuser = new user({
             email: req.body.username,
             password: req.body.password
    });
    Newuser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res){
   const logEmail = req.body.username;
   const logPassword = req.body.password;
   user.findOne({email:logEmail},function(err,foundlist){
       if(err){
           console.log(err);
       } else{ 
           if(foundlist){
              if(logPassword===foundlist.password){
                  res.render("secrets");
              }
              else{
                  res.redirect("/");
              }
          }
          else{
              res.redirect("/");
          }
      }
});

});

app.listen(3000,function(){
    console.log(`Example app lllistening at http://localhost:${port}`);
});
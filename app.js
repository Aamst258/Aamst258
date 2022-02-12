require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));  

mongoose.connect("mongodb://localhost:27017/aouthdb");

const authSchema = new mongoose.Schema( {
    email:String,
    password :  String
});   



console.log(process.env.API_KEY)
authSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields:["password"] });

const Auth = mongoose.model("auth", authSchema)


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
  });

  app.get("/register",function(req,res){
    res.render("register");
  });
app.post("/register",(req,res)=>{
    const user =  new Auth({
      email:req.body.username,
      password:req.body.password
    });
    user.save((err)=>{
        if(!err){
            res.render("secrets");
        } else{
            console.log(err);
        }
    });
});  


app.post("/login", function(req,res){

     const username = req.body.username;
     const password = req.body.password;
     
    Auth.findOne({email:username,}, (err,foundUser) =>{
       if(err){
           console.log(err);
       } else{
           if(foundUser){
               if(foundUser.password === password){
                   res.render("secrets");
               }
           }else{
               res.send("User not found");
           }
       }
    });
});

app.post("/logout")







app.listen("3000",function(){
    console.log("server started on port 3000")
})

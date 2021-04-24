//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');


mongoose.connect(
'mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema({email: String, password: String});


const secret = process.env.DB_SECRET;
userSchema.plugin(encrypt,{secret:secret, encryptedFields: ['password']});
const User = mongoose.model('User', userSchema );

app.get('/', function(req, res){



res.render('home');

}); // end of app.get /


app.route('/login')
  .get(function(req, res){

res.render('login');
}) // end of app.get /login
.post(function(req, res){

  User.findOne({email:req.body.username}, function(error, result){

    if(error){console.log(error);}

    else if( result === null){console.log('That email is not registered.');}
    else if(result.password !== req.body.password){
      console.log('wrong password');
    }
    else if(result.password === req.body.password){
      console.log('login successful');

      res.render('secrets');
    }

  }); // end of User.findone

}); // end of app.post login



app.route('/register')
.get(function(req, res){
res.render('register');
}) // end of app.get /register
.post( function(req, res){

User.findOne({email:req.body.username}, function(error, result){

  if(error){console.log(error);}

  else if( result !== null){console.log('That email is already registered.');}
  else{
    const newUser = new User({email: req.body.username, password: req.body.password});
    newUser.save();
    console.log('Success! You have registered a new account.');
    res.render('secrets');
  }
});


});//end of app.post / register

"use strict";
const express = require('express');
const router = express.Router();
const validator = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extend:false}));
//parse application/json - adds .body object to .req to easily access body attributes
app.use(bodyParser.json());

// bring in models with the same name defined in /models/user
let User = require('../models/user');

//URLs without /users/ because app.js is configured to route all requests with /users/ to this file

router.get('/register',(req,res)=>{
    res.render('register');
});

function validateCaptcha(captcha,req,res){
    console.log("captcha is:");
    console.log(captcha);
    let returnValue = true;
    if(
        captcha === undefined ||
        captcha === '' ||
        captcha === null
    ){
        console.log("empty recaptcha value");
        returnValue = false;
    }
        
    // Recaptcha Secret Key
    const secretKey = '6Lcfy0AUAAAAADSAACFJcONTrQks5ENnmxMZF0L2';
    // verify URL - es6 template string with backticks for using variables
    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
    
    // Make request to verifyURL
    request(verifyURL,(err,response,body)=>{
        //parse JSON to Object access properties
        body = JSON.parse(body);
        console.log("request to google");
        console.log(body);
        console.log(body.success);       
        // If not successfull
        if(body.success === undefined || !body.success){
            console.log("recaptcha failed!")
            returnValue = false;           
        }
        else{
        console.log("recaptcha passed!");}
    });
    console.log("returnValue of recaptchaValidadtion is: "+returnValue);
    return returnValue;
}

// Register process (post form)
router.post('/register',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.password2;
    const captcha = req.body.captcha;
    
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Valid email is required').notEmpty().isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        console.log("has errors");
        console.log(errors);
        res.send(500,'Error while validating fields!');
        return;
        //cant render view with errors during ajax request - how to solve?
        /* res.render('register',{
            errors:errors
         });*/
    } else {
        console.log("validating recaptcha");
        if(!validateCaptcha(captcha,req,res)){
            //send response back to site (answer ajax request)
            res.send(500,'Error while validation recaptcha!');
            return;
        }
        console.log("submit user");
        //Submit new user
        let user = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password, salt, (err,hash)=>{
                if(err){
                    console.log(err);
                }
                user.password = hash;
                user.save((err)=>{
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        req.flash('success', 'You are now registered and can log in');
                        //send response back to site (answer ajax request)
                        res.status(200).send();
                    }
                });     
            });
        });
    }
});

// Login Form
router.get('/login',(req,res)=>{
    res.render('login');
});

// Login Process
router.post('/login', (req,res,next)=>{
    //strategy name default is 'local', authenticate calls login() function and sets the user-data from db into req.user session variable
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })
    //????
    (req,res,next);
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success', 'You are now logged out!');
    res.redirect('/users/login');
});

function recaptchaValidation(req,res){
    if(
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ){
        return res.json({
            "msg": 'Please select captcha',
            "success": false
        });
    }
        
    // Recaptcha Secret Key
    const secretKey = '6Lcfy0AUAAAAADSAACFJcONTrQks5ENnmxMZF0L2';
    // verify URL - es6 template string with backticks for using variables
    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
    
    // Makre request to verifyURL
    request(verifyURL,(err,response,body)=>{
        //parse JSON to Object access properties
        body = JSON.parse(body);       
        // If not successfull
        if(body.success !== undefined || !body.success){
            return res.json({"msg": 'Failed captcha verification',"success": false});
        }
        // Successfull
        return res.json({"msg": 'Captcha passed',"success": true});
    });
}

module.exports = router;
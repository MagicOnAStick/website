"use strict";
const express = require('express');
const router = express.Router();
const validator = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// bring in models with the same name defined in /models/user
let User = require('../models/user');

//URLs without /users/ because app.js is configured to route all requests with /users/ to this file

router.get('/register',(req,res)=>{
    res.render('register');
});

// Register process (post form)
router.post('/register',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.password2;

    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Valid email is required').notEmpty().isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register',{
            errors:errors
        });
    } else {
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
                        //TODO double opt in
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login')
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
    //strategy name default is 'local', authenticate calls login() function and sets the req.user session variable
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

module.exports = router;
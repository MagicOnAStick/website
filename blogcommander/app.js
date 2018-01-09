"use strict";
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// connect to db
mongoose.connect("mongodb://localhost/blogcommander");
let db = mongoose.connection;

db.once('open',()=>{
    console.log('connected to mongodb');
});

// check for db errors
db.on('error',(err)=>{
    console.log(err);
});

// init app
const app = express();

// bring in models with the same name defined in /models/blogpost
let Blogpost = require('./models/blogpost');

// load template engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','pug');

// home route
app.get("/",(req,res)=>{
    let blogposts = Blogpost.find({},(err, blogposts)=>{
        if (err) {
            console.log(err);
        }else{
            res.render('index',{
                title: 'Blogcommander',
                blogposts: blogposts
            });
        }
    });
});

// add blogposts
app.get("/blogposts/add_blogpost",(req,res)=>{
    res.render('add_blogpost',{
        title: 'Add Blogpost'
    });
});


// start server
app.listen(3000,()=>{
    console.log("Server startet on port 3000");
});
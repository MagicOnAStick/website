"use strict";
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//express module for parsing html/json bodies
const bodyParser = require('body-parser');

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

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extend:false}));
//parse application/json
app.use(bodyParser.json());
//set public folder
app.use(express.static(path.join(__dirname,'public')));

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
app.get("/blogposts/add",(req,res)=>{
    res.render('add_blogpost',{
        title: 'Add Blogpost'
    });
});

// add submit POST Route
app.post("/blogposts/add",(req,res)=>{
    let blogpost = new Blogpost();
    blogpost.title = req.body.title;
    blogpost.author = req.body.author;
    blogpost.body = req.body.body;
    
    blogpost.save((err)=>{
        if (err) {
            console.log(err);
            return;
        }
        else{
            res.redirect("/");
        }
    });
});

// update submit POST Route
app.post("/blogposts/edit/:id",(req,res)=>{
    
    //empty json object. if the object would be 'new Blogpost()' an _id field would be there and would be updated, but is immutable which would cause an error
    let blogpost ={};
    blogpost.title = req.body.title;
    blogpost.author = req.body.author;
    blogpost.body = req.body.body;
    
    let query = {_id:req.params.id};

    //use the model not the variable for .update
    Blogpost.update(query,blogpost,(err)=>{
        if (err) {
            console.log(err);
            return;
        }
        else{
            res.redirect("/");
        }
    });
});

// get single blogpost
app.get('/blogpost/:id',(req,res)=>{
    Blogpost.findById(req.params.id, (err, blogpost)=>{
        res.render('show_blogpost', {
            //blogpost variable as parameter
            blogpost: blogpost
        });
    }); 
});

// load edit form
app.get('/blogpost/edit/:id',(req,res)=>{
    Blogpost.findById(req.params.id, (err, blogpost)=>{
        res.render('edit_blogpost', {
            //blogpost variable as parameter
            blogpost: blogpost,
            title: 'Edit Blogpost'
        });
    }); 
});

// start server
app.listen(3000,()=>{
    console.log("Server startet on port 3000");
});
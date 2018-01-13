"use strict";
const express = require('express');
const router = express.Router();
// bring in models with the same name defined in /models/blogpost
let Blogpost = require('../models/blogpost');


// add blogposts
router.get("/add",(req,res)=>{
    res.render('add_blogpost',{
        title: 'Add Blogpost'
    });
});

// add submit POST Route
router.post("/add",(req,res)=>{
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
            //params: 1. title (should be a bootstrap popup type) 2. The popup notification
            req.flash('success', 'Blogpost added');
            res.redirect('/');
        }
    });
});

// update submit POST Route
router.post("/edit/:id",(req,res)=>{
    
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
            req.flash('success', 'Blogpost updated');
            res.redirect("/");
        }
    });
});

// get single blogpost
router.get('/:id',(req,res)=>{
    Blogpost.findById(req.params.id, (err, blogpost)=>{
        res.render('show_blogpost', {
            //blogpost variable as parameter
            blogpost: blogpost
        });
    }); 
});

// load edit form
router.get('/edit/:id',(req,res)=>{
    Blogpost.findById(req.params.id, (err, blogpost)=>{
        res.render('edit_blogpost', {
            //blogpost variable as parameter
            blogpost: blogpost,
            title: 'Edit Blogpost'
        });
    }); 
});

router.delete('/:id',(req,res)=>{
    let query = {_id: req.params.id};
    //use model to delete
    Blogpost.remove(query,(err)=>{
        console.log(err);
    });
    //request from main.js -> send response- defaultcode = 200
    res.send("Successfully deleted Blogpost");
});

//export router
module.exports = router;
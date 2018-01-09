const express = require('express');
const path = require('path');

// init app
const app = express();

// load template engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','pug');

// home route
app.get("/",(req,res)=>{
    res.render('index',{
        title: 'Blogcommander'
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
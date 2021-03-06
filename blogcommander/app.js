"use strict";
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//express module for parsing html/json bodies
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

// connect to db
mongoose.connect(config.database);
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

//set 'views' to path so no /views/ is required before loading views (can directy loaded via viewname)
app.set('views',path.join(__dirname, 'views'));
// load template engine
app.set('view engine','pug');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extend:false}));
//parse application/json - adds .body object to .req to easily access body attributes
app.use(bodyParser.json());
//set/add public folder as node static folder for client stuff
app.use(express.static(path.join(__dirname,'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  }));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param,msg,value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//sets the variable if any url is accessed
app.get('*',(req,res,next)=>{
    //req.user is set if user successfully logged in (cookie storage)
    //create local variable 'user' can also be used in pug templates
    res.locals.user = req.user || null;
    //calls next middleware/route
    next();
});

//Route blogposts.js FILE
let blogposts = require('./routes/blogposts');
//Route path to file - so any url with /blogposts+x is routed to ./routes/blogposts.js with url /blogposts/+x eg. blogposts/add
app.use('/blogposts',blogposts);
//Route users.js File
let users = require('./routes/users');
app.use('/users',users);

// home route
app.get("/",ensureAuthenticated,(req,res)=>{
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

//TODO how to use ensureAuhenticated from users.js?
function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        //resume requests, requires next params
        return next();
    } else {
        req.flash('danger', 'Please login!');
        res.redirect('/users/login');
    }
}

// start server
app.listen(3000,()=>{
    console.log("Server startet on port 3000");
});
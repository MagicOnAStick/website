"use strict";
const mongoose = require('mongoose');

//Blogpost Schema
let blogpostSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});

let Blogpost = module.exports = mongoose.model('Blogpost',blogpostSchema);
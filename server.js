'use strict'

const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');
require('dotenv').config();

const app = express();
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(cors());

app.get('/hello', (req, res) =>{
    res.render('pages/index');
})

app.listen(process.env.PORT, () =>{
    console.log("Listening on port " + process.env.PORT)
})
'use strict'

const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser())
const baseAPIUrl = 'https://www.googleapis.com/books/v1/volumes';

app.get('/', (req, res) =>{
    res.render('pages/index');
})

app.get('/searches/new', (req, res) =>{
    res.render('pages/searches/new')
})

app.post('/searches', handleSearch)

app.listen(process.env.PORT, () =>{
    console.log("Listening on port " + process.env.PORT)
})

function Book(img_url, title, author_name, description){
    this.img_url = img_url;
    this.title = title;
    this.authorName = author_name;
    this.description = description || '';
}

function handleSearch(req, res){
    getBooksData(req.body.searchQuery, req.body.searchBy).then(data =>{
        res.render('pages/searches/show', {books:data})
    }).catch(error => res.render('pages/error', {error:error}))
}

function getBooksData(searchQuery, searchBy){
    let searchParams = `${searchQuery}+in${searchBy}`
    const query = {
        q: searchParams,
    }
    return superAgent.get(baseAPIUrl).query(query).then(books =>{
        return books.body.items.map(book =>{
            let results = book.volumeInfo;
            if(typeof results.authors === 'undefined'){
                results.authors = ['']
            }
            if(typeof results.imageLinks === 'undefined'){
                results.imageLinks= {thumbnail: `https://i.imgur.com/J5LVHEL.jpg`}
            }
            return new Book(results.imageLinks.thumbnail , results.title, results.authors[0],results.description)
        })
    }).catch(error => console.log("error", error))
}
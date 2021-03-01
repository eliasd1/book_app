'use strict'

const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');
const bodyParser = require('body-parser');
require('dotenv').config();
const pg = require('pg');
const app = express();
let client =new pg.Client(process.env.databaseUrl);
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser())
const baseAPIUrl = 'https://www.googleapis.com/books/v1/volumes';


app.get("/",handleHome)


app.get('/searches/new', (req, res) =>{
    res.render('pages/searches/new')
})

app.post('/searches', handleSearch)




function Book(img_url, title, author_name, description){
    this.img_url = img_url || `https://i.imgur.com/J5LVHEL.jpg`;
    this.title = title;
    this.authorName = author_name;
    this.description = description || '';
}
  
function handleHome(req,res){
getdataFromDb().then(data=>{

    res.render('pages/index',{data:data,length:data.length});
});
}

function getdataFromDb(){
    
    let myData="select * from favourite;"
    return client.query(myData).then(data => {
    return data.rows;
})}

function handleSearch(req, res){
    getBooksData(req.body.searchQuery, req.body.searchBy).then(data =>{
        console.log("data", data)
        res.render('pages/searches/show', {books:data})
    }).catch(error => res.render('pages/error', {error:error}))
}

function getBooksData(searchQuery, searchBy){
    let searchParams = `${searchQuery}+in${searchBy}`
    const query = {
        q: searchParams
    }
    return superAgent.get(baseAPIUrl).query(query).then(books =>{
        return books.body.items.map(book =>{
            let results = book.volumeInfo;
            if(typeof results.authors === 'undefined'){
                results.authors = ['']
            }
            return new Book(results.imageLinks.thumbnail , results.title, results.authors[0],results.description)
        })
    }).catch(error => res.render('pages/error', {error:error}))
}

client.connect().then(()=>{

app.listen(process.env.PORT, () =>{
    console.log("Listening on port " + process.env.PORT)
})}).catch(error=>
    console.log("cant conected databas"))


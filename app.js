const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose =require('mongoose')

//connecting to database
mongoose.connect('mongodb+srv://Paula:rerimoi@das-ahzne.gcp.mongodb.net/DAS').DAS;

const routes = require('./routes/index')

const app = express();
let PORT = 5000;

//view engine
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

app.listen(PORT, function(){
    console.log('listening to port' + PORT);
});
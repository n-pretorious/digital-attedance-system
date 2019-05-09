const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

//connecting to database
// NB: remember to pass it to nodemon.json
mongoose.connect('mongodb+srv://Paula:rerimoi@das-ahzne.gcp.mongodb.net/DAS', {useNewUrlParser: true}).DAS;

const routes = require('./routes')


const app = express();
let PORT = 5000;

//view engine
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static(__dirname + '/public'));

// Pass a secret to sign the secured http cookie
app.use(cookieParser(process.env.JWT_KEY))

app.use('/', routes)

app.listen(PORT, function(){
    console.log('listening to port' + PORT);
});
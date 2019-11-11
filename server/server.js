let bluebird = require('bluebird')
let redis = require('redis')
let config = require('./config')
let express = require('express')
let kafka = require('kafka-node')
var cors = require('cors')
const bodyParser = require('body-parser')

var app = express()

app.use(cors)
app.use(function(req, res, next) {
    let today = new Date();
    console.log(today.getMonth() + '/' +
        today.getDay() + '/' + today.getFullYear() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() +
        ': user\'s ip is ' + req.ip)
    next()
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


//Routes

//gets


//posts
const server = app.listen(config.appServer.port, ()=>{
    const host = server.address().address;
    const port = server.address().port;
    console.log(`DLT server listening on http://${')
})
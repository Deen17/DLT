let config = require('./config')
let express = require('express')
let kafka = require('kafka-node')
// var cors = require('cors')
const bodyParser = require('body-parser')
// const {promisify} = require('util')
// let redis = require('redis')
let bluebird = require('bluebird')
let redis = require('redis')
bluebird.promisifyAll(redis)
var fs = require('fs'),
    https = require('https'),
    http = require('http')

var privateKey = fs.readFileSync('../ssl/ca.key', 'utf8')
var certificate = fs.readFileSync('../ssl/ca.pem', 'utf8')
var credentials = {
    key: privateKey,
    cert: certificate
}
//express app
var app = express()

//redis client
let client = redis.createClient(
    6379,
    '127.0.0.1'
)

//kafka client
let HighLevelProducer = kafka.HighLevelProducer,
    kafkaClient = new kafka.KafkaClient({
        kafkaHost: '34.74.80.207:39092,131.247.3.206:9092',
        // rejectUnauthorized: false,
        // ca: [fs.readFileSync('./bin/chain.pem', 'utf-8')],
        // cert: [fs.readFileSync('./bin/kafkaadmin.pem', 'utf-8')],
        // key: [fs.readFileSync('./bin/kafkaadmin.key', 'utf-8')],
        // passphrase: "mypass",
    }),
    producer = new HighLevelProducer(kafkaClient, {
        requireAcks: 1
    })

// app.use(cors) //problematic
app.use(function (req, res, next) {
    let today = new Date();
    console.log(today.getMonth() + '/' +
        today.getDay() + '/' + today.getFullYear() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() +
        ': user\'s ip is ' + req.ip)
    next()
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

//Routes

//gets
app.get('/', (req, res) => res.send('Hello World!'))

app.get('/test', asyncMiddleware(async (req, res, next) => {
    console.log('test')
    let x = await client.getAsync('test');
    console.log(`x:${x}`)
    res.send({
        'test': x
    })
}))

app.get('/users/:id', asyncMiddleware(async (req, res, next) => {
    console.log(`GET /users/` + req.params.id)
    let userDetails = await client.hgetallAsync(`user:${req.params.id}`)
    res.send(userDetails)
}))

app.get('/banks/:bankid/users', asyncMiddleware(async (req, res, next) => {
    console.log(`GET /users/` + req.params.bankid)
    let users = await client.zrangeAsync(
        `bank:${req.params.bankid}`,
        0,
        -1)
    res.send({
        'users': users
    })
}))

// app.get('/', asyncMiddleware(async (req, res, next) => {

// }))

//posts
/*
http post :3000/users/transact transactionID="0000001" senderAcctNum="0001" receiverAcctNum="0001" senderRoutingNum="0001" receiverRoutingNum="0002" currency="USD" initial_amt:=100 amt:=100 instrument="credit" settled:=false mutations:='[]'
*/
app.post('/users/transact', asyncMiddleware(async (req, res, next) => {
    console.log('POST /users/transact')
    console.log(req.body)

    // req.body['initial_amt']=req.body['initialamt']
    // delete req.body['initialamt']
    // console.log(req.body)
    let payload = [
        {
            topic: `initiated_transactions`,
            messages: JSON.stringify(req.body)
        }
    ]
    producer.send(payload, function (err, res) {
        if (err) console.log(err)
        console.log('res', res)
    })
    let blockingClient = await client.duplicate()
    let val = await blockingClient.blpopAsync(`ready:${req.body.transactionID}`, 0)
    res.send({
        "response": val
    })
}))



// const server = app.listen(config.appServer.port, config.appServer.hostname, () => {
//     const host = server.address().address;
//     const port = server.address().port;
//     console.log(`DLT server listening at http://${host}:${port}`)
// });

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, '127.0.0.1', () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`DLT HTTP server listening at http://${host}:${port}`)
})

httpsServer.listen(8443, '127.0.0.1', () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`DLT HTTPS server listening at http://${host}:${port}`)
})
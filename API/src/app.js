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

var forceSSL  = require('express-force-ssl')
console.log('ir', fs.readdirSync('./'))

var privateKey = fs.readFileSync('./ssl/unsignedserver.key', 'utf8')
var certificate = fs.readFileSync('./ssl/unsignedserver.pem', 'utf8')
var credentials = {
    key: privateKey,
    cert: certificate,
    passphrase: config.credentials.passphrase
}
//express app
var app = express()

//redis client
let client = redis.createClient(
    config.redisOptions.port,
    config.redisOptions.ip, //'127.0.0.1'
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
// app.use(forceSSL)
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


/*
Get Users by Bank ID
Params:

 */
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

//posts

/*
http post :3000/users/transact transactionID="0000001" senderAcctNum="0001" receiverAcctNum="0001" senderRoutingNum="0001" receiverRoutingNum="0002" currency="USD" initial_amt:=100 amt:=100 instrument="credit" settled:=false mutations:='[]'
*/
/*
Create Transaction
Params:
    transactionID: string,
    senderAcctNum: string,
    receiverAcctNum: string,
    senderRoutingNum: string,
    recevierRoutingNum: string,
    currency: string,
    initial_amt: float,
    amt: float,
    instrument: string,
    settled: boolean,
    mutations: object (list)
Response:
    response: int (mostly just 0)
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

/*
Login method. 
Params:
    username: string,
    password: string
response:
    isBank:  boolean,
    verified: boolean
*/
app.post('/login', asyncMiddleware(async (req, res, next) => {
    console.log('POST /login')
    let accNum = await client.hgetAsync(
        "usernames",
        req.body.username)
    let getPass = await client.hgetAsync(`user:${accNum}`, 'password')
    let response = {
        'isBank': (parseInt(accNum) % 1000 ) == 0 ? true : false,
        'verified': (req.body.password == getPass) ? true : false
    }
    console.log(response)
    res.send(response)
}))


// const server = app.listen(config.appServer.port, config.appServer.hostname, () => {
//     const host = server.address().address;
//     const port = server.address().port;
//     console.log(`DLT server listening at http://${host}:${port}`)
// });

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, () => {
    const host = httpServer.address().address;
    const port = httpServer.address().port;
    console.log(`DLT HTTP server listening at http://${host}:${port}`)
})
const PORT = 8443;
httpsServer.listen(PORT, () => {
    const host = httpsServer.address().address;
    const port = httpsServer.address().port;
    console.log(`DLT HTTPS server listening at http://${host}:${port}`)
})
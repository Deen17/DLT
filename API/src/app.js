let config = require('./config')
let express = require('express')
let kafka = require('kafka-node')
var cors = require('cors')
const bodyParser = require('body-parser')
// const {promisify} = require('util')
// let redis = require('redis')
let bluebird = require('bluebird')
let redis = require('redis')
bluebird.promisifyAll(redis)
var fs = require('fs'),
    https = require('https'),
    http = require('http')

var forceSSL = require('express-force-ssl')
//console.log('dir', fs.readdirSync('./'))

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
let blockingClient = client.duplicate()

//kafka client
let HighLevelProducer = kafka.HighLevelProducer,
    kafkaClient = new kafka.KafkaClient({
        kafkaHost: config.kafka.bootstrap
        // rejectUnauthorized: false,
        // ca: [fs.readFileSync('./bin/chain.pem', 'utf-8')],
        // cert: [fs.readFileSync('./bin/kafkaadmin.pem', 'utf-8')],
        // key: [fs.readFileSync('./bin/kafkaadmin.key', 'utf-8')],
        // passphrase: "mypass",
    }),
    producer = new HighLevelProducer(kafkaClient, {
        requireAcks: 1
    })

var getTransactions = async function (id, start = 0, end = -1) {
    console.log(`GET /users/${id}/transactions/${start}/${end}`)
    let transactions = await client.zrevrangeAsync(
        `transactions:${id}`,
        start,
        end)
    return ({
        'transactions': transactions
    })
}

var getDelayedTransactions = async function (id, start = 0, end = -1) {
    console.log(`GET /banks/${id}/delayedtransactions/${start}/${end}`)
    let transactions = await client.zrevrangeAsync(
        `bankdelays:${id}`,
        start,
        end)
    return ({
        'transactions': transactions
    })
}

app.use(cors())
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
app.get('/', (req, res) => res.send('Hello World.'))

app.get('/test', asyncMiddleware(async (req, res, next) => {
    console.log('test')
    let x = await client.getAsync('test');
    console.log(`x:${x}`)
    res.send({
        'test': x
    })
}))


/**
 * @title getTransactionDetailsByID
 * @param {string} id
 * @returns {Object}
 */
app.get('/transaction/:id', asyncMiddleware(async (req, res, next) => {
    let transaction = await client.hgetallAsync(
        `transactionID:${req.params.id}`
    )
    res.send(transaction)
}))

/**
 * @title getDelayedTransactionDetailsByID
 * @param {string} id
 * @returns {Object}
 */
app.get('/delayedtx/:id', asyncMiddleware(async (req, res, next) => {
    let transaction = await client.hgetallAsync(
        `delayedtx:${req.params.id}`
    )
    res.send(transaction)
}))

app.get('/users/:id', asyncMiddleware(async (req, res, next) => {
    console.log(`GET /users/` + req.params.id)
    let userDetails = await client.hgetallAsync(`user:${req.params.id}`)
    res.send({
        name: userDetails.name,
        balance: userDetails.balance
    })
}))


/**
 @name GetUsersbyBank ID
Params:

 */
app.get('/banks/:bankid/users', asyncMiddleware(async (req, res, next) => {
    console.log(`GET /banks/${req.params.bankid}/users`)
    let users = await client.zrangeAsync(
        `bank:${req.params.bankid}`,
        0,
        -1)
    res.send({
        'users': users
    })
}))

/**
 * @name getTransactionCountByID
 * @param {number} id
 * @returns {number}
 */
app.get('/users/:id/transactioncount', asyncMiddleware(async (req, res, next) => {
    let response = await client.zcountAsync(
        `transactions:${req.params.id}`,
        -1,
        99999999
    )
    res.send({
        count: response
    })
    //res.send(response)
}))

app.get('/banks/:id/delayedcount', asyncMiddleware(async (req, res, next) => {
    let response = await client.zcountAsync(
        `bankdelays:${req.params.id}`,
        -1,
        99999999
    )
    res.send({
        count: response
    })
    //res.send(response)
}))

/**
 * @name getTransactionsByID
 * @param {number} id
 * @returns {Object} transactions
 */
app.get('/users/:id/transactions', asyncMiddleware(async (req, res, next) => {
    let response = await getTransactions(req.params.id)
    res.send(response)
}))

app.get('/users/:id/transactions/:start', asyncMiddleware(async (req, res, next) => {
    let response = await getTransactions(req.params.id, req.params.start)
    res.send(response)
}))

app.get('/users/:id/transactions/:start/:end', asyncMiddleware(async (req, res, next) => {
    let response = await getTransactions(
        req.params.id,
        req.params.start,
        req.params.end)
    res.send(response)
}))

app.get('/banks/:id/delayedtransactions', asyncMiddleware(async (req, res, next) => {
    let response = await getDelayedTransactions(req.params.id)
    res.send(response)
}))

app.get('/banks/:id/delayedtransactions/:start', asyncMiddleware(async (req, res, next) => {
    let response = await getDelayedTransactions(req.params.id, req.params.start)
    res.send(response)
}))

app.get('/banks/:id/delayedtransactions/:start/:end', asyncMiddleware(async (req, res, next) => {
    let response = await getDelayedTransactions(
        req.params.id,
        req.params.start,
        req.params.end)
    res.send(response)
}))



//posts

/*
http post :3000/users/transact transactionID="0000001" senderAcctNum="0001" receiverAcctNum="0001" senderRoutingNum="0001" receiverRoutingNum="0002" currency="USD" initial_amt:=100 amt:=100 instrument="credit" settled:=false mutations:='[]'
*/
/**
Create Transaction
Params:
    transactionID: string,
    senderAcctNum: string,
    receiverAcctNum: string,
    senderRoutingNum: string,
    receiverRoutingNum: string,
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
    transactionID = (await client.incrAsync('transaction'))
    req.body['transactionID'] = transactionID.toString().padStart(7, '0')
    console.log('transaction', req.body)

    let payload = [
        {   
            topic: `initiated_transactions`,
            messages: JSON.stringify(req.body)
        }
    ]
    producer.send(payload, function (err, producerResponse) {
        if (err) {
            console.log(err)
        }

        console.log('res', producerResponse)
    })

    let waitingClient = await client.duplicateAsync()

    if (req.body['initial_amt'] >= 10000) {
        console.log('transaction over 10000')
        let code = await waitingClient.blpopAsync( //blocking to waitingclient
            `readydelayed:${req.body['transactionID']}`,
            0)
        res.send({
            "response": "1"
        })
    }
    else {
        console.log('transaction under 10000')
        let val = await waitingClient.blpopAsync(`ready:${req.body['transactionID']}`, 0)
        res.send({
            "response": val[1]
        })
    }

}))

app.post('/banks/acceptDelay', asyncMiddleware(async (req, res, next) => {
    console.log('POST /banks/acceptDelay')
    req.body.mutations = []
    req.body.settled = true
    let letter = '';
    switch(req.body['senderRoutingNum']){
        case '0001':
            letter = 'A';
            break;
        case '0002':
            letter = 'B'
            break;
        default:
            break;
    }
    let waitingClient = await client.duplicateAsync()
    let payload = [
        {
            topic: `bank${letter}_DA`,
            messages: JSON.stringify(req.body)
        }
    ]
    producer.send(payload, function (err, producerResponse) {
        if (err) {
            console.log(err)
            res.send({
                "response": "2"
            })
        }
        console.log('res', producerResponse)
    })
    let val = await waitingClient.blpopAsync(`ready:${req.body['transactionID']}`, 0) //blocking to waiting
    res.send({
        "response": val[1]
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
    console.log(req.body.username, req.body.password)
    let accNum = await client.hgetAsync(
        "usernames",
        req.body.username)
    if (accNum == null)
        res.send({
            isBank: false,
            verified: false
        })
    let getPass = await client.hgetAsync(`user:${accNum}`, 'password')
    let response = {
        'isBank': (parseInt(accNum) % 1000) == 0 ? true : false,
        'verified': (req.body.password == getPass) ? true : false,
        'accNum': accNum.substr(4, 4),
        'routingNum': accNum.substr(0, 4)
    }
    console.log(response)
    res.send(response)
}))

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
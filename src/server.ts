import express = require("express")
import bodyParser = require('body-parser');

const { port, botToken } = require('./config');
const axios = require("axios").default;

const PORT = port || 5000
const app: express.Application = express()

const CHANNEL_NOT_FOUND = "channel_not_found"

const BASE_WEB_API_URL = "https://slack.com/api/"
const POST_MESSAGE = "chat.postMessage"

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const instance = axios.create({
    baseURL: BASE_WEB_API_URL,
    timeout: 1000,
    headers: { 
        "Content-type": "application/json", 
        "Authorization": "Bearer " + botToken
    }
})

app.post('/challenge', function(req, res) {
    console.log("message posted to channel")

    if (req.body["challenge"] != undefined) {
        const challenge = req.body["challenge"]
        res.send(challenge)
    } else {
        res.sendStatus(200)
        // Assume this was called because we got message.channel event from Slack
        const event = req.body["event"]
        const message = event["text"]
        
        console.log("Trying to match " + message)

        const reg = /<@[a-zA-Z0-9]+>\+{2}[\w\s]+/
        const match = message.search(reg)

        if (match  == -1) {
            console.log("We found a match of " + match)
        } else {
            axios.post("/" + POST_MESSAGE, {
                "token" : botToken,
                "channel" : "#shoutouts",
                "text" : match + "has 3 points"
            }).then((response) =>  {
                console.log(response())
            }, (error) => {
                console.log(error)
            })
            res.sendStatus(200)
        }
    }
})

app.get('/', function(req, res) {
    res.send("Good Morning Sunshine, the earth says hello!")
})

app.listen(PORT, function() {
    console.log("App is listening on " + PORT)
})

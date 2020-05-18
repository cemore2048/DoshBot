import express = require("express")
import bodyParser = require('body-parser');

const { port, botToken } = require('./config');

import axios, { AxiosResponse } from "axios";

const PORT = port || 5000
const app: express.Application = express()

const CHANNEL_NOT_FOUND = "channel_not_found"
let shoutOutChannel = ""

const BASE_WEB_API_URL = "https://slack.com/api/"
const POST_MESSAGE = "chat.postMessage"
const CHANNELS = "conversations.list"

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
    if (shoutOutChannel == "") {
        instance.get("/" + CHANNELS, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                "token": botToken,
                "types": "public_channel"
            }
        }).then((response: AxiosResponse) => {
            console.log("GETTING CHANNELS")
            console.log(response.data)
            const channels = response.data["channels"]
            for (let channel of channels) {
                if (channel["name"] == "shoutouts") {
                    console.log("Shout out channel identified")
                    shoutOutChannel = channel["id"]
                    break
                }
            }
        })
    }

    if (req.body["challenge"] != undefined) {
        const challenge = req.body["challenge"]
        res.send(challenge)
    }  else {
        // Assume this was called because we got message.channel event from Slack
        if (req.body["channel"] != shoutOutChannel) {
            const event = req.body["event"]
            console.log(event)

            const message = event["text"]
        
            console.log("Trying to match " + message)

            const reg = /<@[a-zA-Z0-9]+>\+{2}[\w\s]+/
            const match = message.match(reg)

            if (match  == null) {
                console.log("We found a match of " + match)
                res.sendStatus(200)
            } else {
                console.log("Posting for user " + match[0])
                instance.post("/" + POST_MESSAGE, {
                    "token" : botToken,
                    "channel" : "#shoutouts",
                    "text" : match + " has 3 points"
                }).then((response: AxiosResponse) => {
                    console.log("Successfull response")
                }, (error: AxiosResponse) => {
                    console.log(error)
                })

                res.sendStatus(200)
            }
            
        }
    }
})

app.get('/', function(req, res) {
    res.send("Good Morning Sunshine, the earth says hello!")
})

app.listen(PORT, function() {
    console.log("App is listening on " + PORT)
})

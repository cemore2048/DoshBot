import axios = require("axios")
import express = require("express")
import bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000
const app: express.Application = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.post('/challenge', function(req, res) {
    console.log("message posted to channel")

    if (req.body["challenge"] != undefined) {
        const challenge = req.body["challenge"]
        res.send(challenge)
    } else {
        // Assume this was called because we got message.channel event from Slack
        console.log(req.body)
        const event = req.body["event"]
        console.log(event)
        const message = event["text"]
        
        console.log("Trying to match " + message)

        const reg = RegExp("@[a-zA-Z0-9]+\\+{2}[\w\s]+")
        const match = message.search(reg)

        if (match  == -1) {
            console.log("We found a match of " + match)
        } else {
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

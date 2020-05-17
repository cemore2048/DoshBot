import axios = require("axios")
import express = require("express")

const PORT = process.env.PORT || 5000
const app: express.Application = express()
app.use(express.json())

app.post('/challenge', function(req, res) {
    const challenge = req.body["challenge"]
    res.send(challenge)
})

app.get('/', function(req, res) {
    res.send("Good Morning Sunshine, the earth says hello!")
})

app.listen(PORT, function() {
    console.log("App is listening on " + PORT)
})

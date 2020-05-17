import axios = require("axios")
import express = require("express")

const PORT = 3000
const app: express.Application = express()

app.get('/', function(req, res) {
    console.log("Someone came in and got got")
    res.send("Hello World")
})

app.listen(3000, function() {
    console.log("App is listening on " + PORT)
})

import axios = require("axios")
import express = require("express")

const PORT = process.env.PORT || 5000
const app: express.Application = express()

app.get('/', function(req, res) {
    res.send("Hello World")
})

app.listen(PORT, function() {
    console.log("App is listening on " + PORT)
})

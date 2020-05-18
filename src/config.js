// config.js
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  botToken: process.env.SLACK_BOT_TOKEN,
  port: process.env.PORT
};
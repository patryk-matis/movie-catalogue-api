const express = require("express");
const app = express();

app.use(express.json());

app.use('/api/movie', require('./routes/movieRoute'));

module.exports = app;
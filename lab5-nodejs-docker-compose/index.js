const mongoose = require('mongoose')
const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const port = process.env.PORT || 3010

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
  .then(() => console.log('Connected!'))
  .catch(err => console.log(err, 'Error connecting to MongoDB'));

app.get('/', (req, res) => {
  res.send('<h1>Lab 5 - Docker Compose</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
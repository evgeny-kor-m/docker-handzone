const express = require('express')
const app = express()
const mysql = require('mysql2');

require('dotenv').config()
const port = process.env.APP_PORT || 3000
console.log(process.env.APP_PORT)

const con = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSW,
    database: process.env.DB_NAME
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the MySQL database as id ' + con.threadId);
});

app.get('/', (req, res) => {
  res.send('Hello Ex - 02!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





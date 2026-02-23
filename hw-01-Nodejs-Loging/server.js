//server.js
const express = require('express');
const app = express()
const port = 3000

const log4js = require('log4js');
log4js.configure('log4js_config.json');
const logger = log4js.getLogger('app');

const instanceId = process.env.INSTANCE_ID

app.get('/', (req, res) => {
  res.send('Home work - 01!')
})
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        status: 'OK',
        timestamp: Date.now().toISOString()  };
    try 
    {  
        res.send(healthcheck);
        logger.info(`Health check called - ${instanceId}`);
        // logger.info(`${req.method} ${req.protocol.toUpperCase()} ${req.host}${req.originalUrl} ${process.env.INSTANCE_ID}`);
    } 
    catch (error) 
          {   healthcheck.status = error;
              res.status(503).send();
          }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
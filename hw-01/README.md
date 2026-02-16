npm init -y
npm i express
npm install log4js


docker run --name App1 -d -p 3001:3000  -v "$(pwd -W)/logs/app1:/usr/src/app/logs" my-node-health-app
docker run --name App2 -d -p 3002:3000  -v "$(pwd -W)/logs/app2:/usr/src/app/logs" my-node-health-app

FROM node:20

COPY ./package.json .

WORKDIR /usr/src/app

RUN npm install

COPY . .

EXPOSE 3000

CMD  ["node", "server.js"]
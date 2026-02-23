FROM node:20

COPY ./package.json .

RUN npm install 

ENV PORT 5000

COPY . .

EXPOSE 5000

CMD ["npm","start"]
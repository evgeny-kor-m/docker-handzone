
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# USER node 
# solution #1

RUN groupadd --gid 1050 express \
  && useradd --uid 1050 --gid express --shell /bin/bash --create-home express \
  && echo "root:12345" | chpasswd
# solution #2

# home directory
# user id -> /etc/passwd
# group id -> /etc/groups

EXPOSE 3000

CMD [ "npm", "start" ]

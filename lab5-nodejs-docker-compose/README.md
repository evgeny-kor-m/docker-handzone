docker build -t lab5-app:v0.1 -f .\app.dockerfile .

docker run -d --name Lab5-App -p 4000:3010 lab5-app
docker run -d --name Lab5-App -p 4000:5000 -e PORT=5000 lab5-app

docker run -d --name Lab5-App -p 4000:3010 lab5-app:v0.1

docker logs -f Lab5-App


run mongodb as docker container

docker run -d --name mongodb -p 27027:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=secretPassword -v mongodb_data:/data/db mongo

mongodb Private IP - "IPAddress": "172.17.0.2"
Lab5-App Private IP - "IPAddress": "172.17.0.3"

docker run -d --name Lab5-App -p 4000:3010 -e DB_HOST=172.17.0.2 -e DB_PORT=27017 lab5-app:v0.2

docker network ls
docker network create lab5-network

docker run -d --network lab5-network --name mongodb -p 27027:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=secretPassword -v mongodb_data:/data/db mongo
docker run -d --network lab5-network --name Lab5-App -p 4000:3010 -e DB_HOST=mongodb -e DB_PORT=27017 lab5-app:v0.2

docker compose up -d 

need to learn about user privilege - default root
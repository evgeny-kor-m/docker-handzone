```
docker build -t lab6:v0.1 .

docker run -d --name Lab6 -p 3000:3000 lab6:v0.1

docker exec -it Lab6 bash

whoami
- root

cat /etc/passwd -> node (user)

docker run -d --name Lab6 --user node -p 3000:3000 lab6:v0.1

docker exec -it Lab6 bash

whoami
- node

docker build -t lab6:v0.2 .

docker run -d --name Lab6 -p 3000:3000 lab6:v0.2

docker exec -it Lab6 bash

docker run -d --name Lab6 --user root -p 3000:3000 lab6:v0.1

cat /etc/os-release 
- Debian

docker build -t lab6:v0.3 .

docker run -d --name Lab6 --user express -p 3000:3000 lab6:v0.3

docker exec -it Lab6 bash

<!-- https://github.com/nodejs/docker-node -->
```

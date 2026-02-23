npm init -y

pip -> python
npm -> nodejs (javascript)

requirements.txt (libreries)
package.json (libreries)

Flask / Fast API - python
Express - nodejs

pip install flask
npm i express

node_modules (libreries) 1-3GB

py .\main.py
node .\server.js

node --version
v24.13.0
node -v
v24.13.0


git clone
-a----          2/9/2026   5:48 PM            146 Dockerfile
-a----          2/9/2026   5:27 PM          28947 package-lock.json
-a----          2/9/2026   5:27 PM            303 package.json
-a----          2/9/2026   5:43 PM            312 README.md
-a----          2/9/2026   5:37 PM            236 server.js

Build
docker build -t <tag_name> -f <dockerfile_path>
docker build -t lab1-dockerfile:v0.1 .

Image -> Container
docker run -d lab1-dockerfile:v0.1

-it -> interact mode .
-d  -> detatch mode
-port

container run and not exit - docker ps
container run but application doesnt work - docker logs
container exit - docker ps -a

docker build -t lab1-dockerfile:v0.2 .
docker run -d lab1-dockerfile:v0.2


docker run -d -p <host_port>:<container_port> lab1-dockerfile:v0.2
docker run -d -p 3000:3000 lab1-dockerfile:v0.2

docker run -d --name lab1-finish -p 3000:3000 lab1-dockerfile:v0.3

<!-- git clone https://github.com/YakirBar/docker-labs.git -->

git status
git add .
git commit -m "first_commit"
git push


1. Install Node JS
2. Verify - (node -v)
3. Create new folder for lab1
4. Open terminal + configure node - (npm init -y)
5. npm install express
6. https://expressjs.com/ -> copy paster - (server.js) - port 3000
7. Check if application work locally - node server.js
8. Create Dockerfile - using FROM COPY*2 RUN EXPOSE CMD
9. Docker build
10. Docker run new image and test in browser - port 5000

11. Push to GIT
-v flag <source_path>:<dest_path>

docker build -t lab3-vol .

docker run -d -p 3000:3000 --name Lab33 -v "$(pwd -W)/shared.txt:/usr/src/app/shared.txt" lab3-vol
$(pwd -W) — returns the Windows path (E:/DevOps/...)
docker run -d -p 3000:3000 --name Lab33   -v "E:/DevOps/GIT/docker-handzone/lab3-volume/shared.txt:/usr/src/app/shared.txt"   lab3-vol
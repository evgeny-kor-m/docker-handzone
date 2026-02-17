-v flag <source_path>:<dest_path>

docker build -t lab3-vol .

docker run -d -p 3000:3000 --name Lab33 -v "$(pwd -W)/shared.txt:/usr/src/app/shared.txt" lab3-vol
$(pwd -W) — returns the Windows path (E:/DevOps/...)
docker run -d -p 3000:3000 --name Lab33   -v "E:/DevOps/GIT/docker-handzone/lab3-volume/shared.txt:/usr/src/app/shared.txt"   lab3-vol

-----in the class
what is volume? shared file / folder (mirror)

volume file X=Y | file Y=X

mount file X | file X

docker run -d -p 3000:3000 --name Lab3 lab3-volume:v0.1

docker ps

docker exec -it Lab3 bash

-v flag <source_path>:<dest_path>

docker run -d -p 3000:3000 --name Lab3 -v .\shared_file.txt:/usr/src/app/shared_file.txt lab3-volume:v0.1

logs dataabse .env

backup

app1

server.js app2
server.js
logs - Volume to app1 & Volume to app2

logs <- Function that collect logs -> Dashboard that present logs

*/ example for mount */

-dit - like sleep infinity

alpine busybox

--rm flag meaniing delete after exit

mount VS volume

"Mounts": []

docker run --name lab3 -dit -v .\mountx.txt:/root/myvolume/mountx.txt busybox

docker exec -it lab3 sh

"Mounts": [ { "Type": "bind", "Source": "C:\Users\yakir\Desktop\docker-public-labs\lab 3 - volume\mountx.txt", "Destination": "/root/myvolume/mountx.txt", "Mode": "", "RW": true, "Propagation": "rprivate" } ],

Mount Binding -> docker cant control source path

docker run --name lab3 -dit -v /root/myvolume busybox

"Mounts": [ { "Type": "volume", "Name": "89831020a40e715ec3215b43023ef634f23889000a5fc0677a458b3524bf7799", "Source": "/var/lib/docker/volumes/89831020a40e715ec3215b43023ef634f23889000a5fc0677a458b3524bf7799/_data", "Destination": "/root/myvolume", "Driver": "local", "Mode": "", "RW": true, "Propagation": "" } ],

Volume - docker create and control source path

app1 container - metrics /var/lib/docker/metrics app2 container - metrics /var/lib/docker/metrics

metric-collector container - volume /var/lib/docker

/var/lib/docker/volume /var/lib/docker/metrics /var/lib/docker/logs

docker volume ls local 89831020a40e715ec3215b43023ef634f23889000a5fc0677a458b3524bf7799

docker volume inspect 89831020a40e715ec3215b43023ef634f23889000a5fc0677a458b3524bf7799

docker volume create lab3-volume docker run --name lab3 -dit -v lab3-volume:/root/myvolume busybox

"Mounts": [ { "Type": "volume", "Name": "lab3-volume", "Source": "/var/lib/docker/volumes/lab3-volume/_data", "Destination": "/root/myvolume", "Driver": "local", "Mode": "z", "RW": true, "Propagation": "" } ],

-v <host_path/volume_name>:<container_path> = old version --mount source=<host_path/volume_name>,destination=<container_path> = new version --mount src=<host_path/volume_name>,dst=<container_path> = new version --mount source=<host_path/volume_name>,target=<container_path> = new version

-v <host_path/volume_name>:<container_path>:ro = old version --mount src=<host_path/volume_name>,dst=<container_path>,read_only = new version --mount src=<host_path/volume_name>,dst=<container_path>,ro = new version

final command: docker run --name lab3 -dit --mount src=lab3-volume,target=/root/myvolume,ro busybox - this container can only read files docker run --name lab3-admin -dit --mount src=lab3-volume,target=/root/myvolume,rw busybox - this admin container can do anything

"Mounts": [ { "Type": "volume", "Name": "lab3-volume", "Source": "/var/lib/docker/volumes/lab3-volume/_data", "Destination": "/root/myvolume", "Driver": "local", "Mode": "z", "RW": false, "Propagation": "" } ],
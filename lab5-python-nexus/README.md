


-------------------------------- NexusHub EX --------------------------------

1.Create Python Web Application Using Flask/Fast API
2.Add Health-Check Route To Your Application (Return 200, "ok")
3.Build Your Image Using Tag python_health_check:v0.1
4.Test Locally The Application (Using Port 5000)
docker build -t python_health_check:v0.1 .
-----------------------------------------------------------------------------

5.Create Private Registry Nexus3 Using Docker Image - sonatype/nexus3:latest  URL [https://hub.docker.com/r/sonatype/nexus3]
6.Add Mount Binding / Volume For Persistent Data
	docker volume create --name nexus-data
	docker run -d -p 8081:8081  -p 8082:8082 --name nexus -v nexus-data:/nexus-data sonatype/nexus3
	To test ---     curl http://localhost:8081/
7.Login The Admin Panel VIA Port 8081
8.Create New Repository With Name <<lab5-private-hub>> Using Port 8082 - docker(hosted)
-----------------------------------------------------------------------------

9.Tag Existing Image For New Repository
10.Push The Docker Artifact To NexusHub
11.Delete The Image Locally And Pull Again From NexusHub Registry
docker login localhost:8082 
docker tag python_health_check:v0.1 localhost:8082/repository/lab5-private-hub:v0.1 
docker push localhost:8082/repository/lab5-private-hub:v0.1 
docker rmi localhost:8082/repository/lab5-private-hub:v0.1 
docker pull localhost:8082/repository/lab5-private-hub:v0.1

// allowed websites // 
DockerHub - https://hub.docker.com/explore 
Flask - https://flask.palletsprojects.com/en/stable/quickstart/ 
Nexus3 - https://help.sonatype.com/en/sonatype-nexus-repository.html

// practice commands // 
docker ps / images / build / volume / run / push / pull / tag / login

cat /etc/docker/daemon.json - only if registry located in different server { "insecure-registries": ["x.x.x.x:8082"] }

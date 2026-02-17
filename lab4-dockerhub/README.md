docker tag <old_image> <new_image>

docker tag lab4:v0.1 yakirbartech/lab4-public-registry:v0.1

docker push yakirbartech/lab4-public-registry:v0.1

docker pull yakirbartech/lab4-public-registry:v0.1

create account indockerhub
create public repository in dockerhub
create new node app listening to port <>
create dockerfile and build new new_image -- test locally
tag existing image with dockerhub tagname
push the artifact to dockerhub
delete lab4 images from locally
pull and run image (your friend image) from dockerhub public repository -- test locally
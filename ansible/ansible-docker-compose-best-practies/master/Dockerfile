# master 
FROM alpine:latest

WORKDIR /app

COPY . ./inventory.yml

RUN  apk update && apk add --no-cache openssh  vim  ansible  bash

CMD ["/usr/sbin/sshd", "-D"]